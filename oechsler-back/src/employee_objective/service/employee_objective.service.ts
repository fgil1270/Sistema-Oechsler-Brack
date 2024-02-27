import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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
            

            this.status.code = 201;
            this.status.message = 'Objetivos de empleado asignados correctamente';
            this.status.error = false;

            return this.status

        } catch (error) {
            this.status.error = true;
            this.status.message = error.message;
            this.status.code = 400;
            return this.status;
        }

 
    }

    async findAll(currdata, user: any){
        let status = {code: 200, message: 'OK', error: false};
        let dataEmployee = [];
        
        const percentage = await this.percentageDefinitionService.findOne(currdata.idYear);
        //se obtienen los empleados por jerarquia
        const employee = await this.organigramaService.findJerarquia(
            {
              type: currdata.type,
              startDate: '',
              endDate: '',
            }, 
            user
        );
        
        for (let index = 0; index < employee.length; index++) {
            const element = employee[index];
            const employeeObjetive = await this.employeeObjective.find({
                relations: {
                    objectiveEvaluation: true,
                    definitionObjectiveAnnual: true,
                    
                },
                where: {
                    definitionObjectiveAnnual: {
                        employee: {
                            id: element.id
                        },
                        percentageDefinition: {
                            id: currdata.idYear
                        }
                    }
                    
                }
            });

            let noDefinido = employeeObjetive.some((objetive) => objetive.status == 'No definido');

            
            dataEmployee.push({
                employee: element,
                status: noDefinido ? 'Definido' : 'No definido',
                year: percentage.status.code == 200 ? percentage.percentage.year : null
            });
            
            
        }

        
        return {
            employee: dataEmployee,
            status: status
        };
    }

    async findOneByEmployeeAndYear(employeeId: number, year: number) { 
        const DefinitionObjectiveAnnual = await this.definitionObjectiveAnnual.findOne({
            relations: {  
                employee: true, 
                evaluatedBy: true, 
                percentageDefinition: true, 
            }, 
            where: { 
                employee: { 
                    id: employeeId, 
                }, 
                percentageDefinition: { 
                    year: year, 
                }, 
            }, 
        });
        
        return DefinitionObjectiveAnnual;
    }



}
