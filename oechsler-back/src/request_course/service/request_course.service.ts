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
  DataSource
} from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { join } from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { format } from 'date-fns';

import { RequestCourse } from '../entities/request_course.entity';
import { RequestCourseAssignment } from '../entities/request_course_assignment.entity';
import { RequestCourseDocument } from '../entities/request_course_document.entity';
import {
  RequestCourseDto,
  UpdateRequestCourseDto,
  RequestCourseAssignmentDto,
  UpdateAssignmentCourseDto,
  RequestCourseAssessmentDto
} from '../dto/create_request_course.dto';
import { CourseService } from '../../course/service/course.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { CompetenceService } from '../../competence/service/competence.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { SupplierService } from '../../supplier/service/supplier.service';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';
import { RequestCourseAssessmentEmployee } from '../entities/request_course_assessment_employee.entity';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class RequestCourseService {
  constructor(
    @InjectRepository(RequestCourse) private requestCourse: Repository<RequestCourse>,
    @InjectRepository(RequestCourseAssignment) private requestCourseAssignment: Repository<RequestCourseAssignment>,
    @InjectRepository(RequestCourseDocument) private requestCourseDocument: Repository<RequestCourseDocument>,
    @InjectRepository(RequestCourseAssessmentEmployee) private requestCourseAssessmentEmployee: Repository<RequestCourseAssessmentEmployee>,
    private courseService: CourseService,
    private departmentService: DepartmentsService,
    private employeeService: EmployeesService,
    private competenceService: CompetenceService,
    private organigramaService: OrganigramaService,
    private supplierService: SupplierService,
    private employeeIncidenceService: EmployeeIncidenceService,
    @InjectDataSource() private dataSource: DataSource,
    private mailService: MailService,
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
        documents: true,
      },
      where: query as unknown as FindOptionsWhere<RequestCourse>,
    });

    requestCourse.filter((item) => {
      if (eployeesIds.includes(item.employee?.id)) {
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

      const { status, ...dataWithoutStatus } = data;
      Object.assign(requestCourse, dataWithoutStatus);

      if (data.courseId) {
        const course = await this.courseService.findOne(data.courseId);
        requestCourse.course = course;
        requestCourse.competence = course.competence;
      }

      //si el status es de la solicitud de curso es Autorizado
      //y se quiere cambiar a cancelado
      if (requestCourse.status == 'Asignado' && data.status == 'Cancelado') {
        //el estatus cambia de Asignado a Autorizado
        requestCourse.status = 'Autorizado';

      } else if (data.status == 'Autorizado') {
        //si el curso pasa a Autorizado
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
      //y la solicitud de curso esta en estatus solicitado
      //se cambia el status a Pendiente
      if (requestCourse.status == 'Solicitado' && data.status == 'Cancelado' && requestCourse.origin == 'Objetivo') {
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

  //actualizar asignacion de curso
  async updateAssignment(id: number, data: UpdateAssignmentCourseDto, user: any) {
    try {

      const assignment = await this.requestCourse.findOne({
        relations: {
          employee: true,
          course: true,
          department: true,
          requestCourseAssignment: {
            teacher: true,
          },
          leader: true,
          rh: true,
          requestBy: true,
        },
        where: {
          id: id,
        },
      });



      if (!assignment) {
        throw new NotFoundException('Asignación de curso no encontrada');
      }

      //Object.assign(assignment, data);

      if (data.dateStart && data.dateEnd) {
        // Convertir a horario de México
        const requestCourseAssignment = await this.requestCourseAssignment.findOne({
          relations: {
            requestCourse: true,
            teacher: true,
          },
          where: {
            id: assignment.requestCourseAssignment[0].id
          },
        });
        const dateStart = new Date(data.dateStart);
        const dateEnd = new Date(data.dateEnd);
        dateStart.setUTCHours(dateStart.getUTCHours() - 6);
        dateEnd.setUTCHours(dateEnd.getUTCHours() - 6);


        requestCourseAssignment.date_start = dateStart;
        requestCourseAssignment.date_end = dateEnd;
        const updateRequestCourseAssignment = await this.requestCourseAssignment.save(requestCourseAssignment);
      }

      //const updatedAssignment = await this.requestCourse.update(id, assignment);

      return {
        error: false,
        msg: 'Asignación de curso actualizada correctamente',
        //data: updateRequestCourseAssignment,
      };
    } catch (error) {

      return {
        error: true,
        msg: error.message,
      };
    }
  }

  //consulta los documentos de una solicitud de curso
  async getDocuments(idRequestCourse: number) {
    const requestCourse = await this.requestCourse.find({
      relations: {
        documents: true,
      },
      where: {
        id: idRequestCourse,
      },
    });
    if (requestCourse.length === 0) {
      throw new NotFoundException('Solicitud de curso no encontrada');
    }
    return {
      error: false,
      message: 'Documentos obtenidos con éxito',
      data: requestCourse[0].documents,
    };
  }

  async uploadMultipleFiles(idRequestCourse: number, files: Array<Express.Multer.File>, classifications: string[]) {

    const requestCourse = await this.requestCourse.findOne({
      relations: {
        employee: true,
        course: true,
        department: true,
        competence: true,
        leader: true,
        rh: true,
        gm: true,
        requestBy: true,
      },
      where: {
        id: idRequestCourse,
      },
    });
    if (!requestCourse) {
      throw new NotFoundException('Solicitud de curso no encontrada');
    }
    if (files.length !== classifications.length) {
      throw new Error('El número de archivos y clasificaciones debe coincidir');
    }
    // Aquí puedes procesar los archivos y sus clasificaciones
    const resultFiles = files.map((file, idx) => ({
      file,
      classification: classifications[idx],
    }));

    for (let index = 0; index < resultFiles.length; index++) {
      const archivo = resultFiles[index].file;
      const name = archivo.originalname;
      let path: any;
      let filepath: any;


      const createRequestDocument = await this.requestCourseDocument.create({
        name: name,
        route: `documents/solicitud-curso/${requestCourse.employee.name} ${requestCourse.employee.paternal_surname} ${requestCourse.employee.maternal_surname}/${requestCourse.id}/${requestCourse.course.name}`,
        type: resultFiles[index].classification,
        request_course: requestCourse,
      });


      path = join(
        __dirname,
        `../../../documents/solicitud-curso/${requestCourse.employee.name} ${requestCourse.employee.paternal_surname} ${requestCourse.employee.maternal_surname}/${requestCourse.id}/${requestCourse.course.name}`,
      );
      filepath = join(path, name);

      // Verifica si la ruta existe, si no, la crea
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }

      // Guarda el archivo en la ruta especificada
      writeFileSync(filepath, new Uint8Array(archivo.buffer));

      const newDocument = await this.requestCourseDocument.save(createRequestDocument);

    }

    const resultRequestCourseFiles = await this.requestCourse.find({
      relations: {
        documents: true,
      },
      where: {
        id: requestCourse.id,
      },
    });

    return {
      error: false,
      message: 'Archivos subidos con éxito',
      data: resultRequestCourseFiles,
    };

  }

  //Calificar curso por parte del empleado
  async assessmentCourse(idRequestCourse: number, data: RequestCourseAssessmentDto, user: any) {
    try {
      const requestCourse = await this.requestCourse.findOne({
        relations: {
          employee: true,
          course: true,
          department: true,
          competence: true,
          leader: true,
          rh: true,
          gm: true,
          requestBy: true,
          request_course_assessment_employee: true,
        },
        where: {
          id: idRequestCourse,
        },
      });

      if (!requestCourse) {
        throw new NotFoundException('Solicitud de curso no encontrada');
      }

      const createAssessment = this.requestCourseAssessmentEmployee.create({
        request_course: requestCourse,
        employee: requestCourse.employee,
        value_uno: data.value_uno,
        value_dos: data.value_dos,
        value_tres: data.value_tres,
        comment: data.comment
      });

      const assessment = await this.requestCourseAssessmentEmployee.save(createAssessment);

      //actualizar el status de la solicitud de curso a Evaluado
      requestCourse.status = 'Evaluado';

      await this.requestCourse.save(requestCourse);

      return {
        error: false,
        message: 'Curso calificado correctamente',
        data: assessment,
      };
    } catch (error) {
      return {
        error: error,
        mgs: error.message,
      };
    }
  }

  async updateCronRequestCourse() {
    let correoLideres: {
      employeeNumber: number;
      name: string;
      paternal_surname: string;
      maternal_surname: string;
      email: string;
      course: {
        name: string;
        employee: {
          employeeNumber: number;
          name: string;
          paternal_surname: string;
          maternal_surname: string;
        }[];
      }[];

    }[] = [];

    const request_course = await this.requestCourse.find({
      relations: {
        course: true,
        requestCourseAssignment: true,
        employee: {
          job: true,
          organigramaL: {
            leader: {
              userId: true,
            },
          },
        },
      },
      where: {
        status: In(['Asignado', 'Finalizado'])
      },
    });

    //se revisa si la fecha de finalizacion de la asignacion de curso es menor a la fecha actual
    //si es menor el status de la solicitud de curso se cambia a Finalizado

    let i = 0;
    for (const request of request_course) {

      if (request.requestCourseAssignment.length > 0) {
        const dateEnd = new Date(request.requestCourseAssignment[0].date_end);
        const currentDate = new Date();
        //si la fecha de finalizacion es menor a la fecha actual
        // y el status de la solicitud de curso es Asignado
        //se cambia el status a Finalizado
        if (dateEnd < currentDate && request.status == 'Asignado') {
          request.status = 'Finalizado';
          await this.requestCourse.save(request);
        }

        //si el status es Finalizado
        if (request.status == 'Finalizado') {
          //el periodo de eficiencia se suma con la fecha de finalizacion de la solicitud de curso

          const efficiencyPeriod = request.efficiency_period; //dias
          const dateEnd = new Date(request.requestCourseAssignment[0].date_end);
          dateEnd.setDate(dateEnd.getDate() + Number(efficiencyPeriod));
          //await this.requestCourse.save(request);
          //si la fecha actual es mayor a la fecha de finalizacion mas el periodo de eficiencia
          if (currentDate > dateEnd && efficiencyPeriod != null) {
            i++;
            request.status = 'Pendiente evaluar eficiencia';

            //si el empleado tiene un lider asignado en el organigrama
            if (request.employee.organigramaL.length > 0) {

              //se envia correo a los lideres de los empleados que tomaron el curso
              for (const emp of request.employee.organigramaL) {
                //si el lider tiene usuario y el lider puede evaluar
                if (emp.leader.userId && emp.evaluar) {

                  //recorre el array de correoLideres
                  if (correoLideres.length > 0) {

                    correoLideres.forEach((correo) => {
                      //si el lider ya existe en el array de correoLideres
                      if (correo.employeeNumber === emp.leader.employee_number) {
                        //si el curso ya existe en el array de correoLideres
                        //agrega el empleado al curso
                        correo.course.forEach((course) => {
                          if (course.name === request.course.name) {
                            course.employee.push({
                              employeeNumber: request.employee.employee_number,
                              name: request.employee.name,
                              paternal_surname: request.employee.paternal_surname,
                              maternal_surname: request.employee.maternal_surname,
                            });
                          } else {
                            //si el curso no existe en el array de correoLideres
                            //agrega el curso y el empleado
                            correo.course.push({
                              name: request.course.name,
                              employee: [{
                                employeeNumber: request.employee.employee_number,
                                name: request.employee.name,
                                paternal_surname: request.employee.paternal_surname,
                                maternal_surname: request.employee.maternal_surname,
                              }]
                            });
                          }
                        });

                      }
                    });
                  } else {

                    //si el lider no existe en el array de correoLideres
                    //agrega el lider y el curso y el empleado
                    correoLideres.push({
                      employeeNumber: emp.leader.employee_number,
                      name: emp.leader.name,
                      paternal_surname: emp.leader.paternal_surname,
                      maternal_surname: emp.leader.maternal_surname,
                      email: emp.leader.userId[0].email,
                      course: [{
                        name: request.course.name,
                        employee: [{
                          employeeNumber: request.employee.employee_number,
                          name: request.employee.name,
                          paternal_surname: request.employee.paternal_surname,
                          maternal_surname: request.employee.maternal_surname,
                        }]
                      }]
                    });
                  }



                }
              }
            } else {
              //si el empleado no tiene un lider asignado en el organigrama
              //se envia correo a los jefes de turno
              let jefesTurno = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
                .innerJoinAndSelect('employee.userId', 'user')
                .innerJoinAndSelect('user.roles', 'role')
                .where('role.name = :roleName', { roleName: 'Jefe de Turno' })
                .orderBy('employee.employee_number', 'ASC')
                .getMany();
              for (const jefe of jefesTurno) {
                //recorreo el array de correoLideres
                //recorre el array de correoLideres
                if (correoLideres.length > 0) {
                  correoLideres.forEach((correo) => {
                    //si el jefe ya existe en el array de correoLideres
                    if (correo.employeeNumber === jefe.employee_number) {
                      //si el curso ya existe en el array de correoLideres
                      //agrega el empleado al curso
                      correo.course.forEach((course) => {
                        //si el curso ya existe en el array de correoLideres
                        if (course.name === request.course.name) {
                          course.employee.push({
                            employeeNumber: request.employee.employee_number,
                            name: request.employee.name,
                            paternal_surname: request.employee.paternal_surname,
                            maternal_surname: request.employee.maternal_surname,
                          });
                        } else {
                          //si el curso no existe en el array de correoLideres
                          //agrega el curso y el empleado
                          correo.course.push({
                            name: request.course.name,
                            employee: [{
                              employeeNumber: request.employee.employee_number,
                              name: request.employee.name,
                              paternal_surname: request.employee.paternal_surname,
                              maternal_surname: request.employee.maternal_surname,
                            }]
                          });
                        }
                      });

                    } else {
                      //si el jefe no existe en el array de correoLideres
                      //agrega el jefe y el curso y el empleado
                      correoLideres.push({
                        employeeNumber: jefe.employee_number,
                        name: jefe.name,
                        paternal_surname: jefe.paternal_surname,
                        maternal_surname: jefe.maternal_surname,
                        email: jefe.userId[0].email,
                        course: [{
                          name: request.course.name,
                          employee: [{
                            employeeNumber: request.employee.employee_number,
                            name: request.employee.name,
                            paternal_surname: request.employee.paternal_surname,
                            maternal_surname: request.employee.maternal_surname,
                          }]
                        }]
                      });
                    }
                  });
                } else {
                  //si el lider no existe en el array de correoLideres
                  //agrega el lider y el curso y el empleado
                  correoLideres.push({
                    employeeNumber: jefe.employee_number,
                    name: jefe.name,
                    paternal_surname: jefe.paternal_surname,
                    maternal_surname: jefe.maternal_surname,
                    email: jefe.userId[0].email,
                    course: [{
                      name: request.course.name,
                      employee: [{
                        employeeNumber: request.employee.employee_number,
                        name: request.employee.name,
                        paternal_surname: request.employee.paternal_surname,
                        maternal_surname: request.employee.maternal_surname,
                      }]
                    }]
                  });
                }

              }

            }


          }


        }
      }

    }

    //enviar correo a los lideres
    for (const correo of correoLideres) {

      correo.course.forEach(async (course) => {
        let mailData = {
          curso: course.name,
          empleados: course.employee.map(emp => `(#${emp.employeeNumber}) ${emp.name} ${emp.paternal_surname} ${emp.maternal_surname} `),
        }

        await this.mailService.sendEmail('Evaluar Efectividad de Curso', mailData, ['f.gil@oechsler.mx'], 'evaluar_eficiencia_curso');
      });


    }



  }


}
