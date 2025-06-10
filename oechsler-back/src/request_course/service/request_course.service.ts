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
import { RequestCourseAssignment } from '../entities/request_course_assignment.entity';
import {
  RequestCourseDto,
  UpdateRequestCourseDto,
  RequestCourseAssignmentDto,
  UpdateAssignmentCourseDto
} from '../dto/create_request_course.dto';
import { CourseService } from '../../course/service/course.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { CompetenceService } from '../../competence/service/competence.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { SupplierService } from '../../supplier/service/supplier.service';
import { format } from 'date-fns';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';


@Injectable()
export class RequestCourseService {
  constructor(
    @InjectRepository(RequestCourse) private requestCourse: Repository<RequestCourse>,
    @InjectRepository(RequestCourseAssignment) private requestCourseAssignment: Repository<RequestCourseAssignment>,
    private courseService: CourseService,
    private departmentService: DepartmentsService,
    private employeeService: EmployeesService,
    private competenceService: CompetenceService,
    private organigramaService: OrganigramaService,
    private supplierService: SupplierService,
    private employeeIncidenceService: EmployeeIncidenceService
  ) { }

  async create(data: RequestCourseDto, user: any) {
    try {

      const employee = await this.employeeService.findMore(data.employeeId);
      const requestBy = await this.employeeService.findOne(user.idEmployee);
      let totalCost = 0;


      let course: any;
      let competence: any;

      if (data.courseId) {

        course = await this.courseService.findOne(data.courseId);
        competence = await this.competenceService.findOne(course.competence.id);
      } else {

        competence = await this.competenceService.findOne(data.competenceId);
      }



      totalCost = Number(data.cost) / Number(employee.emps.length);
      for (const emp of employee.emps) {
        const department = await this.departmentService.findOne(
          emp.department.id,
        );


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
          cost: totalCost,
          origin: data.origin,
          requestBy: requestBy.emp,
          status: data.status,
          type: data.type,
          place: data.place,
          evaluation_tool: data.evaluation_tool,
          comment: data.comment,
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
        employee: {
          job: true,
          organigramaL: {
            leader: {
              job: true,
            },
          },
        },
        department: true,
        competence: true,
        course: true,
        leader: true,
        rh: true,
        gm: true,
        requestBy: true,
        courseEfficiency: {
          courseEfficiencyQuestion: true,
        },
        requestCourseAssignment: {
          teacher: {
            supplier: true,
          },
        },
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
        needUser: true,
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
        requestCourseAssignment: true,
        requestBy: true,
      },
      where: query as unknown as FindOptionsWhere<RequestCourse>,
    });

    requestCourse.filter((item) => {
      if (eployeesIds.includes(item.employee.id)) {
        dataRequestCourse.push(item);
      }
    });

    const requestCourseAssignment = await this.requestCourseAssignment.find({
      relations: {
        requestCourse: true,
        teacher: true,
      },
    });

    return dataRequestCourse;
  }

  async findRequestCourseBy(query: Partial<UpdateRequestCourseDto>) {

    let findOption: {
      employee?: any;
      course?: any;
      status?: any;
    } = {};

    if (query.employeeId) {
      findOption.employee = {
        id: In(Array(query.employeeId))
      };
    }
    if (query.courseId) {
      findOption.course = {
        id: Number(query.courseId)
      };
    }

    if (query.status) {
      findOption.status = query.status;
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
      where: findOption,
    });

    return requestCourse;
  }

  async update(id, data: UpdateRequestCourseDto, user) {
    try {
      const userEmployee = await this.employeeService.findOne(user.idEmployee);
      const organigrama = await this.organigramaService.findJerarquia(
        {
          type: 'Normal',
          startDate: '',
          endDate: '',
        },
        user,
      );
      const requestCourse = await this.requestCourse.findOne({
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
          requestBy: true,
        },
        where: {
          id: id,
        },
      });

      Object.assign(requestCourse, data);

      if (data.courseId) {
        const course = await this.courseService.findOne(data.courseId);
        requestCourse.course = course;
        requestCourse.competence = course.competence;
      }

      if (data.status == 'Autorizado') {
        let isAdmin = false;
        let isLeader = false;
        let isRh = false;
        let isGm = false;


        isAdmin = user.roles.some((role) => role.name == 'Admin');
        isRh = user.roles.some((role) => role.name == 'RH');

        isLeader = organigrama.some((org) => org.id == requestCourse.employee.id);

        //si el usuario logueado es admin
        if (isAdmin) {
          const leader = await this.organigramaService.leaders(requestCourse.employee.id);
          requestCourse.approved_at_leader = new Date();
          requestCourse.leader = leader.orgs[0].leader;
          requestCourse.approved_at_rh = new Date();
          requestCourse.rh = userEmployee.emp;
          requestCourse.status = 'Autorizado'
        } else {
          if (isRh || data.avoidApprove) {
            requestCourse.approved_at_rh = new Date();
            requestCourse.rh = userEmployee.emp;

          }

          if (isLeader) {
            requestCourse.approved_at_leader = new Date();
            requestCourse.leader = userEmployee.emp;

          }

          if (data.avoidApprove) {
            const userApprove = await this.employeeService.findOne(user.idEmployee);
            const leader = await this.organigramaService.leaders(requestCourse.employee.id);
            requestCourse.approved_at_leader = new Date();
            requestCourse.leader = leader.orgs[0].leader;
            requestCourse.approved_at_rh = new Date();
            requestCourse.rh = userApprove.emp;

          }

          //si falta el lider por autorizar o rh 
          //el status sera Solicitado
          if (!requestCourse.leader || !requestCourse.rh) {
            requestCourse.status = 'Solicitado'
          }
        }



      }
      //si el curso es cancelado y el origen de la solicitud de curso viene de un objetivo
      //se cambia el status a Pendiente
      if (data.status == 'Cancelado' && requestCourse.origin == 'Objetivo') {
        requestCourse.status = 'Pendiente';
      }

      if (data.requestBy) {
        const requestBy = await this.employeeService.findOne(data.requestBy);
        requestCourse.requestBy = requestBy.emp;
      }

      if (data.employeeId) {
        const employee = await this.employeeService.findOne(data.employeeId[0]);
        requestCourse.employee = employee.emp;
      }


      if (data.tentativeDateStart) {

        // Convertir a horario de México
        const dateStart = new Date(data.tentativeDateStart);
        const dateEnd = new Date(data.tentativeDateEnd);
        dateStart.setUTCHours(dateStart.getUTCHours() - 6);
        dateEnd.setUTCHours(dateEnd.getUTCHours() - 6);

        requestCourse.tentative_date_start = dateStart;
        requestCourse.tentative_date_end = dateEnd;
      }

      const save = await this.requestCourse.save(requestCourse);

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
      //.addSelect('COUNT(request_course.status)', 'total')
      .addSelect('course.id', 'id_course')
      .addSelect('course.name', 'course_name')
      .addSelect('request_course.id', 'id_request_course')
      .innerJoin('request_course.course', 'course')
      .where('request_course.status = :status', { status: status })
      //.groupBy('request_course.status')
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

  //crear asignacion de curso
  async createAssignmentCourse(currData: RequestCourseAssignmentDto) {
    //revisar cuando sea el mismo empleado 2 veces
    try {
      const employees = await this.employeeService.findMore(currData.employeeId);
      const course = await this.courseService.findOne(currData.courseId);
      const teacher = await this.supplierService.findTeacherById(currData.teacherId);

      // Convertir a horario de México
      const dateStart = new Date(currData.dateStart);
      const dateEnd = new Date(currData.dateEnd);
      dateStart.setUTCHours(dateStart.getUTCHours() - 6);
      dateEnd.setUTCHours(dateEnd.getUTCHours() - 6);

      //const employeeIncidences = await this.employeeIncidenceService.findEmployeeIncidenceByEmployeeId(employees.emps.map((emp) => emp.id));
      //buscar solicitud de cursos aprobados de los empleados seleccionados
      const requestCourse = await this.requestCourse.find({
        where: {
          status: 'Autorizado',
          course: {
            id: course.id
          },
          employee: {
            id: In(employees.emps.map((emp) => emp.id))
          }
        }
      });

      //crear asignacion de curso

      const createAssignment = await this.requestCourseAssignment.create({
        date_start: format(dateStart, 'yyyy-MM-dd HH:mm:ss'),
        date_end: format(dateEnd, 'yyyy-MM-dd HH:mm:ss'),
        day: currData.day,
        requestCourse: requestCourse,
        teacher: teacher,

      });

      const assignment = await this.requestCourseAssignment.save(createAssignment);

      //se actualiza el costo de la solicitud de curso
      //se actualiza el status de la solicitud de curso
      for (const request of requestCourse) {
        request.status = 'Asignado';
        request.type = currData.type;
        request.place = currData.place;
        await this.requestCourse.save(request);
      }

      return {
        error: false,
        msg: 'Asignación de curso creada correctamente',
        data: assignment
      };
    } catch (error) {
      return {
        error: true,
        msg: error.message
      };
    }
  }

  //buscar asignacion de curso por algun parametro
  async getAssignmentBy(currdata: UpdateAssignmentCourseDto) {
    const mexicoTimeZone = 'America/Mexico_City';
    const formattedStartDate = new Date(currdata.dateStart);
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = new Date(currdata.dateEnd);
    formattedEndDate.setHours(23, 59, 59, 999);

    let findOption: {
      date_start: any;
      date_end: any;
      requestCourse: {
        status: string
      }
    } = {
      date_start: undefined,
      date_end: undefined,
      requestCourse: {
        status: ''
      }
    };

    if (currdata.dateStart && currdata.dateEnd) {

      findOption.date_start = MoreThanOrEqual(formattedStartDate);
      findOption.date_end = LessThanOrEqual(formattedEndDate);
    }

    if (currdata.status) {
      findOption.requestCourse.status
      findOption.requestCourse.status = currdata.status;
    }

    const requestCourseAssignment = await this.requestCourseAssignment.find({
      relations: {
        requestCourse: {
          employee: true,
          course: true,
          department: true,
        },
        teacher: true,
      },
      where: findOption
    });


    return requestCourseAssignment;
  }


}
