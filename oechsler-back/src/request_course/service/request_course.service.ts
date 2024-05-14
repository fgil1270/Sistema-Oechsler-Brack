import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  QueryRunner,
  FindOptionsWhere,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RequestCourse } from '../entities/request_course.entity';
import {
  RequestCourseDto,
  UpdateRequestCourseDto,
} from '../dto/create_request_course.dto';
import { CourseService } from '../../course/service/course.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { CompetenceService } from '../../competence/service/competence.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { data } from 'jquery';
import { error } from 'console';
import { groupBy } from 'rxjs';

@Injectable()
export class RequestCourseService {
  constructor(
    @InjectRepository(RequestCourse)
    private requestCourse: Repository<RequestCourse>,
    private courseService: CourseService,
    private departmentService: DepartmentsService,
    private employeeService: EmployeesService,
    private competenceService: CompetenceService,
    private organigramaService: OrganigramaService,
  ) {}

  async create(data: RequestCourseDto, user: any) {
    try {
      const employee = await this.employeeService.findMore(data.employeeId);
      const approvated = await this.employeeService.findOne(user.idEmployee);
      const department = await this.departmentService.findOne(
        approvated.emp.department.id,
      );
      let course: any;
      let competence: any;
      if (data.courseId) {
        course = await this.courseService.findOne(data.courseId);
        competence = await this.competenceService.findOne(course.competence.id);
      } else {
        competence = await this.competenceService.findOne(data.competenceId);
      }

      for (const emp of employee.emps) {
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
          cost: data.cost,
          origin: data.origin,
          requestBy: approvated.emp,
          status: data.status,
          type: data.type,
          evaluation_tool: data.evaluation_tool,
        });

        const requestCourse = await this.requestCourse.save(
          requestCourseCreate,
        );
      }

      return {
        error: false,
        mgs: 'Solicitud de curso creada correctamente',
        data: data,
      };
    } catch (error) {
      return {
        error: error,
        mgs: error.message,
      };
    }
  }

  findRequestCourseById(id: number) {
    return this.requestCourse.findOne({
      relations: {
        employee: true,
        department: true,
        competence: true,
        course: true,
        leader: true,
        rh: true,
        gm: true,
        requestBy: true,
      },
      where: {
        id: id,
      },
    });
  }

  async findAll(query: Partial<RequestCourse>, user: any) {
    const employee = await this.organigramaService.findJerarquia(
      {
        type: 'Normal',
        startDate: '',
        endDate: '',
      },
      user,
    );
    const dataRequestCourse = [];
    const eployeesIds = [];

    for (const emp of employee) {
      eployeesIds.push(emp.id);
    }

    const requestCourse = await this.requestCourse.find({
      relations: {
        employee: {
          organigramaL: {
            leader: true,
          },
        },
        department: true,
        competence: true,
        course: true,
        leader: true,
        rh: true,
        gm: true,
      },
      where: query as FindOptionsWhere<RequestCourse>,
    });

    requestCourse.filter((item) => {
      if (eployeesIds.includes(item.employee.id)) {
        dataRequestCourse.push(item);
      }
    });

    return dataRequestCourse;
  }

  async findRequestCourseBy(query: Partial<RequestCourse>) {
    if (query.approved_at_leader) {
      query.approved_at_leader = new Date(
        query.approved_at_leader,
      ) as unknown as Date; // Convert string to Date
    }

    const requestCourse = this.requestCourse.find({
      relations: {
        employee: {
          organigramaL: {
            leader: true,
          },
        },
        department: true,
        competence: true,
        course: true,
        leader: true,
        rh: true,
        gm: true,
      },
      where: query as FindOptionsWhere<RequestCourse>,
    });

    return requestCourse;
  }

  async update(id, data: Partial<RequestCourse>) {
    try {
      const requestCourse = await this.requestCourse.findOne({
        where: {
          id: id,
        },
      });

      Object.assign(requestCourse, data);

      //si el curso es cancelado y el origen de la solicitud de curso viene de un objetivo
      //se cambia el status a Pendiente
      if (data.status == 'Cancelado' && requestCourse.origin == 'Objetivo') {
        requestCourse.status = 'Pendiente';
      }

      const saeve = await this.requestCourse.save(requestCourse);

      return {
        error: false,
        msg: 'Solicitud de curso actualizada correctamente',
        data: data,
      };
    } catch (error) {
      return {
        error: true,
        msg: error.message,
      };
    }
  }

  //obteneer el total de solicitudes de curso por status
  async findRequestCourseApprove(status: string, user: any) {
    const courseApproved = await this.requestCourse
      .createQueryBuilder('request_course')
      .select('request_course.status')
      .addSelect('COUNT(request_course.status)', 'total')
      .addSelect('MAX(course.id)', 'id_course')
      .addSelect('MAX(course.name)', 'course_name')
      .innerJoin('request_course.course', 'course')
      .where('request_course.status = :status', { status: status })
      .groupBy('request_course.status')
      .getRawMany();
    const employees = await this.requestCourse
      .createQueryBuilder('request_course')
      .select('request_course.status')
      .addSelect('employee.id', 'id_employee')
      .addSelect('employee.name', 'name')
      .addSelect('employee.paternal_surname', 'paternal_surname')
      .addSelect('employee.maternal_surname', 'maternal_surname')
      .addSelect('request_course.id', 'id_request_course')
      .addSelect('request_course.courseId', 'id_course')
      .addSelect('employee.employee_number', 'employee_number')
      .innerJoin('request_course.employee', 'employee')
      .where('request_course.status = :status', { status: status })
      .getRawMany();

    return {
      courseApproved,
      employees,
    };
  }
}
