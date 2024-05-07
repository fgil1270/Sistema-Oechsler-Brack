import { Injectable, NotFoundException, forwardRef, Inject} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between, QueryRunner } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

import { RequestCourse } from '../entities/request_course.entity';
import { RequestCourseDto } from '../dto/create_request_course.dto';
import { CourseService } from '../../course/service/course.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { CompetenceService } from '../../competence/service/competence.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { data } from 'jquery';
import { error } from 'console';

@Injectable()
export class RequestCourseService{

    constructor(
        @InjectRepository(RequestCourse) private requestCourse: Repository<RequestCourse>,
        private courseService: CourseService,
        private departmentService: DepartmentsService,
        private employeeService: EmployeesService,
        private competenceService: CompetenceService,
        private organigramaService: OrganigramaService
    ) { }

    async create(data: RequestCourseDto, user: any){

        try {
            
            const employee = await this.employeeService.findMore(data.employeeId);
            const approvated = await this.employeeService.findOne(user.idEmployee);
            const department = await this.departmentService.findOne(approvated.emp.department.id);
            let course: any;
            let competence: any;
            if(data.courseId){
                course = await this.courseService.findOne(data.courseId);
                competence = await this.competenceService.findOne(course.competence.id);
            }else{
                competence = await this.competenceService.findOne(data.competenceId);
            }

            for(let emp of employee.emps){
                const requestCourseCreate = this.requestCourse.create({
                    course_name: data.courseName,
                    training_reason: data.traininReason,
                    efficiency_period: data.efficiencyPeriod,
                    priority: data.priority,
                    tentative_date_start: data.tentativeDateStart as any,
                    tentative_date_end: data.tentativeDateEnd as any,
                    approved_at_leader: null,
                    canceled_at_leader: null,
                    approved_at_rh: null,
                    canceled_at_rh: null,
                    approved_at_gm: null,
                    canceled_at_gm: null,
                    employee: emp,
                    department: department.dept,
                    competence: competence,
                    course: course ? course : null,
                    cost:  data.cost,
                    origin: data.origin,
                    requestBy: approvated.emp,
                    status: data.status,
                    type: data.type,
                    evaluation_tool: data.evaluation_tool,
                
                });

                const requestCourse = await this.requestCourse.save(requestCourseCreate);
            }

            

            return {
                error: false,
                mgs: 'Solicitud de curso creada correctamente',
                data: data
            };

        } catch (error) {
            return {
                error: error,
                mgs: error.message
            };
        }

    }

    findRequestCourseById(id: number){
        return this.requestCourse.findOne({
            relations: {
                employee: true,
                department: true,
                competence: true,
                course: true,
                leader: true,
                rh: true,
                gm: true,
                requestBy: true
            },
            where: {
                id: id
            }
        
        });
    }

    async findAll(user: any){
        const employee = await this.organigramaService.findJerarquia(
            {
              type: 'Normal',
              startDate: '',
              endDate: '',
            }, 
            user
        );
        let dataRequestCourse = [];
        let eployeesIds = [];

        for(let emp of employee){
            eployeesIds.push(emp.id);
        }
        
        const requestCourse = await this.requestCourse.find({
            relations: {
                employee: {
                    organigramaL: {
                        leader: true
                    },
                },
                department: true,
                competence: true,
                course: true,
                leader: true,
                rh: true,
                gm: true
                
            },
            where: {
                employee: {
                    id: In(eployeesIds)
                },
                
            }
        });

        

        return requestCourse;
    }

    async update(id, data) {
        
    }

}
