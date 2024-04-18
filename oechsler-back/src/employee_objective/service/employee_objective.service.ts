import { Injectable, NotFoundException, forwardRef, Inject} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between, QueryRunner } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit-table'; 
import * as moment from 'moment';
import { Readable } from 'stream';

import { CreateEmployeeObjectiveDto, UpdateObjectiveDTO, UpdateDncCourseDto, UpdateDncCourseManualDto, UpdateEmployeeObjectiveDtoPartial } from '../dto/create_employee_objective.dto';
import { DefinitionObjectiveAnnual } from '../entities/definition_objective_annual.entity';
import { EmployeeObjective } from '../entities/objective.entity';
import { DncCourse } from '../entities/dnc_course.entity';
import { DncCourseManual } from '../entities/dnc_manual.entity';
import { CompetenceEvaluation } from '../entities/competence_evaluation.entity';
import { CompetenceService } from '../../competence/service/competence.service';
import { CourseService } from '../../course/service/course.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { PercentageDefinitionService } from '../../evaluation_annual/percentage_definition/service/percentage_definition.service';
import { MailService } from '../../mail/mail.service';
import { save } from 'pdfkit';


@Injectable()
export class EmployeeObjetiveService {

    constructor(
        @InjectRepository(DefinitionObjectiveAnnual) private definitionObjectiveAnnual: Repository<DefinitionObjectiveAnnual>,
        @InjectRepository(EmployeeObjective) private employeeObjective: Repository<EmployeeObjective>,
        @InjectRepository(DncCourse) private dncCourse: Repository<DncCourse>,
        @InjectRepository(DncCourseManual) private dncCourseManual: Repository<DncCourseManual>,
        @InjectRepository(CompetenceEvaluation) private competenceEvaluation: Repository<CompetenceEvaluation>,
        private organigramaService: OrganigramaService,
        private percentageDefinitionService: PercentageDefinitionService,
        private employeeService: EmployeesService,
        private competenceService: CompetenceService,
        private courseService: CourseService,
        private mailerService: MailService,
    ) { }

    async create(currData: CreateEmployeeObjectiveDto, user: any){
        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        try {
            //si ya existe la asignacion de objetivos solo asigna las competencias por puesto
            let saveDefinitionObjetive: any;
            let employee: any;
            let evaluatedBy: any;
            
            if(currData.idObjectiveAnnual){
                employee = await this.employeeService.findOne(currData.idEmployee);
                evaluatedBy = await this.employeeService.findOne(user.idEmployee);
                saveDefinitionObjetive = await this.definitionObjectiveAnnual.findOne({
                    relations: {
                        employee: true,
                        percentageDefinition: true
                    },
                    where: {
                        id: currData.idObjectiveAnnual
                    }
                
                });

                saveDefinitionObjetive.status = 'Definido';
                
                await this.definitionObjectiveAnnual.save(saveDefinitionObjetive);


                //se guardan competencias del empleado
                for (let index = 0; index < currData.competenceEvaluation.length; index++) {
                    const element = currData.competenceEvaluation[index];
                    const competence = await this.competenceService.findOne(element.idCompetence);
                    const competenceEvaluation = await this.competenceEvaluation.findOne({
                        relations: {
                            definitionObjectiveAnnual: true,
                            competence: true
                        },
                        where: {
                            definitionObjectiveAnnual: {
                                id: saveDefinitionObjetive.id
                            
                            },
                            competence: {
                                id: competence.id
                            }
                        }
                    });
                    if(competenceEvaluation){
                        continue;
                    }

                    const createCompetence = this.competenceEvaluation.create({
                        type: element.type,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });
                    
                    await this.competenceEvaluation.save(createCompetence);
                
                }

            }else{
                const percentage = await this.percentageDefinitionService.findByYear(currData.idPercentageDefinition);
                employee = await this.employeeService.findOne(currData.idEmployee);
                evaluatedBy = await this.employeeService.findOne(user.idEmployee);
                const createDefinitionObjetive = this.definitionObjectiveAnnual.create({
                    percentageDefinition: percentage.percentage,
                    employee: employee.emp,
                    evaluatedBy: evaluatedBy.emp,
                    status: 'Definido'
                });

                saveDefinitionObjetive = await this.definitionObjectiveAnnual.save(createDefinitionObjetive);

                //se guardan los objetivos del empleado
                for (let index = 0; index < currData.employeeObjective.length; index++) { 
                    const element = currData.employeeObjective[index];
                    const createEmployeeObjective = this.employeeObjective.create({
                        area: element.area,
                        goal: element.goal,
                        calculation: element.calculation,
                        percentage: element.percentage,
                        comment: element.comment,
                        status: 'Definido',
                        definitionObjectiveAnnual: saveDefinitionObjetive
                    });

                    await this.employeeObjective.save(createEmployeeObjective);
                }

                //se guardan las metas del empleado por curso
                for (let index = 0; index < currData.dncCourse.length; index++) {
                    const element = currData.dncCourse[index];
                    const course = await this.courseService.findOne(element.idCourse);
                    const createDncCourse = this.dncCourse.create({
                        train: element.train,
                        priority: element.priority,
                        comment: element.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        course: course,
                    });

                    await this.dncCourse.save(createDncCourse);
                
                }

                //se guardan las metas del empleado por asignadas manualmente
                for (let index = 0; index < currData.dncCourseManual.length; index++) {
                    const element = currData.dncCourseManual[index];
                    const competence = await this.competenceService.findOne(element.idCompetence);
                    const createDncCourseManual = this.dncCourseManual.create({
                        goal: element.goal,
                        train: element.train,
                        priority: element.priority,
                        comment: element.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });

                    await this.dncCourseManual.save(createDncCourseManual);
                
                }

                //se guardan competencias del empleado
                for (let index = 0; index < currData.competenceEvaluation.length; index++) {
                    const element = currData.competenceEvaluation[index];
                    const competence = await this.competenceService.findOne(element.idCompetence);
                    const createCompetence = this.competenceEvaluation.create({
                        type: element.type,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });

                    await this.competenceEvaluation.save(createCompetence);
                
                }
            }
            
            
            
            const asigmentObjective = await this.definitionObjectiveAnnual.findOne({
                relations: {
                    employee: {
                        userId: true,
                    },
                    percentageDefinition: true,
                    evaluatedBy: true,
                    objective: true,
                    dncCourse: true,
                    dncCourseManual: true, 
                    competenceEvaluation: {
                        competence: true
                    },
                },
                where: {
                    id: saveDefinitionObjetive.id
                }
            })
            //se crea pdf con los objetivos del empleado
            // Create a new PDF document
            let y = 0;
            let y2 = 0;
            const doc = new PDFDocument({
                bufferPages: true
            });
            const pdftable = new PDFDocument({
                bufferPages: true
            });
            let age = moment().diff(employee.emp.date_employment, 'years');
            let datePDF = new Date();
            
    
            let i;
            let end;

            //image
            const logoImg = path.resolve(__dirname, '../../../assets/imgs/logo.png');
            doc.image(logoImg, 50, 50, {
                width: 90,
                height: 30,
                align: 'center',
            });
            //titulo
            doc.fontSize(20).text('Objetivos de Empleado', 200, 65);

            doc.moveDown();

            //tabla de datos generales
            const table1 = {
                title: "Datos Generales",
                headers: [
                    "Nombre de Empleado", "Numero de Nomina", "Fecha de contratación", "Puesto Actual", "Año de Evaluación", "Antiguedad en Puesto"],
                rows: [
                    [
                        `${employee.emp.name} ${employee.emp.paternal_surname} ${employee.emp.maternal_surname}`, 
                        `${employee.emp.employee_number}`, 
                        `${employee.emp.date_employment}`, 
                        `${employee.emp.job.cv_name}`, 
                        `${asigmentObjective.percentageDefinition.year}`, 
                        `${age} años`
                    ],
                ],
            };
            
            doc.table( table1, { 
                x: 40, 
                width: 550, 
                divider: {
                    header: {
                        disabled: false,
                        width: 2,
                        opacity: 0.5,
                    },
                    horizontal: {
                        disabled: false,
                        width: 1,
                        opacity: 0.5,
                    },
                    vertical: {
                        disabled: false,
                        width: 1,
                        opacity: 0.5,
                    },
                },
            }); 


            const table2 = {
                
                headers: [
                "Nombre del jefe superiro directo", 
                "Fecha de asignación de objetivos", 
                "Ultima fecha de Edición", 
                "Comentario de Edición"
                ],
                rows: [
                    [
                        `${evaluatedBy.emp.name} ${evaluatedBy.emp.paternal_surname} ${evaluatedBy.emp.maternal_surname}`, 
                        `${asigmentObjective.created_at}`, 
                        `${asigmentObjective.updated_at}`, 
                        `${asigmentObjective.comment_edit}`
                        
                    ]
                ],
            }
                
            doc.table( table2, { 
                x: 40, 
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
                
            });

            
            //tabla de metas y objetivos
            let arrayObjective = [];
            let totalObjective = 0;
            asigmentObjective.objective.forEach(element => {
                arrayObjective.push([`${element.goal}`, `${element.calculation}`, `${element.percentage}`, ``, ``, ``]);
                totalObjective += Number(element.percentage);
            });
            arrayObjective.push(["Total", "", `${totalObjective}`, "", "", ""]);
            const table3 = {
                title: "Metas y Objetivos",
                headers: [
                    "Metas y objetivos", "Criterio de Evaluación", "Definición", "Mitad de año", "Fin de año", "Porcentaje logrado"],
                rows: arrayObjective
            };

            doc.table( table3, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })

            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }


            //tabla de desempeño personal

            const table4 = {
                title: "Desempeño Personal",
                headers:[
                    "Factor", "Grado", "Comentarios", "Detalle"
                ],
                rows: [
                    [
                        "Conocimientos Tecnicos normativos",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Trabajo bajo presión",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Administración del tiempo",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Compromiso",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Toma de decisiones",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Promedio",
                        "",
                        "",
                        "",
                    ],
                    [
                        "Procentaje logrado",
                        "",
                        "",
                        "",
                    ]
                ]
            }

            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }

            doc.table( table4, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })

            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }

            //Competencias
            let arrayCompetence = [];
            asigmentObjective.competenceEvaluation.forEach(element => {
                arrayCompetence.push([`${element.type}`, `${element.competence.name}`, ``]);
            });
            arrayCompetence.push([
                "Promedio Competencias",
                "",
                ""
            ],
            [
                "Porcentaje logrado",
                "",
                ""
            ]);

            const table5 = {
                title: "Competencias",
                headers: [
                    "Tipo", "Competencia/Habilidad", "Calificación"
                ],
                rows: arrayCompetence                     
                
            }
            
            doc.table( table5, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })
            
            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }

            //evaluacion empleado
            const table6 = {
                title: "Evaluación de Empleado",
                headers: [
                    "Tipo", "Calificación", "Detalle", "Comentarios"
                ],
                rows: [
                    [
                        `Medio Año`, 
                        ``, 
                        ``, 
                        ``
                    ],
                    [
                        `Fin de Año`, 
                        ``, 
                        ``, 
                        ``
                    ]
                ]
            }

            doc.table( table6, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })

            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }


            //evaluacion jefe directo

            const table7 = {
                title: "Evaluación de Jefe Directo",
                headers: [
                    "Tipo", "Calificación", "Detalle", "Comentarios"
                ],
                rows: [
                    [
                        `Medio Año`, 
                        ``, 
                        ``, 
                        ``
                    ],
                    [
                        `Fin de Año`, 
                        ``, 
                        ``, 
                        ``
                    ]
                ]
            }

            doc.table( table7, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })

            if (doc.y > 650) {
                doc.addPage();
            } else {
                doc.moveDown();
            }

            //resumen
            const table8 = {
                title: "Resumen",
                headers: [
                    "Año", "Metas y Objetivos", "Desempeño Personal", "Competencias/Habilidades", "Total"
                ],
                rows: [
                    [
                        `${asigmentObjective.percentageDefinition.year}`, 
                        `${asigmentObjective.percentageDefinition.value_objetive}`, 
                        `${asigmentObjective.percentageDefinition.value_performance}`, 
                        `${asigmentObjective.percentageDefinition.value_competence}`,
                        `${Number(asigmentObjective.percentageDefinition.value_objetive)+Number(asigmentObjective.percentageDefinition.value_performance)+Number(asigmentObjective.percentageDefinition.value_competence)}`
                    ],
                    [
                        `Obtenido`, 
                        ``, 
                        ``, 
                        ``,
                        ``
                    ],
                    [
                        `Resumen`, 
                        ``, 
                        ``, 
                        ``,
                        ``
                    ]
                ]
            }

            doc.table( table8, {
                x: 40,
                width: 550,  
                divider: {
                    horizontal: {
                        width: 2,
                        opacity: 0.5,
                    },

                },
            })

            // see the range of buffered pages
            const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }
            // Footer
            for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
                doc.switchToPage(i);
                doc.fontSize(10).text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 90 , { align: 'right',  });
            }

            // manually flush pages that have been buffered
            doc.flushPages();

            const pdfPath= path.resolve(__dirname, `../../../documents/temp/objetivos/${datePDF.getFullYear()}${datePDF.getMonth()+1}${datePDF.getDate()}${datePDF.getHours()}${datePDF.getMinutes()}${datePDF.getSeconds()}.pdf`);
            doc.pipe(fs.createWriteStream(pdfPath));

            doc.end();

            let email: any;
            if(asigmentObjective.employee.userId.length > 0){
                email = await this.mailerService.sendEmailPDFFile('Objetivos de Empleado', `${datePDF.getFullYear()}${datePDF.getMonth()+1}${datePDF.getDate()}${datePDF.getHours()}${datePDF.getMinutes()}${datePDF.getSeconds()}.pdf`, [asigmentObjective.employee.userId? asigmentObjective.employee.userId[0].email : '']);
            }
            status.code = 201;
            status.message = 'Objetivos de empleado asignados correctamente, '+email.msg ;//email.msg;
            status.error = false;

            return status

        } catch (error) {
            status.error = true;
            status.message = error.message;
            status.code = 400;
            return status || 'Error al crear objetivos de empleado.';
        }

 
    }

    async createDefinitionObjectiveAnnual(currData: UpdateEmployeeObjectiveDtoPartial, user: any){

        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        let saveDefinitionObjetive = null;

        try {
            

            if(currData.id){

                saveDefinitionObjetive = await this.definitionObjectiveAnnual.findOne({
                    relations: {
                        employee: true,
                        percentageDefinition: true
                    },
                    where: {
                        id: currData.id
                    }
                
                });

                //se asigna un objetivo
                if(currData.employeeObjective){
                    const createEmployeeObjective = this.employeeObjective.create({
                        area: currData.employeeObjective.area,
                        goal: currData.employeeObjective.goal,
                        calculation: currData.employeeObjective.calculation,
                        percentage: currData.employeeObjective.percentage,
                        comment: currData.employeeObjective.comment,
                        status: 'Definido',
                        definitionObjectiveAnnual: saveDefinitionObjetive
                    });
    
                    await this.employeeObjective.save(createEmployeeObjective);

                    status.message = 'Objetivo asignado correctamente';
                    

                }

                //se asigna un curso ya existente
                if(currData.dncCourse){
                    const course = await this.courseService.findOne(currData.dncCourse.idCourse);
                    const createDncCourse = this.dncCourse.create({
                        train: currData.dncCourse.train,
                        priority: currData.dncCourse.priority,
                        comment: currData.dncCourse.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        course: course,
                    });
    
                    await this.dncCourse.save(createDncCourse);
                    status.message = 'Curso asignado correctamente';
                }

                //se asigna un curso de forma manual
                if(currData.dncCourseManual){
                    const competence = await this.competenceService.findOne(currData.dncCourseManual.idCompetence);
                    const createDncCourseManual = this.dncCourseManual.create({
                        goal: currData.dncCourseManual.goal,
                        train: currData.dncCourseManual.train,
                        priority: currData.dncCourseManual.priority,
                        comment: currData.dncCourseManual.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });
    
                    await this.dncCourseManual.save(createDncCourseManual);
                    status.message = 'Curso asignado correctamente';
                }

                //se asigna una competencia
                if(currData.competenceEvaluation){
                    const competence = await this.competenceService.findOne(currData.competenceEvaluation.idCompetence);
                    const competenceEvaluation = await this.competenceEvaluation.findOne({
                        relations: {
                            definitionObjectiveAnnual: true,
                            competence: true
                        },
                        where: {
                            definitionObjectiveAnnual: {
                                id: saveDefinitionObjetive.id
                            
                            },
                            competence: {
                                id: competence.id
                            }
                        }
                    });

                    if(!competenceEvaluation){
                        const createCompetence = this.competenceEvaluation.create({
                            type: currData.competenceEvaluation.type,
                            definitionObjectiveAnnual: saveDefinitionObjetive,
                            competence: competence,
                        });
        
                        await this.competenceEvaluation.save(createCompetence);
                        status.message = 'Competencia asignada correctamente';
                    }
                   
                    
                }

            }else{
                //si no se ha creado la definicion de objetivos se pone con status Incompleto
                const percentage = await this.percentageDefinitionService.findByYear(currData.year);
                const employee = await this.employeeService.findOne(currData.idEmployee);
                const evaluatedBy = await this.employeeService.findOne(user.idEmployee);
                const createDefinitionObjetive = this.definitionObjectiveAnnual.create({
                    percentageDefinition: percentage.percentage,
                    employee: employee.emp,
                    evaluatedBy: evaluatedBy.emp,
                    status: 'Incompleto'
                });
                

                //const saveDefinitionObjetive = await queryRunner.manager.save(createDefinitionObjetive);
                saveDefinitionObjetive = await this.definitionObjectiveAnnual.save(createDefinitionObjetive);

                //se guardan los objetivos del empleado
                if(currData.employeeObjective && currData.employeeObjective != null){
                    const createEmployeeObjective = this.employeeObjective.create({
                        area: currData.employeeObjective.area,
                        goal: currData.employeeObjective.goal,
                        calculation: currData.employeeObjective.calculation,
                        percentage: currData.employeeObjective.percentage,
                        comment: currData.employeeObjective.comment,
                        status: 'Definido',
                        definitionObjectiveAnnual: saveDefinitionObjetive
                    });
    
                    await this.employeeObjective.save(createEmployeeObjective);
                    status.message = 'Objetivo asignado correctamente';
                }

                //se guardan las metas del empleado por curso
                if(currData.dncCourse){
                    const course = await this.courseService.findOne(currData.dncCourse.idCourse);
                    const createDncCourse = this.dncCourse.create({
                        train: currData.dncCourse.train,
                        priority: currData.dncCourse.priority,
                        comment: currData.dncCourse.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        course: course,
                    });
    
                    await this.dncCourse.save(createDncCourse);
                    status.message = 'Curso asignado correctamente';
                }

                //se guardan las metas del empleado por asignadas manualmente
                if(currData.dncCourseManual){
                    const competence = await this.competenceService.findOne(currData.dncCourseManual.idCompetence);
                    const createDncCourseManual = this.dncCourseManual.create({
                        goal: currData.dncCourseManual.goal,
                        train: currData.dncCourseManual.train,
                        priority: currData.dncCourseManual.priority,
                        comment: currData.dncCourseManual.comment,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });
    
                    await this.dncCourseManual.save(createDncCourseManual);
                    status.message = 'Curso asignado correctamente';
                }

                //se guardan competencias del empleado
                if(currData.competenceEvaluation){
                    const competence = await this.competenceService.findOne(currData.competenceEvaluation.idCompetence);
                    const createCompetence = this.competenceEvaluation.create({
                        type: currData.competenceEvaluation.type,
                        definitionObjectiveAnnual: saveDefinitionObjetive,
                        competence: competence,
                    });
    
                    await this.competenceEvaluation.save(createCompetence);
                    status.message = 'Competencia asignada correctamente';
                }

                

            }


            status.code = 200;
            
            status.error = false;
            status.data = saveDefinitionObjetive;

            return status;
        } catch (error) {

            status.code = 400;
            status.message = error.message;
            status.error = true;
            return status || 'Error al crear objetivos de empleado.';
        }
    }

    //listar todos los empleados que tiene el lider
    async findAll(currdata, user: any){
        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        let dataEmployee = [];
        
        const percentage = await this.percentageDefinitionService.findOne(currdata.idYear);
        //se obtienen los empleados por jerarquia
        const employee = await this.organigramaService.findJerarquia(
            {
              type: 'Normal',
              startDate: '',
              endDate: '',
            }, 
            user
        );
        
        for (let index = 0; index < employee.length; index++) {
            const element = employee[index];
            if(user.idEmployee == element.id){
                continue;
            }
            //se busca si el empleado tiene objetivos asignados para el año seleccionado
            const definitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
                relations: {
                    employee: true,
                    percentageDefinition: true
                    
                },
                where: {
                    employee: { 
                        id: element.id 
                    },
                    percentageDefinition: {
                        id: currdata.idYear
                    }
                    
                }
            });

            let isDefine = definitionObjectiveAnnual? definitionObjectiveAnnual.status : 'No definido';

            dataEmployee.push({
                employee: element,
                objective: definitionObjectiveAnnual? definitionObjectiveAnnual : null,
                year: percentage.status.code == 200 ? percentage.percentage.year : null
            });
            
            
        }

        
        return {
            employee: dataEmployee,
            status: status
        };
    }

    async findObjectiveEmployee(id: number) { 
        let status = {code: 200, message: 'OK', error: false, definitionObjectiveAnnual: {}, status: 'success'};
        try {
            const definitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
                relations: {  
                    employee: true, 
                    evaluatedBy: true, 
                    percentageDefinition: true,
                    objective: true,
                    dncCourse: {
                        course: {
                            competence: true,
                        },
                    },
                    dncCourseManual: {
                        competence: true,
                    },
                    competenceEvaluation: {
                        competence: true,
                    },
                }, 
                where: { 
                   id: id
                }, 
            });

            status.code = 200;
            status.message = 'OK';
            status.error = false;

            return {
                definitionObjectiveAnnual,
                status: status
            };
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            return {
                definitionObjectiveAnnual: null,
                status: status
            };
        }

    }

    async findOneByEmployeeAndYear(idEmployee: number, year: number) { 
        let status = {code: 200, message: 'OK', error: false, definitionObjectiveAnnual: {}, status: 'success'};
        try {
            const definitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
                relations: {  
                    employee: true, 
                    evaluatedBy: true, 
                    percentageDefinition: true,
                    objective: true,
                    dncCourse: {
                        course: {
                            competence: true,
                        },
                    },
                    dncCourseManual: {
                        competence: true,
                    },
                    competenceEvaluation: {
                        competence: true,
                    },
                }, 
                where: { 
                    employee: { 
                        id: idEmployee, 
                    }, 
                    percentageDefinition: { 
                        year: year, 
                    }, 
                }, 
            });

            status.code = 200;
            status.message = 'OK';
            status.error = false;
            return {
                definitionObjectiveAnnual,
                status: status
            };
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            return {
                definitionObjectiveAnnual: null,
                status: status
            };
        }

    }

    async downloadPdf(currdata): Promise<Readable>{

        const employee = await this.employeeService.findOne(currdata.id);

        const doc = new PDFDocument({
            bufferPages: true
        });
        const pdftable = new PDFDocument({
            bufferPages: true
        });
        let y = 0;
        let y2 = 0;
        const datePDF = new Date();
        let i;
        let end;
        let arrayObjective = [];
        let totalObjective = 0;
        let age = moment().diff(employee.emp.date_employment, 'years');
        //image
        const logoImg = path.resolve(__dirname, '../../../assets/imgs/logo.png');
        doc.image(logoImg, 50, 50, {
            width: 90,
            height: 30,
            align: 'center',
        });
        //titulo
        doc.fontSize(20).text('Objetivos de Empleado', 200, 65);

        doc.moveDown();

        //tabla de datos generales
        const table1 = {
            title: "Datos Generales",
            headers: [
                "Nombre de Empleado", "Numero de Nomina", "Fecha de contratación", "Puesto Actual", "Año de Evaluación", "Antiguedad en Puesto"],
            rows: [
                [
                    `${employee.emp.name} ${employee.emp.paternal_surname} ${employee.emp.maternal_surname}`, 
                    `${employee.emp.employee_number}`, 
                    `${employee.emp.date_employment}`, 
                    `${employee.emp.job.cv_name}`, 
                    `${currdata.year}`, 
                    `${age} años`
                ],
            ],
        };
         
        doc.table( table1, { 
            x: 40, 
            width: 550, 
            divider: {
                header: {
                    disabled: false,
                    width: 2,
                    opacity: 0.5,
                },
                horizontal: {
                    disabled: false,
                    width: 1,
                    opacity: 0.5,
                },
                vertical: {
                    disabled: false,
                    width: 1,
                    opacity: 0.5,
                },
            },
        });

        const definitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
            relations: {
                employee: {
                    userId: true,
                },
                percentageDefinition: true,
                evaluatedBy: true,
                objective: true,
                dncCourse: true,
                dncCourseManual: true, 
                competenceEvaluation: {
                    competence: true
                },
            },
            where: {
                employee: {
                    id: currdata.id
                },
                percentageDefinition: {
                    year: currdata.year
                }
            }
        });


        //tabla de datos generales
        const table2 = {
            
            headers: [
            "Nombre del jefe superiro directo", 
            "Fecha de asignación de objetivos", 
            "Ultima fecha de Edición", 
            "Comentario de Edición"
            ],
            rows: [
                [
                    `${definitionObjectiveAnnual.evaluatedBy.name} ${definitionObjectiveAnnual.evaluatedBy.paternal_surname} ${definitionObjectiveAnnual.evaluatedBy.maternal_surname}`, 
                    `${definitionObjectiveAnnual.created_at}`, 
                    `${definitionObjectiveAnnual.updated_at}`, 
                    `${definitionObjectiveAnnual.comment_edit}`
                    
                ]
            ],
        }

        doc.table( table2, { 
            x: 40, 
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
            
        });


        //tabla de metas y objetivos
        definitionObjectiveAnnual.objective.forEach(element => {
            arrayObjective.push([`${element.goal}`, `${element.calculation}`, `${element.percentage}`, ``, ``, ``]);
            totalObjective += Number(element.percentage);
        });
        arrayObjective.push(["Total", "", `${totalObjective}`, "", "", ""]);
        const table3 = {
            title: "Metas y Objetivos",
            headers: [
                "Metas y objetivos", "Criterio de Evaluación", "Definición", "Mitad de año", "Fin de año", "Porcentaje logrado"],
            rows: arrayObjective
        };

        doc.table( table3, {
            x: 40,
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }


        //tabla de desempeño personal

        const table4 = {
            title: "Desempeño Personal",
            headers:[
                "Factor", "Grado", "Comentarios", "Detalle"
            ],
            rows: [
                [
                    "Conocimientos Tecnicos normativos",
                    "",
                    "",
                    "",
                ],
                [
                    "Trabajo bajo presión",
                    "",
                    "",
                    "",
                ],
                [
                    "Administración del tiempo",
                    "",
                    "",
                    "",
                ],
                [
                    "Compromiso",
                    "",
                    "",
                    "",
                ],
                [
                    "Toma de decisiones",
                    "",
                    "",
                    "",
                ],
                [
                    "Promedio",
                    "",
                    "",
                    "",
                ],
                [
                    "Procentaje logrado",
                    "",
                    "",
                    "",
                ]
            ]
        }

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }

        doc.table( table4, {
            x: 40,
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }

        //Competencias
        let arrayCompetence = [];
        definitionObjectiveAnnual.competenceEvaluation.forEach(element => {
            arrayCompetence.push([`${element.type}`, `${element.competence.name}`, ``]);
        });
        arrayCompetence.push([
            "Promedio Competencias",
            "",
            ""
        ],
        [
            "Porcentaje logrado",
            "",
            ""
        ]);

        const table5 = {
            title: "Competencias",
            headers: [
                "Tipo", "Competencia/Habilidad", "Calificación"
            ],
            rows: arrayCompetence                     
            
        }

        doc.table( table5, {
            x: 40,
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }

        //evaluacion empleado
        const table6 = {
            title: "Evaluación de Empleado",
            headers: [
                "Tipo", "Calificación", "Detalle", "Comentarios"
            ],
            rows: [
                [
                    `Medio Año`, 
                    ``, 
                    ``, 
                    ``
                ],
                [
                    `Fin de Año`, 
                    ``, 
                    ``, 
                    ``
                ]
            ]
        }

        doc.table( table6, {
            x: 40,
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }


        //evaluacion jefe directo

        const table7 = {
            title: "Evaluación de Jefe Directo",
            headers: [
                "Tipo", "Calificación", "Detalle", "Comentarios"
            ],
            rows: [
                [
                    `Medio Año`, 
                    ``, 
                    ``, 
                    ``
                ],
                [
                    `Fin de Año`, 
                    ``, 
                    ``, 
                    ``
                ]
            ]
        }

        doc.table( table7, {
            x: 40,
            width: 550,  
            divider: {
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        if (doc.y > 650) {
            doc.addPage();
        } else {
            doc.moveDown();
        }

        //resumen
        const table8 = {
            title: "Resumen",
            headers: [
                "Año", "Metas y Objetivos", "Desempeño Personal", "Competencias/Habilidades", "Total"
            ],
            rows: [
                [
                    `${definitionObjectiveAnnual.percentageDefinition.year}`, 
                    `${definitionObjectiveAnnual.percentageDefinition.value_objetive}`, 
                    `${definitionObjectiveAnnual.percentageDefinition.value_performance}`, 
                    `${definitionObjectiveAnnual.percentageDefinition.value_competence}`,
                    `${Number(definitionObjectiveAnnual.percentageDefinition.value_objetive)+Number(definitionObjectiveAnnual.percentageDefinition.value_performance)+Number(definitionObjectiveAnnual.percentageDefinition.value_competence)}`
                ],
                [
                    `Obtenido`, 
                    ``, 
                    ``, 
                    ``,
                    ``
                ],
                [
                    `Resumen`, 
                    ``, 
                    ``, 
                    ``,
                    ``
                ]
            ]
        }

        doc.table( table8, {
            x: 40,
            width: 550, 
            divider: {
                
                horizontal: {
                    width: 2,
                    opacity: 0.5,
                },

            },
        })

        // see the range of buffered pages
        const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }

        // Footer
        for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
            doc.switchToPage(i);
            doc.fontSize(10).text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 90 , { align: 'right',  });
        }

        // manually flush pages that have been buffered
        doc.flushPages();

        /* const pdfPath= path.resolve(__dirname, `../../../documents/temp/objetivos/${datePDF.getFullYear()}${datePDF.getMonth()+1}${datePDF.getDate()}${datePDF.getHours()}${datePDF.getMinutes()}${datePDF.getSeconds()}.pdf`);
        doc.pipe(fs.createWriteStream(pdfPath)); */

        //doc.pipe(req);

        
        doc.end();

        return doc as unknown as Readable;

    }

    //se actualiza el la definicion anual de objetivos
    async updateDefinitionObjective(id: number, currData: UpdateObjectiveDTO, user: any){
        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};

        try {
            const definitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
                relations: {
                    employee: true,
                    evaluatedBy: true,
                    percentageDefinition: true,
                    objective: true,
                    dncCourse: true,
                    dncCourseManual: true, 
                    competenceEvaluation: true,
                },
                where: {
                    id: id
                }
            });

            
            definitionObjectiveAnnual.comment_edit = currData.comment;
            definitionObjectiveAnnual.updated_at = new Date();

            await this.definitionObjectiveAnnual.save(definitionObjectiveAnnual);
            
            status.code = 200;
            status.message = 'Comentario editado correctamente';
            status.error = false;
            status.data = definitionObjectiveAnnual;
            return status;
        
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            status.status = 'error';
            return status;
        }
 
    }

    async updateObjective(id: number, currData: UpdateObjectiveDTO, user: any){

        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        
        try {
            const objective = await this.employeeObjective.findOne({
                where: {
                    id: id
                }
            });

            objective.area = currData.area;
            objective.goal = currData.goal;
            objective.calculation = currData.calculation;
            objective.percentage = currData.percentage;
            objective.comment = currData.comment;
            
            await this.employeeObjective.save(objective);
            
            status.code = 200;
            status.message = 'Objetivo editado con exito';
            status.error = false;
            status.data = objective;
            return status;
        
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            status.status = 'error';
            return status;
        }
    }

    async updateDnc(id: number, currData: UpdateDncCourseDto, user: any){

        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        
        try {
            const dnc = await this.dncCourse.findOne({
                relations: {
                    course: true
                },
                where: {
                    id: id
                }
                
            });

            const course = await this.courseService.findOne(currData.idCourse);

            dnc.train = currData.train;
            dnc.priority = currData.priority;
            dnc.comment = currData.comment;
            dnc.course = course;

            
            await this.employeeObjective.save(dnc);
            
            status.code = 200;
            status.message = 'DNC editado con exito';
            status.error = false;
            status.data = dnc;
            return status;
        
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            status.status = 'error';
            return status;
        }
    }

    async updateDncManual(id: number, currData: UpdateDncCourseManualDto, user: any){

        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};
        
        try {
            const dncManual = await this.dncCourseManual.findOne({
                relations: {
                    competence: true
                },
                where: {
                    id: id
                }
                
            });

            const competence = await this.competenceService.findOne(currData.idCompetence[0].id);

            dncManual.goal = currData.goal;
            dncManual.train = currData.train;
            dncManual.priority = currData.priority;
            dncManual.comment = currData.comment;
            dncManual.competence = competence;

            await this.dncCourseManual.save(dncManual);
            
            status.code = 200;
            status.message = 'DNC editado con exito';
            status.error = false;
            status.data = dncManual;
            return status;
        
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            status.status = 'error';
            return status;
        }
    }

    async deleteDetail(currData: any, user: any){
        let status = {code: 200, message: 'OK', error: false, data: {}, status: 'success'};

        try {
            if(currData.table == 'objetivo'){
                await this.employeeObjective.delete(currData.id);
            }else if(currData.table == 'dnc'){
                await this.dncCourse.delete(currData.id);
            }else if(currData.table == 'dncManual'){
                await this.dncCourseManual.delete(currData.id);
            }else if(currData.table == 'competence'){
                await this.competenceEvaluation.delete(currData.id);
            }
            
            status.code = 200;
            status.message = 'Detalle eliminado con exito';
            status.error = false;
            return status;
        
        } catch (error) {
            status.code = 400;
            status.message = error.message;
            status.error = true;
            status.status = 'error';
            return status;
        }
    }



}
