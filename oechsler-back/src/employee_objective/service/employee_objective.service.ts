import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
//import PDFDocument from 'pdfkit'; //pdfkit 
import PDFDocument from 'pdfkit-table'; 

import { CreateEmployeeObjectiveDto } from '../dto/create_employee_objective.dto';
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
import { he } from 'date-fns/locale';
import { render } from 'ejs';
import { title } from 'process';


@Injectable()
export class EmployeeObjetiveService {
    status = {code: 200, message: '', error: false};

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
        private mailerService: MailService
    ) { }

    async create(currData: CreateEmployeeObjectiveDto, user: any){

        try {
            const percentage = await this.percentageDefinitionService.findByYear(currData.idPercentageDefinition);
            const employee = await this.employeeService.findOne(currData.idEmployee);
            const evaluatedBy = await this.employeeService.findOne(user.idEmployee);
            const createDefinitionObjetive = this.definitionObjectiveAnnual.create({
                percentageDefinition: percentage.percentage,
                employee: employee.emp,
                evaluatedBy: evaluatedBy.emp,
                status: 'Definido'
            });

            const saveDefinitionObjetive = await this.definitionObjectiveAnnual.save(createDefinitionObjetive);

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
            
            try {
                const asigmentObjective = await this.definitionObjectiveAnnual.findOne({
                    relations: {
                        employee: true,
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
                const doc = new PDFDocument({
                    bufferPages: true
                });
                const pdftable = new PDFDocument({
                    bufferPages: true
                });
       
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
                            '11'
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

                doc.moveDown();

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

                doc.moveDown();
                
                //tabla de metas y objetivos
                let arrayObjective = [];
                let totalObjective = 0;
                asigmentObjective.objective.forEach(element => {
                    arrayObjective.push([`${element.goal}`, `${element.percentage}`, ``, ``, ``]);
                    totalObjective += Number(element.percentage);
                });
                arrayObjective.push(["Total", `${totalObjective}`, "", "", ""]);
                const table3 = {
                    title: "Metas y Objetivos",
                    headers: [
                        "Metas y objetivos", "Definición", "Mitad de año", "Fin de año", "Porcentaje logrado"],
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

                doc.moveDown();
                
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

                doc.moveDown();

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

                doc.moveDown();

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

                doc.moveDown();


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
                

                let datePDF = new Date();
                const pdfPath= path.resolve(__dirname, `../../../documents/temp/objetivos/${datePDF.getFullYear()}${datePDF.getMonth()+1}${datePDF.getDate()}${datePDF.getHours()}${datePDF.getMinutes()}${datePDF.getSeconds()}.pdf`);
                doc.pipe(fs.createWriteStream(pdfPath));
                doc.end();

                console.log(pdfPath);
                //se envia el pdf al empleado por correo
                let email: any = await this.mailerService.sendEmailPDFFile('Objetivos de Empleado', `${datePDF.getFullYear()}${datePDF.getMonth()+1}${datePDF.getDate()}${datePDF.getHours()}${datePDF.getMinutes()}${datePDF.getSeconds()}.pdf`, [asigmentObjective.employee.email? asigmentObjective.employee.email : '']);
                this.status.code = 201;
                this.status.message = 'Objetivos de empleado asignados correctamente, '+ email.msg;
                this.status.error = false;

            return this.status
            } catch (error) {
                console.log(error);
            }
            

        } catch (error) {
            this.status.error = true;
            this.status.message = error.message;
            this.status.code = 400;
            return this.status;
        }

 
    }

    //listar todos los empleados que tiene el lider
    async findAll(currdata, user: any){
        let status = {code: 200, message: 'OK', error: false};
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

    async findOneByEmployeeAndYear(idEmployee: number, year: number) { 
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

            this.status.code = 200;
            this.status.message = 'OK';
            this.status.error = false;
            return {
                definitionObjectiveAnnual,
                status: this.status
            };
        } catch (error) {
            this.status.code = 400;
            this.status.message = error.message;
            this.status.error = true;
            return {
                definitionObjectiveAnnual: null,
                status: this.status
            };
        }

    }



}
