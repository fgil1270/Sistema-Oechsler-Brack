import {Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  Code,
  DataSource,
  LessThan,
  Brackets
} from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import * as moment from 'moment';
import ical, {
  ICalCalendar,
  ICalAttendee,
  ICalAttendeeStatus,
  ICalCalendarMethod,
  ICalEventBusyStatus,
  ICalEventStatus,
  ICalEvent,
  ICalDateTimeValue,
  ICalEventRepeatingFreq
} from 'ical-generator';
import * as fs from 'fs';

import {
  CreateEmployeeIncidenceDto,
  UpdateEmployeeIncidenceDto,
  ReportEmployeeIncidenceDto,
} from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from '../entities/employee_incidence.entity';
import { DateEmployeeIncidence } from '../entities/date_employee_incidence.entity';
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { ChecadorService } from '../../checador/service/checador.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { MailData, MailService } from '../../mail/mail.service';
import { EmployeeProfile } from '../../employee-profiles/entities/employee-profile.entity';
import { UsersService } from '../../users/service/users.service';
import { CalendarService } from '../../calendar/service/calendar.service';
import { EnabledCreateIncidenceService } from 'src/enabled_create_incidence/service/enabled-create-incidence.service';
import { list, save } from 'pdfkit';
import { id, is } from 'date-fns/locale';

@Injectable()
export class EmployeeIncidenceService {
  constructor(
    @InjectRepository(EmployeeIncidence)
    private employeeIncidenceRepository: Repository<EmployeeIncidence>,
    @InjectRepository(DateEmployeeIncidence)
    private dateEmployeeIncidenceRepository: Repository<DateEmployeeIncidence>,
    private incidenceCatologueService: IncidenceCatologueService,
    private employeeService: EmployeesService,
    private employeeShiftService: EmployeeShiftService,
    @Inject(forwardRef(() => ChecadorService)) private checadorService: ChecadorService,
    private payRollService: PayrollsService,
    private organigramaService: OrganigramaService,
    private mailService: MailService,
    private userService: UsersService,
    private calendarService: CalendarService,
    private enabledCreateIncidenceService: EnabledCreateIncidenceService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createEmployeeIncidenceDto: CreateEmployeeIncidenceDto, user: any) {
    const idsEmployees: any = createEmployeeIncidenceDto.id_employee;
    const IncidenceCatologue = await this.incidenceCatologueService.findOne(
      createEmployeeIncidenceDto.id_incidence_catologue,
    );
    const employee = await this.employeeService.findMore(
      idsEmployees.split(','),
    );
    
    const leader = await this.employeeService.findOne(user.idEmployee);
    const startDate = new Date(createEmployeeIncidenceDto.start_date);
    const endDate = new Date(createEmployeeIncidenceDto.end_date);
    //si existe isProduction se obtiene el empleado de la incidencia
    //y si no, se obtiene del usuario
    const createdBy = createEmployeeIncidenceDto.isProduction? await this.employeeService.findOne(idsEmployees) : await this.employeeService.findOne(user.idEmployee) ;
    const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    let totalDays = 0;

    //recorre los empleados
    for (let j = 0; j < employee.emps.length; j++) {
      const element = employee.emps[j];
      
      let isLeader = false;
      user.roles.forEach((role) => {
        if (
          role.name == 'Jefe de Area' ||
          role.name == 'RH' ||
          role.name == 'Admin' || 
          role.name == 'Jefe de Turno'
        ) {
          isLeader = true;
        }
      });

      if (employee.emps[j].id == user.idEmployee) {
        isLeader = false;
      }

      //valida si esta habilitado para crear incidencia
      //se busca si esta habilitado para crear incidencia por payroll
      const enabledCreateIncidence = await this.enabledCreateIncidenceService.findByPayroll(employee.emps[j].payRoll.id);
      
      if (enabledCreateIncidence) {
        if (enabledCreateIncidence.enabled) {
          //si la fecha de la incidencia es menor o igual a la fecha inabilitada para crear incidencia
          //no permite crear incidencias
          if (format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd') <= format(new Date(enabledCreateIncidence.date), 'yyyy-MM-dd')) {
            throw new NotFoundException(
              `No esta habilitado para crear incidencia en la fecha ${format(
                new Date(createEmployeeIncidenceDto.start_date),
                'yyyy-MM-dd',
              )}, por favor revisa con Recursos Humanos`,
            );
          }
        }
      }

      for (
        let index = new Date(createEmployeeIncidenceDto.start_date + ' 00:00:00');
        index <= new Date(createEmployeeIncidenceDto.end_date);
        index = new Date(index.setDate(index.getDate() + 1))
      ) {
        const ifCreate = false;
        const weekDaysProfile = employee.emps[j].employeeProfile.work_days;

        const dayLetter = weekDays[index.getDay()];
        let dayLetterProfile = false;

        for (let h = 0; h < weekDaysProfile.length; h++) {
          const letraPerfil = weekDaysProfile[h];

          if (letraPerfil == dayLetter) {
            dayLetterProfile = true;
          }
        }

        

        //VERIFICA SI EL DIA ES FERIADO
        const dayHoliday = await this.calendarService.findByDate(
          format(index, 'yyyy-MM-dd'),
        );

        //SI EL DIA NO ES FERIADO
        if (!dayHoliday) {
          //SI EL DIA SELECCIONADO EXISTE EN EL PERFIL DEL EMPLEADO
          if (dayLetterProfile) {
            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            
            /* const employeeShiftExist =
              await this.employeeShiftService.findEmployeeShiftsByDate(index, [
                employee.emps[j].id,
              ]); */
            
            
            //obtener el turno del dia actual
            const employeeShiftExistActual = await this.employeeShiftService.findMore(
              {
                start: index,
                end: index
              }, [
                employee.emps[j].id,
              ]
            );

            //si no existe turno
            if(employeeShiftExistActual.events.length <= 0){

              //si la incidencia es una incapacidad
              if(IncidenceCatologue.code_band == 'INC'){
                let nameTurno = '';
                let i = 1;
                let horaInicio = '';
                let horaFin = '';
                let employeeShiftExistAnterior;

                do {
                  employeeShiftExistAnterior = await this.employeeShiftService.findMore(
                    {
                      start: new Date(new Date(index).setDate(new Date(index).getDate() - i)),
                      end: new Date(new Date(index).setDate(new Date(index).getDate() - i))
                    }, [
                      employee.emps[j].id,
                    ]
                  );
                  
                  nameTurno = employeeShiftExistAnterior.events[0].nameShift;
                  i++;
                } while (nameTurno == 'TI');

                const iniciaTurno = new Date(`${employeeShiftExistAnterior.events[0]?.start} ${employeeShiftExistAnterior.events[0]?.startTimeshift}`);
                const termianTurno = new Date(`${employeeShiftExistAnterior.events[0]?.start} ${employeeShiftExistAnterior.events[0]?.endTimeshift}`);
                
                if(nameTurno == 'T3'){
                  termianTurno.setDate(termianTurno.getDate() + 1)
                }
                const startTimeShift = moment(iniciaTurno, 'HH:mm');
                let endTimeShift = moment(termianTurno, 'HH:mm');

                //se obtiene la hora de inicio y fin del turno
                const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
                const hourShift = endTimeShift.diff(startTimeShift, 'hours');
                const minShift = endTimeShift.diff(startTimeShift, 'minutes');

                createEmployeeIncidenceDto.total_hour = createEmployeeIncidenceDto.total_hour + Number(hourShift +'.'+(minShift % 60))
                
                //crea turno incidencia
                const createShift = await this.employeeShiftService.create({
                  employeeId: [employee.emps[j].id],
                  shiftId: 5,
                  patternId: 0,
                  start_date: format(index, 'yyyy-MM-dd'),
                  end_date: format(index, 'yyyy-MM-dd'),
                  
                });

              }else{
                //si el turno del dia anterior existe y es turno 3 y el dia de hoy es sabado
                let diaAnterior = new Date(index); 
                const employeeShiftAnterior = await this.employeeShiftService.findMore(
                  {
                    start: new Date(new Date(diaAnterior).setDate(new Date(diaAnterior).getDate() - 1)),
                    end: new Date(new Date(diaAnterior).setDate(new Date(diaAnterior).getDate() - 1))
                  }, [
                    employee.emps[j].id,
                  ]
                );
                if(employeeShiftAnterior.events[0].nameShift == 'T3' && index.getDay() == 6){
                  continue;
                }else{
                  //si no es incapacidad y no tiene turno y no es domingo
                  throw new NotFoundException(`No Employee Shifts found for the date ${format(index, 'yyyy-MM-dd')}`);
                }

                
              }
            }

            totalDays++;
            
          } else {
            //si el dia no pertenece al perfil
            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            let sql = `select * from employee_shift where employeeId = ${
              employee.emps[j].id
            } and start_date = '${format(index, 'yyyy-MM-dd')}'`;
            const employeeShiftExist = await this.employeeIncidenceRepository.query(sql);

            if (employeeShiftExist.length > 0) {
              totalDays++;
            }else if(IncidenceCatologue.code_band == 'INC'){
              //si la incidencia es una incapacidad
              let nameTurno = '';
              let i = 1;
              let horaInicio = '';
              let horaFin = '';
              let employeeShiftExistAnterior;

              do {
                employeeShiftExistAnterior = await this.employeeShiftService.findMore(
                  {
                    start: new Date(new Date(index).setDate(new Date(index).getDate() - i)),
                    end: new Date(new Date(index).setDate(new Date(index).getDate() - i))
                  }, [
                    employee.emps[j].id,
                  ]
                );
                
                nameTurno = employeeShiftExistAnterior.events[0].nameShift;
                i++;
              } while (nameTurno == 'TI');

              const iniciaTurno = new Date(`${employeeShiftExistAnterior.events[0]?.start} ${employeeShiftExistAnterior.events[0]?.startTimeshift}`);
              const termianTurno = new Date(`${employeeShiftExistAnterior.events[0]?.start} ${employeeShiftExistAnterior.events[0]?.endTimeshift}`);
              
              if(nameTurno == 'T3'){
                termianTurno.setDate(termianTurno.getDate() + 1)
              }
              const startTimeShift = moment(iniciaTurno, 'HH:mm');
              let endTimeShift = moment(termianTurno, 'HH:mm');

              //se obtiene la hora de inicio y fin del turno
              const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
              const hourShift = endTimeShift.diff(startTimeShift, 'hours');
              const minShift = endTimeShift.diff(startTimeShift, 'minutes');

              createEmployeeIncidenceDto.total_hour = createEmployeeIncidenceDto.total_hour + Number(hourShift +'.'+(minShift % 60))
              
              //crea turno incidencia
              const createShift = await this.employeeShiftService.create({
                employeeId: [employee.emps[j].id],
                shiftId: 5,
                patternId: 0,
                start_date: format(index, 'yyyy-MM-dd'),
                end_date: format(index, 'yyyy-MM-dd'),
                
              });

            }

            
          } 
        }
      }

       let dayCreateIncidence = moment(new Date()).utcOffset('-06:00').format('YYYY-MM-DD HH:mm:ss');
      //crea la incidencia
      const employeeIncidenceCreate = await this.employeeIncidenceRepository.create({
          employee: employee.emps[j],
          incidenceCatologue: IncidenceCatologue,
          descripcion: createEmployeeIncidenceDto.description,
          total_hour: createEmployeeIncidenceDto.total_hour,
          start_hour: createEmployeeIncidenceDto.start_hour,
          end_hour: createEmployeeIncidenceDto.end_hour,
          date_aproved_leader: isLeader ? dayCreateIncidence : null,
          hour_approved_leader: isLeader ? dayCreateIncidence : null,
          leader: isLeader ? leader.emp : null,
          status: isLeader ? 'Autorizada' : 'Pendiente',
          type: createEmployeeIncidenceDto.type,
          createdBy: createdBy.emp,
          shift: createEmployeeIncidenceDto.shift ? createEmployeeIncidenceDto.shift : null,
          created_at: dayCreateIncidence
        });
      let to = [];
      let subject = '';
      // si el usuario crea incidencia para el mismo
      if (employeeIncidenceCreate.employee.id == user.idEmployee) {
        let lideres = await this.organigramaService.leaders(
          employeeIncidenceCreate.employee.id,
        );
        for (let index = 0; index < lideres.orgs.length; index++) {
          const lider = lideres.orgs[index];
          const userLider = await this.userService.findByIdEmployee(
            lider.leader.id,
          );
          if (userLider) {
            to.push(userLider.user.email);
          }
        }
        subject = `Autorizar incidencia: ${
          employeeIncidenceCreate.employee.employee_number
        }, ${employeeIncidenceCreate.employee.name} ${
          employeeIncidenceCreate.employee.paternal_surname
        } ${employeeIncidenceCreate.employee.maternal_surname}, Dia: ${format(
          new Date(createEmployeeIncidenceDto.start_date),
          'yyyy-MM-dd',
        )} al ${format(
          new Date(createEmployeeIncidenceDto.end_date),
          'yyyy-MM-dd',
        )}`;
      } else {
        const mailUser = await this.userService.findByIdEmployee(
          employeeIncidenceCreate.employee.id
        );
        let lideres = await this.organigramaService.leaders(
          employeeIncidenceCreate.employee.id
        );
        for (let index = 0; index < lideres.orgs.length; index++) {
          const lider = lideres.orgs[index];
          const userLider = await this.userService.findByIdEmployee(
            lider.leader.id,
          );
          if (userLider) {
            to.push(userLider.user.email);
          }
        }
        if (mailUser) {
          to.push(mailUser.user.email);
        }

        subject = `${employeeIncidenceCreate.incidenceCatologue.name} / ${employeeIncidenceCreate.employee.employee_number}, ${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname} / (-)`;
      }
      

      let mailData: MailData = {
        employee: `${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname}`,
        employeeNumber: employeeIncidenceCreate.employee.employee_number,
        incidence: employeeIncidenceCreate.incidenceCatologue.name,
        efectivos: totalDays,
        totalHours: createEmployeeIncidenceDto.total_hour,
        dia: `${format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd')} al ${format(new Date(createEmployeeIncidenceDto.end_date), 'yyyy-MM-dd')}`,
        employeeAutoriza:
          leader.emp.employee_number +
          ' ' +
          leader.emp.name +
          ' ' +
          leader.emp.paternal_surname +
          ' ' +
          leader.emp.maternal_surname,
      };

      const calendar = ical();
      const diaInicio = moment(format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd'));
      const diaFin = moment(format(new Date(createEmployeeIncidenceDto.end_date), 'yyyy-MM-dd'));
      let dias = diaFin.diff(diaInicio, 'days');
      calendar.method(ICalCalendarMethod.REQUEST);
      calendar.timezone('America/Mexico_City');
      calendar.createEvent({
        start: diaInicio,
        end: dias > 1 ? diaFin.add(1, 'days') : diaFin,
        allDay: true,
        timezone: 'America/Mexico_City',
        summary: subject,
        description: 'It works ;)',
        url: 'https://example.com',
        busystatus: ICalEventBusyStatus.FREE,
        //status: ICalEventStatus.CONFIRMED,
        attendees:
          to.length > 0
            ? to.map((email) => {
                return {
                  email: email,
                  status: ICalAttendeeStatus.ACCEPTED,
                };
              })
            : [],
      });

      //si el usuario crea incidencia para el mismo
      //envia correo de creacion de incidencia
      if (employeeIncidenceCreate.employee.id == user.idEmployee) {
        //ENVIO DE CORREO
        const mail = await this.mailService.sendEmailCreateIncidence(
          subject,
          mailData,
          to,
        );
      } else {
        //si isProduction es falso se envia correo de autorizacion
        if(!createEmployeeIncidenceDto.isProduction){
          //ENVIO DE CORREO de autorizacion
          const mail = await this.mailService.sendEmailAutorizaIncidence(
            subject,
            mailData,
            to,
            calendar,
          );
        }else{
          //si Produccion es verdadero y el usuario es distinto al de la incidencia
          //crea la incidencia con status pendiente
          const mail = await this.mailService.sendEmailCreateIncidence(
            subject,
            mailData,
            to,
          );
        }
        
      }
      //crea la incidencia
      const employeeIncidence = await this.employeeIncidenceRepository.save(
        employeeIncidenceCreate,
      );

      //almacena la imagen si existe
      if (createEmployeeIncidenceDto.image) {
        const base64Data = createEmployeeIncidenceDto.image.replace(/^data:image\/png;base64,/, '');
        const path = `./documents/incidencias/${new Date().getFullYear()}/${employeeIncidence.id}`;
        const filePath = `${path}/${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.png`;
        
        // Verifica si el directorio existe, si no, lo crea
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }

        fs.writeFile(filePath, base64Data, 'base64', (err) => {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            employeeIncidence.employee_image = filePath;
            this.employeeIncidenceRepository.save(employeeIncidence);
          }
        });
        
      }

      for (
        let index = new Date(createEmployeeIncidenceDto.start_date);
        index <= new Date(createEmployeeIncidenceDto.end_date);
        index = new Date(index.setDate(index.getDate() + 1))
      ) {
        ////////////
        ////////// revisar
        /////////

        //Se obtiene el perfil del empleado

        let ifCreate = false;
        const weekDaysProfile = employee.emps[j].employeeProfile.work_days;

        const dayLetter = weekDays[index.getDay()];
        let dayLetterProfile = false;
        for (let index = 0; index < weekDaysProfile.length; index++) {
          const letraPerfil = weekDaysProfile[index];
          if (letraPerfil == dayLetter) {
            dayLetterProfile = true;
          }
        }
        //SI EL DIA SELECCIONADO EXISTE EN EL PERFIL DEL EMPLEADO
       /*  if (dayLetterProfile) {
          //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
          ifCreate = true;
        } else { */
          //si el dia no pertenece al perfil
          //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
          let sql = `select * from employee_shift where employeeId = ${
            employee.emps[j].id
          } and start_date = '${format(index, 'yyyy-MM-dd')}'`;
          const employeeShiftExist =
            await this.employeeIncidenceRepository.query(sql);

          if (employeeShiftExist.length > 0) {
            ifCreate = true;
          }
        //}
        //si el dia tiene turno crea el dia de la incidencia
        if (ifCreate) {
          const dateEmployeeIncidence =
            await this.dateEmployeeIncidenceRepository.create({
              employeeIncidence: employeeIncidence,
              date: index,
            });

          await this.dateEmployeeIncidenceRepository.save(
            dateEmployeeIncidence,
          );
        }
        const findIncidence = await this.employeeIncidenceRepository.findOne({
          relations: {
            employee: true,
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
          where: {
            id: employeeIncidence.id,
          },
        });
      }
    }

    return;
  }

  async findAll() {
    return `This action returns all employeeIncidence`;
  }

  //se obtienen las incidencias de los empleados por rango de fechas y ids de empleados
  async findAllIncidencesByIdsEmployee(data: any) {
    
    let startDate = new Date(data.start);
    const from = format(new Date(data.start), 'yyyy-MM-dd')
    const to = format(new Date(data.end), 'yyyy-MM-dd')
    const tipo = ''; 
    
    /* const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true,
        leader: true
      },
      where: {
        employee: {
          id: In(data.ids),
        },
        dateEmployeeIncidence: {
          date: Between(from as any, to as any),
        },
        incidenceCatologue: {
          code_band: data.code_band ? In(data.code_band) : Not(IsNull()),
        },
        status: data.status ? In(data.status) : Not(IsNull()),
      },
    }); */
    
    const incidences = await this.employeeIncidenceRepository.createQueryBuilder('employeeIncidence')
        .innerJoinAndSelect('employeeIncidence.employee', 'employee')
        .leftJoinAndSelect('employeeIncidence.leader', 'leader')
        .innerJoinAndSelect('employeeIncidence.incidenceCatologue', 'incidenceCatologue')
        .innerJoinAndSelect('employeeIncidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
        .innerJoinAndSelect('employee.employeeShift', 'employeeShift')
        .innerJoinAndSelect('employeeShift.shift', 'shift')
        .where('employee.id IN (:...id)', { id: data.ids })
        .andWhere('employeeIncidence.status IN (:status)', { status: data.status ? data.status : Not(IsNull()) })
        .andWhere(`dateEmployeeIncidence.date BETWEEN '${format(new Date(from), 'yyyy-MM-dd')}' AND '${format(new Date(to), 'yyyy-MM-dd')}' `)
        .andWhere(data.code_band ? 'incidenceCatologue.code_band IN (:...code_band)' : 'incidenceCatologue.code_band IS NOT NULL', { code_band: data.code_band })
        .andWhere('employeeShift.start_date = dateEmployeeIncidence.date')
        .getMany();
    
        
    let i = 0;
    const newIncidences = [];
    
   if (incidences) {
      incidences.forEach((incidence) => {
        let textColor = '#fff';
  
        if (
          incidence.incidenceCatologue.color == '#faf20f' ||
          incidence.incidenceCatologue.color == '#ffdeec'
        ) {
          textColor = '#000';
        }

        incidence.dateEmployeeIncidence.forEach((date) => {
          i++;

          newIncidences.push({
            id: i,
            incidenceId: incidence.id,
            resourceId: incidence.employee.id,
            title: incidence.incidenceCatologue.name,
            code: incidence.incidenceCatologue.code,
            codeBand: incidence.incidenceCatologue.code_band,
            incidenceName: incidence.incidenceCatologue.name,
            employeeName: incidence.employee.name + ' ' + incidence.employee.paternal_surname + ' ' + incidence.employee.maternal_surname,
            reportNomina: incidence.incidenceCatologue.repor_nomina,
            description: incidence.descripcion,
            total_hour: incidence.total_hour,
            total_day: incidence.dateEmployeeIncidence.length,
            start: date.date,
            end: date.date,
            backgroundColor: incidence.incidenceCatologue.color,
            unique_day: incidence.incidenceCatologue.unique_day,
            textColor: textColor,
            status: incidence.status,
            approve: incidence.leader? incidence.leader.name +' '+incidence.leader.paternal_surname +' '+incidence.leader.maternal_surname : '',
            approveEmployeeNumber: incidence.leader? incidence.leader.employee_number : 0,
            shift: incidence.employee.employeeShift[0].shift,
            type: incidence.type,
            created_at: incidence.created_at,
          });
        });
      });
    }  

   

    return newIncidences;
  }

  //se obtienen las incidencias de los empleados por dia
  async findAllIncidencesDay(data: any) {
    const startDate = new Date(data.start + ' 00:00:00');
    const year = startDate.getFullYear();
    const date = startDate.getUTCDate();
    const month = startDate.getMonth() + 1;
    const startDateFormat = format(new Date(year + '-' + month + '-' + date) , 'yyyy-MM-dd');
    const to = new Date(data.end + ' 00:00:00');

    //datos del empleado
    const employee = await this.employeeService.findOne(data.ids);

    //se obtienen las incidencias del dia seleccionado

    const incidences = await this.employeeIncidenceRepository.createQueryBuilder('employee_incidence')
    .innerJoinAndSelect('employee_incidence.employee', 'employee')
    .innerJoinAndSelect('employee_incidence.incidenceCatologue', 'incidenceCatologue')
    .innerJoinAndSelect('employee_incidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
    .leftJoinAndSelect('employee_incidence.leader', 'leader')
    .leftJoinAndSelect('employee_incidence.rh', 'rh')
    .leftJoinAndSelect('employee_incidence.createdBy', 'createdBy')
    .leftJoinAndSelect('employee_incidence.canceledBy', 'canceledBy')
    .where('employee_incidence.employeeId IN (:ids)', { ids: data.ids.split(',') })
    .andWhere('incidenceCatologue.deleted_at IS NULL')
    .andWhere('dateEmployeeIncidence.date = :start', {
      start: format(new Date(startDate), 'yyyy-MM-dd')
    })
    .getMany();

    const employeeShift = await this.employeeShiftService.findEmployeeShiftsByDate(
      startDate,
      data.ids.split(','),
    );

    //se genera arreglo de ids de incidencias
    const idsIncidence = incidences.map((incidence) => incidence.id);

    //se obtienen los dias de la incidencias
    const dateIncidence = await this.dateEmployeeIncidenceRepository.find({
      where: {
        employeeIncidence: In(idsIncidence),
      },
    });

    let i = 0;

    const incidencesEmployee = incidences.map((incidence) => {
      i++;
      const dateLength = incidence.dateEmployeeIncidence.length;
      const startDate = incidence.dateEmployeeIncidence[0].date;
      const endDate = incidence.dateEmployeeIncidence[dateLength - 1].date;
      /* if(dateLength == 1){
        endDate = incidence.dateEmployeeIncidence[0].date;
      }else{
        endDate = incidence.dateEmployeeIncidence[dateLength - 1].date;
      } */

      return {
        id: i,
        incidenceId: incidence.id,
        resourceId: incidence.employee.id,
        title: incidence.incidenceCatologue.name,
        description: incidence.descripcion,
        total_hour: incidence.total_hour,
        start: startDate,
        end: endDate,
        backgroundColor: incidence.incidenceCatologue.color,
        unique_day: incidence.incidenceCatologue.unique_day,
        status: incidence.status,
      };
    });

    return {
      incidencesEmployee,
      employee,
      employeeShift,
    };
  }

  async findOne(id: number) {
    const incidence = await this.employeeIncidenceRepository.findOne({
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true,
        leader: true,
        rh: true,
        canceledBy: true,
        createdBy: true,
      },
      where: {
        id: id,
      },
    });

    if (!incidence) {
      throw new NotFoundException('No se encontro la incidencia');
    }

    return incidence;
  }

  //buscar por estatus
  async findIncidencesByStatus(data: ReportEmployeeIncidenceDto, user: any) {
    let whereQuery: any;
    const idsEmployees: any = [];
    //se obtienen los empleados por organigrama
    const organigrama = await this.organigramaService.findJerarquia(
      {
        type: data.type,
      },
      user
    );
    
    for (let index = 0; index < organigrama.length; index++) {
      const element = organigrama[index];
      
      idsEmployees.push(element.id);
    }

    if (data.status == 'Todas') {
      whereQuery = '';
    } else {
      whereQuery = {
        status: data.status,
      };
    }
    
    const incidences = await this.employeeIncidenceRepository.createQueryBuilder('employee_incidence')
    .innerJoinAndSelect('employee_incidence.employee', 'employee')
    .innerJoinAndSelect('employee_incidence.incidenceCatologue', 'incidenceCatologue')
    .innerJoinAndSelect('employee_incidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
    .leftJoinAndSelect('employee_incidence.leader', 'leader')
    .leftJoinAndSelect('employee_incidence.createdBy', 'createdBy')
    .leftJoinAndSelect('employee.organigramaL', 'organigramaL')
    .innerJoinAndSelect('organigramaL.leader', 'organigramaLeader')
    .where('employee_incidence.employeeId IN (:ids)', { ids: idsEmployees })
    .andWhere('employee_incidence.status IN (:status)', { status: data.status == 'Todas'? ['Autorizada', 'Pendiente', 'Rechazada'] : [data.status] })
    .andWhere('incidenceCatologue.deleted_at IS NULL')
    .andWhere(new Brackets(qb => {
      qb.where('dateEmployeeIncidence.date BETWEEN :start AND :end', {
        start: format(new Date(data.start_date), 'yyyy-MM-dd'),
        end: format(new Date(data.end_date), 'yyyy-MM-dd'),
      })
      .orWhere('employee_incidence.created_at BETWEEN :start AND :end', {
        start: format(new Date(data.start_date), 'yyyy-MM-dd'),
        end: format(new Date(data.end_date), 'yyyy-MM-dd'),
      });
    }))
    .getMany();
    
    const total = incidences.length;

    if (!incidences) {
      throw new NotFoundException(
        `Incidencias con estatus ${data.status} no encontradas`,
      );
    }

    return {
      incidences,
      total,
    };
  }

  //buscar Incidencias Pendientes 
  async findIncidencesPendientes(data: ReportEmployeeIncidenceDto, user: any) {
    let whereQuery: any;
    const idsEmployees: any = [];
    
    
    const incidences = await this.employeeIncidenceRepository.createQueryBuilder('employee_incidence')
    .innerJoinAndSelect('employee_incidence.employee', 'employee')
    .innerJoinAndSelect('employee_incidence.incidenceCatologue', 'incidenceCatologue')
    .innerJoinAndSelect('employee_incidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
    .leftJoinAndSelect('employee_incidence.leader', 'leader')
    .leftJoinAndSelect('employee_incidence.createdBy', 'createdBy')
    .leftJoinAndSelect('employee.organigramaL', 'organigramaL')
    .innerJoinAndSelect('organigramaL.leader', 'organigramaLeader')
    //.where('employee_incidence.employeeId IN (:ids)', { ids: idsEmployees })
    .where('employee_incidence.status IN (:status)', { status: data.status == 'Todas'? ['Autorizada', 'Pendiente', 'Rechazada'] : [data.status] })
    .andWhere('incidenceCatologue.deleted_at IS NULL')
    .andWhere(new Brackets(qb => {
      qb.where('dateEmployeeIncidence.date BETWEEN :start AND :end', {
        start: format(new Date(data.start_date), 'yyyy-MM-dd'),
        end: format(new Date(data.end_date), 'yyyy-MM-dd'),
      })
      .orWhere('employee_incidence.created_at BETWEEN :start AND :end', {
        start: format(new Date(data.start_date), 'yyyy-MM-dd'),
        end: format(new Date(data.end_date), 'yyyy-MM-dd'),
      });
    }))
    .getMany();
    
    const total = incidences.length;

    if (!incidences) {
      throw new NotFoundException(
        `Incidencias con estatus ${data.status} no encontradas`,
      );
    }

    return {
      incidences,
      total,
    };
  }

  //buscar incidencias doubles
  async findIncidencesByStatusDouble(status: string, approvalDouble: boolean) {
    let whereQuery: any;
    if (status == 'Todas') {
      whereQuery = [
        {
          status: 'Pendiente',
          incidenceCatologue: {
            approval_double: true,
          },
        },
        {
          status: 'Autorizada',
          incidenceCatologue: {
            approval_double: true,
          },
        },
        {
          status: 'Rechazada',
          incidenceCatologue: {
            approval_double: true,
          },
        },
      ];
    } else {
      whereQuery = {
        status: status,
        incidenceCatologue: {
          approval_double: true,
        },
      };
    }

    const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true,
        leader: true,
        createdBy: true,
        rh: true,
      },
      where: whereQuery,
    });

    const total = await this.employeeIncidenceRepository.count({
      where: whereQuery,
    });

    if (!incidences) {
      throw new NotFoundException(
        `Incidencias con estatus ${status} no encontradas`,
      );
    }

    return {
      incidences,
      total,
    };
  }

  //report tiempo compensatorio
  async reportCompensatoryTime(data: any, userLogin: any) {
    let from = format(new Date(data.start_date), 'yyyy-MM-dd');
    const to = format(new Date(data.end_date), 'yyyy-MM-dd')
    let isAdmin = false;
    let isLeader = false;
    let conditions: any;
    let report: any;
    let query = '';
    const dataEmployee = [];
    let arrayEmployeebyJefe = [];

    userLogin.roles.forEach((role) => {
      if (role.name == 'Admin' || role.name == 'RH') {
        isAdmin = true;
      }
      if (
        role.name == 'Jefe de Area' ||
        role.name == 'RH' ||
        role.name == 'Jefe de Turno'
      ) {
        isLeader = true;
      }
    });

    if (isAdmin) {
      conditions = {};
      query = `SELECT * FROM employee AS e
      `;
      arrayEmployeebyJefe = await this.employeeIncidenceRepository.query(query);
    }

    if (isLeader) {
      //leader o jefe de turno
      conditions = {
        job: {
          shift_leader: true,
        },
        organigramaL: userLogin.idEmployee,
      };

      const queryPuesto =  `SELECT * FROM employee AS e
      INNER JOIN job AS j ON e.jobId = j.id
      WHERE j.shift_leader = 1`;
      const porPuesto = await this.employeeIncidenceRepository.query(
        queryPuesto,
      );

      const queryOrganigrama = `SELECT * FROM employee AS e
      INNER JOIN organigrama AS o ON e.id = o.employeeId
      WHERE o.leaderId = ${userLogin.idEmployee}`;

      const porOrganigrama = await this.employeeIncidenceRepository.query(
        queryOrganigrama,
      );

      arrayEmployeebyJefe = porPuesto.concat(porOrganigrama);
    }

    const employees = arrayEmployeebyJefe;

    for (let i = 0; i < employees.length; i++) {
      const dataIncidence = [];

      //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
      //y que esten autorizadas
      const incidenciaCompensatorio =
        await this.employeeIncidenceRepository.find({
          relations: {
            employee: true,
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
          where: {
            employee: {
              id: employees[i].id,
            },
            dateEmployeeIncidence: {
              date: Between(from as any, to as any),
            },
            status: 'Autorizada',
            type: In(['Compensatorio', 'Repago']),
          },
          order: {
            employee: {
              id: 'ASC',
            },
            type: 'ASC',
          },
        });


      if (incidenciaCompensatorio.length <= 0) {
        continue;
      }

      for (let j = 0; j < incidenciaCompensatorio.length; j++) {
        let queryShift = `
            SELECT * FROM employee_shift as es
            INNER JOIN shift as s ON es.shiftId = s.id
            WHERE employeeId = ${employees[i].id} and start_date = '${incidenciaCompensatorio[j].dateEmployeeIncidence[0].date}'
            `;

        const employeeShift = await this.employeeIncidenceRepository.query(
          queryShift,
        );

        //const employeeShift = await this.employeeShiftService.findEmployeeShiftsByDate(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date, [employees[i].id]);

        let hrEntrada = '';
        let hrSalida = '';
        let diaAnterior: any;
        let diaSiguente: any;
        const turnoActual = employeeShift[0].code;
        const nowDate = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);


        switch (turnoActual) {
          case 'T1':
            hrEntrada = '04:00:00'; //dia anterior
            hrSalida = '23:00:00'; //dia actual
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            break;
          case 'T2':
            hrEntrada = '03:00:00'; //dia Actual
            hrSalida = '08:00:00'; //dia siguiente
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
            break;
          case 'T3':
            hrEntrada = '12:00:00'; //dia actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            break;
          case 'T4':
            hrEntrada = '04:00:00'; //dia anterior
            hrSalida = '23:00:00'; //dia actual
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            break;
          case 'MIX':
            hrEntrada = '02:00:00'; //dia actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            break;
          case 'TI':
            hrEntrada = '02:00:00'; //dia actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            diaSiguente = new Date(
              incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
            );
            break;
        }

        const registrosChecador = await this.checadorService.findbyDate(
          parseInt(employees[i].id),
          diaAnterior,
          diaSiguente,
          hrEntrada,
          hrSalida,
        );
        const firstHr = moment(new Date(registrosChecador[0]?.date));
        const secondHr = moment(new Date(registrosChecador[registrosChecador.length-1]?.date));
        const diffHr = secondHr.diff(firstHr, 'hours', true);
        const hrsTotales = incidenciaCompensatorio[j].total_hour - (diffHr > 0? diffHr : 0);

        dataIncidence.push({
          fecha: incidenciaCompensatorio[j].dateEmployeeIncidence[0].date,
          concepto: incidenciaCompensatorio[j].type,
          hrsAutorizadas: incidenciaCompensatorio[j].total_hour,
          hrsTrabajadas: diffHr > 0 ? diffHr.toFixed(2) : 0,
          hrsTotales: hrsTotales.toFixed(2),
        });
      }

      //se obtiene el tipo de nomina del empleado
      const payroll = await this.payRollService.findOne(employees[i].payRollId);

      dataEmployee.push({
        id: employees[i].id,
        name:
          employees[i].name +
          ' ' +
          employees[i].paternal_surname +
          ' ' +
          employees[i].maternal_surname,
        fecha: dataIncidence,
        nomina: payroll.payroll.name,
      });
    }

    return dataEmployee;
  }

  async update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto, user: any) {
    let status = {
      message: '',
      status: false,
      error: false,
      data: {}
    };
    
    try {
      const employeeIncidence = await this.employeeIncidenceRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          employee: {
            payRoll: true,
          },
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
      });
      
      const userAutoriza = await this.employeeService.findOne(user.idEmployee);
      let isAdmin = user.roles.some((role) => role.name == 'Admin' || role.name == 'RH');
      let isLeader = user.roles.some((role) => role.name == 'Jefe de Area' || role.name == 'Jefe de Turno' || role.name == 'RH');
      //buscar si esta habilitada la creacion de incidencias para el payroll
      let enabledCreateIncidence = await this.enabledCreateIncidenceService.findByPayroll(employeeIncidence.employee.payRoll.id);
  
      if (!employeeIncidence) {
        
        throw new NotFoundException('No se encontro la incidencia');
      }
      const to = [];
      const emailUser = await this.userService.findByIdEmployee(employeeIncidence.employee.id);
      
      const lideres = await this.organigramaService.leaders(employeeIncidence.employee.id);
      for (let index = 0; index < lideres.orgs.length; index++) {
        const lider = lideres.orgs[index];
        const userLider = await this.userService.findByIdEmployee(
          lider.leader.id,
        );
        if (userLider) {
          to.push(userLider.user.email);
        }
      }
      if (emailUser) {
        to.push(emailUser.user.email);
      }
  
      let subject = '';
      let mailData: MailData;
  
      const calendar = ical();

      if (updateEmployeeIncidenceDto.status == 'Autorizada') {
        employeeIncidence.date_aproved_leader = new Date();
        employeeIncidence.hour_approved_leader = new Date();
        employeeIncidence.leader = userAutoriza.emp;

        //validacion si esta inabilitado para crear incidencias y si la fecha de creacion de incidencias es mayor a la fecha inicial de la incidencia
        //no podra cancelar la incidencia y tendra que solicitarlo a RH
        if(enabledCreateIncidence.enabled == true ){
          
          status.error = true;
          status.message = 'Dia bloqueado para autorización, favor de contactar a RH';
          return status;
          
        }

        //ENVIO DE CORREO
        subject = `${employeeIncidence.incidenceCatologue.name} / ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname} / (-)`;
        mailData = {
          employee: `${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`,
          employeeNumber: employeeIncidence.employee.employee_number,
          incidence: employeeIncidence.incidenceCatologue.name,
          efectivos: 0,
          totalHours: employeeIncidence.total_hour,
          dia: ``,
          employeeAutoriza: `${userAutoriza.emp.employee_number} ${userAutoriza.emp.name} ${userAutoriza.emp.paternal_surname} ${userAutoriza.emp.maternal_surname}`,
        };
        
        calendar.method(ICalCalendarMethod.REQUEST);
        calendar.timezone('America/Mexico_City');
        const diaInicio = moment(format(new Date(employeeIncidence.dateEmployeeIncidence[0].date + ' ' + employeeIncidence.start_hour), 'yyyy-MM-dd'));
        const diaFin = moment(format(new Date(employeeIncidence.dateEmployeeIncidence[employeeIncidence.dateEmployeeIncidence.length - 1].date + ' ' + employeeIncidence.end_hour), 'yyyy-MM-dd'));
        let dias = diaFin.diff(diaInicio, 'days');

        if(to.length > 0){
          calendar.createEvent({
            start: diaInicio,
            end: dias > 1 ? diaFin.add(1, 'days') : diaFin,
            allDay: true,
            timezone: 'America/Mexico_City',
            summary: subject,
            description: 'It works ;)',
            url: 'https://example.com',
            busystatus: ICalEventBusyStatus.FREE,
            //status: ICalEventStatus.CONFIRMED,
            attendees: [
              /* {
                email: to[1],
                status: ICalAttendeeStatus.ACCEPTED,
              }, */
              {
                email: to[0],
                rsvp: true,
                status: ICalAttendeeStatus.ACCEPTED,
              },
            ],
          });
          
          let day = new Date();
          // Generar archivo .ics y guardar en la ruta especificada
          /* const icsFilePath = 'documents/calendar/empleados';
          const icsFileName = `${employeeIncidence.employee.employee_number}_${employeeIncidence.id}_${day.getFullYear()}${day.getMonth()}${day.getDate()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.ics`;
          const icsFileContent = calendar.toString();
    
          // Guardar archivo .ics
          fs.writeFileSync(`${icsFilePath}/${icsFileName}`, icsFileContent); */
    
          // Continuar con el resto del código...
          
          //se envia correo
          const mail = await this.mailService.sendEmailAutorizaIncidence(
            subject,
            mailData,
            to,
            calendar,
          );
        }
        
      }else if (updateEmployeeIncidenceDto.status == 'Rechazada') {
        employeeIncidence.date_canceled = new Date();
        employeeIncidence.canceledBy = userAutoriza.emp;
        
 
        if(!isAdmin && employeeIncidence.commentCancel != ''){

          //validacion si el status es autorizada
          if(employeeIncidence.status == 'Autorizada'){
            
            //validacion si esta inabilitado para crear incidencias y si la fecha de creacion de incidencias es mayor a la fecha inicial de la incidencia
            //no podra cancelar la incidencia y tendra que solicitarlo a RH
            if(enabledCreateIncidence.enabled == true && (enabledCreateIncidence.date > employeeIncidence.dateEmployeeIncidence[0].date)){
              
              status.error = true;
              status.message = 'No se puede cancelar la incidencia, Favor de solicitar a Recursos Humanos la cancelación';
              return status;
              
            }
            //validamos si el empleado es quincenal
            if(employeeIncidence.employee.payRoll.name == 'Quincenal'){
              
              //validamos si la fecha de la incidencia es mayor a la fecha de inicio de la quincena
              if(new Date(employeeIncidence.dateEmployeeIncidence[0].date) < new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)){
                
                status.error = true;
                status.message = 'No se puede cancelar la incidencia, Favor de solicitar a Recursos Humanos la cancelación';
                return status;
                
              }
            }else if(employeeIncidence.employee.payRoll.name == 'Semanal'){
              //validamos si la fecha de la incidencia es mayor a la fecha de inicio de la semana
              if(new Date(employeeIncidence.dateEmployeeIncidence[0].date) < new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)){
                status.error = true;
                status.message = 'No se puede cancelar la incidencia, Favor de solicitar a Recursos Humanos la cancelación';
                return status;
                
              }
            }

            status.error = true;
            status.message = 'need comment';
            return status;
          }
        }
        
        
        //ENVIO DE CORREO
        subject = `Incidencia Rechazada: ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`;
        mailData = {
          employee: `${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`,
          employeeNumber: Number(employeeIncidence.employee.employee_number),
          incidence: employeeIncidence.incidenceCatologue.name,
          efectivos: 0,
          totalHours: employeeIncidence.total_hour,
          dia: ``,
          employeeAutoriza: `${userAutoriza.emp.employee_number} ${userAutoriza.emp.name} ${userAutoriza.emp.paternal_surname} ${userAutoriza.emp.maternal_surname}`,
        };

        //codigo para cancelar incidencia en outlook
        /* const icsData = fs.readFileSync('documents/calendar/empleados/1270_727_202451201832.ics', 'utf8');
        const jcalData = leerCal.parseICS(icsData);
        const c = ical();
        
        const vcalendar = jcalData['c3cc5a1d-0bf4-48d2-870a-c09a1679d177'] as leerCal.VEvent;
        
        vcalendar.status = 'CANCELLED';
        
        jcalData['c3cc5a1d-0bf4-48d2-870a-c09a1679d177'] = vcalendar; */
        

        //se envia correo
        const mail = await this.mailService.sendEmailRechazaIncidence(
          subject,
          mailData,
          to,
          
        ); 
      }
      
      
      employeeIncidence.status = updateEmployeeIncidenceDto.status;
      await this.employeeIncidenceRepository.save(employeeIncidence);

      status.message = 'Incidencia actualizada';
      status.data = employeeIncidence;
      return status;
    } catch (error) {
      status.error = true;
      status.message = error.message;
      return error;
    }
    

    
  }

  async updateCommentCancelIncidence(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto, user: any){
    let status = {
      message: '',
      status: false,
      error: false,
      data: {}
    };
    try {
      const employeeIncidence = await this.employeeIncidenceRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          employee: {
            payRoll: true,
          },
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
      });

      
      if(updateEmployeeIncidenceDto.commentCancel){
        employeeIncidence.commentCancel = updateEmployeeIncidenceDto.commentCancel;
      }

      if(updateEmployeeIncidenceDto.approveRHComment){
        employeeIncidence.approveRHComment = updateEmployeeIncidenceDto.approveRHComment;
      }

      employeeIncidence.status = updateEmployeeIncidenceDto.status;

      let save = await this.employeeIncidenceRepository.save(employeeIncidence);

      status.message = 'Comentario actualizado';
      status.data = employeeIncidence;
      return status;
      
    } catch (error) {
      status.error = true;
      status.message = error.message;
      return error;
    }
  }

  async approveRh(id: number, updateEmployeeIncidenceDto: any, user: any){
    let status = {
      message: '',
      status: false,
      error: false,
      data: {}
    };
    try {
      const userAutoriza = await this.employeeService.findOne(user.idEmployee);
      const employeeIncidence = await this.employeeIncidenceRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          employee: {
            payRoll: true,
          },
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
      });

      
     
      employeeIncidence.date_aproved_rh = new Date();
      employeeIncidence.rh = userAutoriza.emp;

      let save = await this.employeeIncidenceRepository.save(employeeIncidence);

      status.message = 'Comentario actualizado';
      status.data = employeeIncidence;
      return status;
      
    } catch (error) {
      status.error = true;
      status.message = error.message;
      return error;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }

  //report horario flexible
  async reportFlexTimeV2(data: any, userLogin: any) {
    
    const from = format(new Date(data.start_date), 'yyyy-MM-dd')
    const to = format(new Date(data.end_date), 'yyyy-MM-dd')
    let isAdmin = false;
    let isLeader = false;
    let conditions: any;
    let employees: any;
    const dataEmployee = [];
    const registros = [];
    const diasGenerados = [];
    const letraSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    userLogin.roles.forEach((role) => {
      if (role.name == 'Admin' || role.name == 'RH') {
        isAdmin = true;
      }
      if (role.name == 'Jefe de Area' || role.name == 'RH' || role.name == 'Jefe de Turno') {
        isLeader = true;
      }
    });
 
    if (isAdmin) {
      conditions = {};
      employees = await this.employeeService.findAll();
      employees = employees.emps;
    } else if (isLeader) {
      //leader o jefe de turno
      conditions = {
        job: {
          shift_leader: true,
        },
        organigramaL: userLogin.idEmployee,
      };

      employees = await this.organigramaService.findJerarquia(
        {
          type: data.type,
          startDate: '',
          endDate: '',
          needUser: true
        },
        userLogin,
      );
    } else {
      const dataEmployee = await this.employeeService.findOne(userLogin.idEmployee);
      employees = [dataEmployee.emp];
    }

    //se filtran los empleados por perfil MIXTO
    const newArray = data.type_nomina == 'Todos' ? employees : employees.filter((e) => e.payRoll.name == data.type_nomina) //.filter((e) => e.employeeProfile.name == 'PERFIL C - Mixto');
    //generacion de dias seleccionados
    

    for (
      let x = new Date(from);
      x <= new Date(to);
      x = new Date(x.setDate(x.getDate() + 1))
    ) {
      diasGenerados.push(format(x, 'yyyy-MM-dd'));
    }

    //se recorre el arreglo de empleados
    for (let i = 0; i < newArray.length; i++) {
      const eventDays = [];
      let totalHrsRequeridas = 0;
      let totalMinRequeridos = 0;
      let totalHrsTrabajadas = 0;
      let totalMinutisTrabados:number = 0;
      let totalHorasIncidencia = 0;
      

      for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
        let dayLetter;
        const weekDaysProfile = newArray[i].employeeProfile.work_days;
        switch (x.getDay()) {
          case 0:
            dayLetter = 'D';
            break;
          case 1:
            dayLetter = 'L';
            break;
          case 2:
            dayLetter = 'M';
            break;
          case 3:
            dayLetter = 'X';
            break;
          case 4:
            dayLetter = 'J';
            break;
          case 5:
            dayLetter = 'V';
            break;
          case 6:
            dayLetter = 'S';
            break;
        }

        
      }

      //se recorren los dias 
      for (let dia = new Date(from); dia <= new Date(to); dia = new Date(dia.setDate(dia.getDate() + 1))) {
        //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
        //y que esten autorizadas
        let totalHrsDay = 0;
        let totalMinDay = 0;
        let sumaHrsIncidencias = 0;
        //se buscan las incidencias por dia, con status Autorizada
        /* const incidencias = await this.employeeIncidenceRepository.find({
          relations: {
            employee: true,
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
          where: {
            employee: {
              id: newArray[i].id,
            },
            dateEmployeeIncidence: {
              date: dia as any,
            },
            status: 'Autorizada',
          },
          order: {
            employee: {
              id: 'ASC',
            },
            type: 'ASC',
          },
        }); */

        const incidencias = await this.employeeIncidenceRepository.createQueryBuilder('employee_incidence')
        .innerJoinAndSelect('employee_incidence.employee', 'employee')
        .innerJoinAndSelect('employee_incidence.incidenceCatologue', 'incidenceCatologue')
        .innerJoinAndSelect('employee_incidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
        .leftJoinAndSelect('employee_incidence.leader', 'leader')
        .leftJoinAndSelect('employee_incidence.rh', 'rh')
        .leftJoinAndSelect('employee_incidence.createdBy', 'createdBy')
        .leftJoinAndSelect('employee_incidence.canceledBy', 'canceledBy')
        .where('employee_incidence.employeeId = :id', { id: newArray[i].id })
        .andWhere('incidenceCatologue.deleted_at IS NULL')
        .andWhere('dateEmployeeIncidence.date = :start', {
          start: format(new Date(dia), 'yyyy-MM-dd')
        })
        .andWhere('employee_incidence.status = :status', { status: 'Autorizada' })
        .getMany();


        let isIncidenciaTiempoExtra = false;
        //se verifica si la incidencia es tiempo extra
        incidencias.some((incidence) => {
          if(incidence.incidenceCatologue.code_band == 'TxT' || incidence.incidenceCatologue.code_band == 'HE' || incidence.incidenceCatologue.code_band == 'HET'){
            isIncidenciaTiempoExtra = true;

          }
        });

        //se obtiene el turno del dia seleccionado
        const shift = await this.employeeShiftService.findMore(
          {
            start: format(dia, 'yyyy-MM-dd'),
            end: format(dia, 'yyyy-MM-dd'),
          },
          [newArray[i].id],
        );

        //horario del turno
        const iniciaTurno = new Date(`${shift.events[0]?.start} ${shift.events[0]?.startTimeshift}`);
        const termianTurno = new Date(`${shift.events[0]?.start} ${shift.events[0]?.endTimeshift}`);

        
        if(shift.events[0]?.nameShift == 'T3' || shift.events[0]?.nameShift == 'T12-2'){
          termianTurno.setDate(termianTurno.getDate() + 1)
        }
        const startTimeShift = moment(iniciaTurno, 'HH:mm');
        let endTimeShift = moment(termianTurno, 'HH:mm');

        //se obtiene la hora de inicio y fin del turno
        const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
        const hourShift = endTimeShift.diff(startTimeShift, 'hours');
        const minShift = endTimeShift.diff(startTimeShift, 'minutes');

        //si existe turno se suman las horas requeridas
        if(shift.events.length >= 1){
          //si el turno es diferente a TI se suman las horas
          if(shift.events[0]?.nameShift != 'TI'){

            
            totalHrsRequeridas += hourShift;
            totalMinRequeridos += Number(minShift) % 60;
          }

          
        }

        //si el total de minutos requeridos es mayor a 60 se suman las horas
        //a horas requeridas
        if (totalMinRequeridos >= 60) {

          totalMinRequeridos = totalMinRequeridos - 60;
          totalHrsRequeridas += 1

        }


        let hrEntrada = '00:00:00';
        let hrSalida = '23:59:59';
        
        let diahoy = new Date(dia);
        let diaAnterior = new Date(dia);
        let diaSiguente = new Date(dia);
        let firstHr;
        let secondHr;
        let diffHr = 0;
        let diffMin = 0;
        let modMinUno = 0;
        let divMinDos = 0;
        const turnoActual = shift.events[0]?.nameShift;
        const dataDateAnterior = {
          start: new Date(new Date(dia).setDate(new Date(dia).getDate() - 1)),
          end: new Date(new Date(dia).setDate(new Date(dia).getDate() - 1)),
        };
        const dataDateSiguiente = {
          start: new Date(new Date(dia).setDate(new Date(dia).getDate() + 1)),
          end: new Date(new Date(dia).setDate(new Date(dia).getDate() + 1)),
        };

        const employeeShifAnterior = await this.employeeShiftService.findMore(
          dataDateAnterior,
          [Number(newArray[i].id)],
        );
        const employeeShifSiguiente = await this.employeeShiftService.findMore(
          dataDateSiguiente,
          [Number(newArray[i].id)],
        );
        const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
        const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;


        //turno actual es igual al turno del dia anterior
        if (turnoActual == turnoAnterior) {
          //turno actual es igual al turno del dia siguiente
          if (turnoActual == turnoSiguiente) {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T2':
                hrEntrada = '05:00:00'; //dia Actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '15:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:59:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T4':
                hrEntrada = '05:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
            }
          } else {
            //si existe turno siguiente
            if(turnoSiguiente){
              switch (turnoActual) {
                case 'T1':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(new Date(dia).setDate(new Date(dia).getDate() - 1));
                  diaSiguente = new Date(dia);
                  break;
                case 'T2':
                  hrEntrada = '05:00:00'; //dia Actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T3':
                  hrEntrada = '13:00:00'; //dia actual
                  hrSalida = '07:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                  break;
                case 'MIX':
                  hrEntrada = '03:00:00'; //dia actual
                  hrSalida = '23:59:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'TI':
                  hrEntrada = '02:00:00'; //dia actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T4':
                  hrEntrada = '05:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T12-1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T12-2':
                  hrEntrada = '12:00:00'; //dia anterior
                  hrSalida = '08:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                  break;
              }
            }else{
              switch (turnoActual) {
                case 'T1':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(new Date(dia).setDate(new Date(dia).getDate() - 1));
                  diaSiguente = new Date(dia);
                  break;
                case 'T2':
                  hrEntrada = '05:00:00'; //dia Actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T3':
                  hrEntrada = '13:00:00'; //dia actual
                  hrSalida = '07:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                  break;
                case 'MIX':
                  hrEntrada = '03:00:00'; //dia actual
                  hrSalida = '23:59:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'TI':
                  hrEntrada = '02:00:00'; //dia actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T4':
                  hrEntrada = '05:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T12-1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(dia);
                  break;
                case 'T12-2':
                  hrEntrada = '12:00:00'; //dia anterior
                  hrSalida = '08:00:00'; //dia actual
                  diaAnterior = new Date(dia);
                  diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                  break;
              }
            }
            
          }
        } else {
          //turno actual es igual al turno del dia siguiente
          if (turnoActual == turnoSiguiente) {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T2':
                hrEntrada = '03:00:00'; //dia Actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '15:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T4':
                hrEntrada = '05:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
            }
          } else {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '05:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T2':
                hrEntrada = '13:00:00'; //dia Actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T3':
                hrEntrada = '21:00:00'; //dia actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T4':
                hrEntrada = '06:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(dia);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(dia);
                diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                break;
            }
          }

        }

        //se realiza la suma o resta de horas de las incidencias
        for (let index = 0; index < incidencias.length; index++) {
          const incidence = incidencias[index];
          
          const currentIncidence = await this.employeeIncidenceRepository.find({
            relations: {
              employee: true,
              incidenceCatologue: true,
              dateEmployeeIncidence: true,
            },
            where: {
              id: incidence.id
            }
          });
          let horasIncidencia = 0;
          let minsIncidencia = 0;

          horasIncidencia = Number(moment((parseFloat(String(currentIncidence[0].total_hour)) / Number(currentIncidence[0].dateEmployeeIncidence.length)), 'HH.m').hours());
          minsIncidencia = Number(moment(String(parseFloat(String(currentIncidence[0].total_hour)) / Number(currentIncidence[0].dateEmployeeIncidence.length)).split('.')[1] ? 
            String(parseFloat(String(currentIncidence[0].total_hour)) / Number(currentIncidence[0].dateEmployeeIncidence.length)).split('.')[1] : 0, 'mm').minutes());

          
          //se obtiene las horas y minutos de la incidencia
          let horaMinIncidencia = moment(horasIncidencia, 'HH.mm');
          //se obtiene la diferencia en milisegundos
          let hrs = horasIncidencia; //horaMinIncidencia.hours();
          let mins = minsIncidencia; //horaMinIncidencia.minutes();
          let modMin = 0;
          let divMin = 0;
          
          //si la incidencia no es Incapacidad se suman las horas y minutos
          if(incidence.incidenceCatologue.code_band != 'INC'){

            totalMinutisTrabados += Number(mins) ;
            totalMinDay += Number(mins) ;

            if (totalMinutisTrabados >= 60) {
              modMin = totalMinutisTrabados % 60;
              divMin = totalMinutisTrabados / 60;
              totalHrsTrabajadas += Math.floor(divMin);
              totalMinutisTrabados = modMin;
              /* totalHrsDay += Math.floor(divMin);
              totalMinDay += modMin; */
            }
            //si la incidencia es tiempo compensatorio
          
            if(incidence.incidenceCatologue.code_band == 'TxT'){
              if(incidence.type == 'Compensatorio'){
                sumaHrsIncidencias += Number(hrs);
              }
            }else{
              if (incidence.incidenceCatologue.affected_type == 'Sumar horas') {
                sumaHrsIncidencias += Number(hrs);
              }
              if (incidence.incidenceCatologue.affected_type == 'Restar horas') {
                sumaHrsIncidencias -= Number(hrs);
              }


            }
          }else{
            //si el turno actual es diferente a TI se suman las horas de la incidencia
            if(turnoActual != 'TI'){
              totalHorasIncidencia += Number(hrs);
            }
            
          }

          //se suman las horas de las incidencias al total de horas por dia
          //totalHrsDay += Number(sumaHrsIncidencias);
          
        }
        

        //se recorre el arreglo de incidencias para verificar si existe un tiempo extra
        //y asignar las horas de entrada y salida
        for (let index = 0; index < incidencias.length; index++) {
          //si es tiempo extra, tiempo extra por hora o tiempo compensatorio
          if(incidencias[index].incidenceCatologue.code_band == 'HE' || incidencias[index].incidenceCatologue.code_band == 'HET' || incidencias[index].incidenceCatologue.code_band == 'TxT'){
            
            //si es tiempo extra, tiempo extra por hora
            if(incidencias[index].incidenceCatologue.code_band == 'HE' || incidencias[index].incidenceCatologue.code_band == 'HET' || incidencias[index].incidenceCatologue.code_band == 'TxT'){
              if ( shift.events[0]?.nameShift != '' && shift.events[0]?.nameShift == 'T1'){

              
                if(incidencias[index].shift == 2 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
  
                }else if(incidencias[index].shift == 3){
                  hrEntrada = '20:00:00';
                  hrSalida = '06:59:00';
                  diahoy.setDate(diahoy.getDate() - 1);
                }
              }else if(shift.events[0]?.nameShift != '' && shift.events[0]?.nameShift == 'T2'){
                
                if(incidencias[index].shift == 1 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
  
                }else if(incidencias[index].shift == 3){
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente = new Date(new Date(dia).setDate(new Date(dia).getDate() + 1));
                }
              }else if(shift.events[0]?.nameShift != '' && shift.events[0]?.nameShift == 'T3'){
                
                if(incidencias[index].shift == 1 ){
                  hrEntrada = '20:00:00';
                  hrSalida = '06:59:00';
                  diahoy.setDate(diahoy.getDate() - 1);
                }else if(incidencias[index].shift == 2){
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  
                  //diaSiguente.setDate(diahoy.getDate() + 1);
                }
              }else if(shift.events[0]?.nameShift != '' && shift.events[0]?.nameShift == 'TI'){
                
                if(incidencias[index].shift == 1 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '14:59:00';
                  
                }else if(incidencias[index].shift == 2){
                  hrEntrada = '13:00:00';
                  hrSalida = '21:59:00';
                }
              }else if(shift.events[0]?.nameShift != '' && shift.events[0]?.nameShift == 'MIX'){
                
                if(incidencias[index].shift == 1 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
                  
                }else if(incidencias[index].shift == 2){
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
                }else if(incidencias[index].shift == 3){
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente.setDate(diaSiguente.getDate() + 1);
                }
              }
              //si es tiempo compensatorio
            }
            
          }

          
        }    
        

        //se verifica si el dia seleccionado es festivo
        const dayCalendar = await this.calendarService.findByDate(dia as any);
        const objIncidencia = [];

        if (dayCalendar) { 
          if (dayCalendar.holiday) {
            const holiday = await this.incidenceCatologueService.findName(
              'Dia festivo / Descanso trabajo',
            );
            objIncidencia.push({
              code: holiday.code,
            });
            sumaHrsIncidencias += hourShift;
          }
        }
        incidencias.forEach((incidence) => {
          objIncidencia.push({
            code: incidence.incidenceCatologue.code,
          });
        });

        //********* agregar dato dia del turno */
        //se obtienen los registros del checador
        const registrosChecador = await this.checadorService.findbyDate(
          parseInt(newArray[i].id),
          diaAnterior,
          diaSiguente,
          hrEntrada,
          hrSalida,
        );
        

        if (registrosChecador.length > 0) {
          firstHr = moment(new Date(registrosChecador[0]?.date));
          secondHr =
            registrosChecador.length > 1
              ? moment(
                  new Date(
                    registrosChecador[registrosChecador.length - 1]?.date,
                  ),
                )
              : moment(new Date(registrosChecador[0]?.date));

          //se obtiene la diferencia en milisegundos
          
          diffHr = secondHr.diff(firstHr, 'hours');
          diffMin = secondHr.diff(firstHr, 'minutes');
          
          totalMinDay += Number(diffMin) % 60;
          totalMinutisTrabados += totalMinDay;

          
          //si el total de minutos trabajados es mayor a 60 se suman las horas
          if (totalMinutisTrabados >= 60) {
            modMinUno = totalMinutisTrabados % 60;
            divMinDos = totalMinutisTrabados / 60;

            totalHrsTrabajadas += Math.floor(divMinDos);
            totalMinutisTrabados = modMinUno;

          }

        }

        
        totalHrsDay += Number(diffHr) > 0 ? Number(diffHr) : 0;
        //se suma el total de horas por dia al total de horas trabajadas
        totalHrsTrabajadas += totalHrsDay;
        //se suma el total de horas de las incidencias
        totalHorasIncidencia += sumaHrsIncidencias;

        //al total de horas por dia se le suman las horas de las incidencias
        totalHrsDay += sumaHrsIncidencias;

        
        let test = Math.round((totalMinDay % 1)*100)/100;
        //datos por dia
        eventDays.push({
          date: format(dia, 'yyyy-MM-dd'),
          incidencia: objIncidencia,
          employeeShift: shift.events[0]?.nameShift,
          entrada: registrosChecador.length >= 1 ? format(new Date(firstHr), 'HH:mm:ss') : '',
          salida: registrosChecador.length >= 2 ? format(new Date(secondHr), 'HH:mm:ss') : '',
          dayHour: totalHrsDay + '.' + moment().minutes(totalMinDay).format('mm') ,
          //dayHour: (Number(moment(secondHr).format('HH.mm')) - Number(moment(firstHr).format('HH.mm'))).toFixed(2),
        });

        

        
      }


      var quo = Math.floor(totalMinutisTrabados / 60);
      totalHrsTrabajadas += quo;

      registros.push({
        idEmpleado: newArray[i].id,
        numeroNomina: newArray[i].employee_number,
        nombre: newArray[i].name + ' ' + newArray[i].paternal_surname + ' ' + newArray[i].maternal_surname,
        perfile: newArray[i].employeeProfile.name,
        date: eventDays,
        horas_objetivo: totalHrsRequeridas + '.' +moment().minutes(totalMinRequeridos).format('mm'),
        horasTrabajadas: totalHrsTrabajadas + '.' + moment().minutes(totalMinutisTrabados).format('mm'), //total hrs trabajadas
        totalHorasIncidencia: totalHorasIncidencia,
        colorText: totalHrsTrabajadas >= totalHrsRequeridas ? '#74ad74' : '#ff0000',
        tipo_nomina: newArray[i].payRoll,
      });


      //registros.concat(eventDays);
    }

    return {
      registros,
      diasGenerados,
    };
  }

  //obtener los lideres que tienen empleados a su cargo
  //para obtener las incidencias con status pendiente
  //obtener las correcciones de tiempo de los empleados
  async getReportPendingIncidence(){
    
    let idsJefeTurno: number[];
    let idsLider: number[] = [];
    let user: any;
    let empleados: any;
    let visibleJefeTurno: any[];
    
    let listOrg = [];

    //se obtienen los jefes de turno
    const jefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'emp')
      .innerJoinAndSelect('emp.job', 'job')
      .where('job.deleted_at IS NULL')
      .andWhere('job.cv_name = :name', { name: 'Jefe de Turno' })
      .getMany();

    idsJefeTurno = jefeTurno.map(jefe => jefe.id);

    //se asignan los jefes de turno al arreglo de lideres
    idsLider = [...idsJefeTurno];
    
    //se obtienen los lideres que tienen empleados a su cargo
    try {
       listOrg = await this.dataSource.manager.createQueryBuilder('organigrama', 'organigrama')
      .innerJoinAndSelect('organigrama.leader', 'leader')
      .select('leader.id', 'leaderId')
      .addSelect('leader.name', 'leaderName')
      .addSelect('COUNT(organigrama.id)', 'total')
      .where('leader.deleted_at IS NULL')
      .andWhere('leader.id NOT IN (:...ids)', { ids: idsLider })
      .groupBy('leader.id')
      .getRawMany();
    } catch (error) {
      console.log(error)
    }
    
    
    let temporalIds = listOrg.map(lider => lider.leaderId);
    idsLider.push(...listOrg.map(lider => lider.leaderId));

    for (let i = 0; i < idsLider.length; i++) {
      let idsEmployees: number[] = [];
      let totalIncidenciaPendiente = 0;
      let registros = [];
      //si es jefe de turno agrega los empleados que su puesto es visible por jefe de turno
      
      
        //se obtiene el usuario del lider
        user = await this.dataSource.manager.createQueryBuilder('user', 'user')
        .innerJoin('user.employee', 'employee')
        .where('employee.id = :id', { id: idsLider[i] })
        .getMany();

        //se obtienen los empleados asignados al lider por organigrama
        let org =  await this.dataSource.manager.createQueryBuilder('organigrama', 'organigrama')
        .innerJoinAndSelect('organigrama.employee', 'employee')
        .innerJoinAndSelect('organigrama.leader', 'leader')
        .where('leader.id = :id', { id: idsLider[i] })
        .getMany();

        
        idsEmployees = [...org.map(emp => emp.employee.id)];

        //se obtienen los empleados que puesto es visible por jefe de turno
        if(idsJefeTurno.includes(idsLider[i])){
          visibleJefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
          .innerJoinAndSelect('employee.job', 'job')
          .innerJoinAndSelect('employee.payRoll', 'payRoll')
          .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
          .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
          .where('job.shift_leader = 1')
          .andWhere('employee.deleted_at IS NULL')
          .orderBy('employee.employee_number', 'ASC')
          .getMany();

          idsEmployees = [...idsEmployees, ...visibleJefeTurno.map(emp => emp.id)];

        }
        

        //se obtienen las incidencias pendientes de los empleados
        //y la fecha de la incidencia es 1 dia antes de la fecha actual
        const yesterday = subDays(new Date(), 1);
        let incidencias: any[];
        try {
          incidencias = await this.employeeIncidenceRepository.find({
            relations: {
              employee: true,
              incidenceCatologue: true,
              dateEmployeeIncidence: true,
            },
            where: {
              employee: {
                id: In(idsEmployees),
              },
              status: 'Pendiente',
              dateEmployeeIncidence: {
                date: LessThanOrEqual(new Date(format(yesterday, 'yyyy-MM-dd'))),
              },
            },
            order: {
              employee: {
                id: 'ASC',
              },
              type: 'ASC',
            },
          });
          
        } catch (error) {
          
        }
        
        //suma el total de incidencias pendientes
        totalIncidenciaPendiente += incidencias.length;

        //correccion de tiempos

        const diaAyer =  subDays(new Date(), 1);
        const sixMonthsAgo = subDays(new Date(), 90);
        
        const from = format(new Date(diaAyer), 'yyyy-MM-dd 00:00:00');
        const to = format(new Date(sixMonthsAgo), 'yyyy-MM-dd 23:59:59');

    
        //se recorre el arreglo de empleados
        //employees.emps
        let h = 0;
        for (const iterator of idsEmployees) {
          const eventDays = [];
          let totalHrsRequeridas = 0;
          let totalHrsTrabajadas = 0;
          const totalHrsExtra = 0;
    
          //se recorre el arreglo de dias generados
          for ( let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
            const dataDate = {
              start: index,
              end: index,
            };
            
            const searchTimeCorrection = await this.dataSource.manager.createQueryBuilder('time_correction', 'time_correction')
              .innerJoin('time_correction.employee', 'employee')
              .where('time_correction.date = :date', { date: format(index, 'yyyy-MM-dd') })
              .andWhere('employee.id = :id', { id: iterator })
              .getOne();
            
    
    
            //se verifica si el dia es festivo
            const dayCalendar = await this.calendarService.findByDate(index as any);
    
            if (dayCalendar) {
              if (dayCalendar.holiday) {
                continue;
              }
            }
    
            if (searchTimeCorrection) {
              continue;
            }
    
            const nowDate = new Date(index);

            //turno actual
            const employeeShif = await this.employeeShiftService.findMore(
              dataDate,
              [iterator],
            );
    
            //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
            //y que esten autorizadas
            const incidenciaCompensatorio =
              await this.employeeIncidenceRepository.find({
                relations: {
                  employee: true,
                  incidenceCatologue: true,
                  dateEmployeeIncidence: true,
                },
                where: {
                  employee: {
                    id: iterator,
                  },
                  dateEmployeeIncidence: {
                    date: Between(index as any, index as any),
                  },
                  status: 'Autorizada',
                  type: In(['Compensatorio', 'Repago']),
                },
                order: {
                  employee: {
                    id: 'ASC',
                  },
                  type: 'ASC',
                },
              });
    
            //si existe incidencia de tiempo compensatorio autorizada salta el proceso
            if (incidenciaCompensatorio.length > 0) {
              continue;
            }
    
            //se obtienen las incidencias del dia
            //si existe alguna de las siguientes no mostrara en el reporte
            const otherIncidence = await this.dataSource.manager.createQueryBuilder('employee_incidence', 'employee_incidence')
              .innerJoin('employee_incidence.employee', 'employee')
              .innerJoin('employee_incidence.incidenceCatologue', 'incidenceCatologue')
              .where('employee.id = :id', { id: iterator })
              .andWhere('employee_incidence.status IN (:status)', { status: ['Autorizada'] })
              .andWhere('employee_incidence.date BETWEEN :from AND :to', { from: format(new Date(index), 'yyyy-MM-dd'), to: format(new Date(index), 'yyyy-MM-dd') })
              .andWhere('incidenceCatologue.code_band IN (:...code_band)', { code_band: ['VAC', 'PSTP', 'PETP', 'PSTL', 'PCS', 'PETL', 'PSS', 'HDS', 'CAST', 'FINJ', 'HE', 'INC', 
                'DFT', 'VacM', 'Sind', 'PRTC', 'DOM', 'VACA', 'HO', 'HET', 'PSSE'] })
              .getMany();

            
            if (employeeShif.events.length == 0) {
              continue;
            }
    
            //si existe incidencia no se muestra en el reporte
            if (otherIncidence.length > 0) {
              
              continue;
            }
    
            const turnoActual = employeeShif.events[0]?.nameShift;
            let hrEntrada = '00:00:00';
            let hrSalida = '23:59:00';
            let diaAnterior;
            let diaSiguente;
    
            const dataDateAnterior = {
              start: new Date(nowDate.setDate(nowDate.getDate() - 1)),
              end: new Date(nowDate.setDate(nowDate.getDate() - 1)),
            };
            const dataDateSiguiente = {
              start: new Date(nowDate.setDate(nowDate.getDate() + 1)),
              end: new Date(nowDate.setDate(nowDate.getDate() + 1)),
            };
    
            const employeeShifAnterior = await this.employeeShiftService.findMore(
              dataDateAnterior,
              `${iterator}`,
            );
            const employeeShifSiguiente = await this.employeeShiftService.findMore(
              dataDateSiguiente,
              `${iterator}`,
            );
            const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
            const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;
    
            //turno actual es igual al turno del dia anterior
            if (turnoActual == turnoAnterior) {
              //turno actual es igual al turno del dia siguiente
              if (turnoActual == turnoSiguiente) {
                switch (turnoActual) {
                  case 'T1':
                    hrEntrada = '21:00:00'; //dia anterior
                    hrSalida = '22:00:00'; //dia actual
                    diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                    diaSiguente = new Date(index);
                    break;
                  case 'T2':
                    hrEntrada = '05:00:00'; //dia Actual
                    hrSalida = '07:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    break;
                  case 'T3':
                    hrEntrada = '13:00:00'; //dia actual
                    hrSalida = '15:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    break;
                  case 'MIX':
                    hrEntrada = '03:00:00'; //dia actual
                    hrSalida = '22:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'TI':
                    hrEntrada = '02:00:00'; //dia actual
                    hrSalida = '23:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'T4':
                    hrEntrada = '21:00:00'; //dia anterior
                    hrSalida = '22:00:00'; //dia actual
                    diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                    diaSiguente = new Date(index);
                    break;
                  case 'T12-1':
                    hrEntrada = '03:00:00'; //dia anterior
                    hrSalida = '22:00:00'; //dia actual
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'T12-2':
                    hrEntrada = '09:00:00'; //dia anterior
                    hrSalida = '08:00:00'; //dia actual
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    break;
                }
              } else {
                switch (turnoActual) {
                  case 'T1':
                    hrEntrada = '21:00:00'; //dia anterior
                    hrSalida = '15:00:00'; //dia actual
                    diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                    diaSiguente = new Date(index);
                    break;
                  case 'T2':
                    hrEntrada = '05:00:00'; //dia Actual
                    hrSalida = '22:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'T3':
                    hrEntrada = '13:00:00'; //dia actual
                    hrSalida = '07:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    break;
                  case 'MIX':
                    hrEntrada = '03:00:00'; //dia actual
                    hrSalida = '22:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'TI':
                    hrEntrada = '02:00:00'; //dia actual
                    hrSalida = '23:00:00'; //dia siguiente
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'T4':
                    hrEntrada = '21:00:00'; //dia anterior
                    hrSalida = '15:00:00'; //dia actual
                    diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                    diaSiguente = new Date(index);
                    break;
                  case 'T12-1':
                    hrEntrada = '03:00:00'; //dia anterior
                    hrSalida = '22:00:00'; //dia actual
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                  case 'T12-2':
                    hrEntrada = '12:00:00'; //dia anterior
                    hrSalida = '08:00:00'; //dia actual
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    break;
                }
              }
            } else {
              switch (turnoActual) {
                case 'T1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '16:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T2':
                  hrEntrada = '11:00:00'; //dia Actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T3':
                  hrEntrada = '20:00:00'; //dia actual
                  hrSalida = '08:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
                case 'MIX':
                  hrEntrada = '03:00:00'; //dia actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'TI':
                  hrEntrada = '02:00:00'; //dia actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T4':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '16:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T12-1':
                    hrEntrada = '03:00:00'; //dia anterior
                    hrSalida = '22:00:00'; //dia actual
                    diaAnterior = new Date(index);
                    diaSiguente = new Date(index);
                    break;
                case 'T12-2':
                  hrEntrada = '14:00:00'; //dia anterior
                  hrSalida = '08:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
              }
            }
    
            const registrosChecadorNuevo = await this.checadorService.findbyDate(
              iterator,
              diaAnterior,
              diaSiguente,
              hrEntrada,
              hrSalida,
            );
            
    
            //se obtiene la hora de inicio y fin del turno
            let startTimeShift;
            let endTimeShift;
            if (turnoActual != 'T3') {
              startTimeShift = moment(
                new Date(
                  `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
                ),
                'HH:mm',
              );
              endTimeShift = moment(
                new Date(
                  `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`,
                ),
                'HH:mm',
              );
            } else {
              startTimeShift = moment(
                new Date(
                  `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
                ),
                'HH:mm',
              );
              endTimeShift = moment(
                new Date(
                  `${format(diaSiguente, 'yyyy-MM-dd')} ${
                    employeeShif.events[0]?.endTimeshift
                  }`,
                ),
                'HH:mm',
              );
            }
    
            const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
            totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;
    
            //se obtienen los registros del dia
            
            const firstDate = moment(new Date(registrosChecadorNuevo[0]?.date));
            const secondDate = moment(new Date(registrosChecadorNuevo[registrosChecadorNuevo.length - 1]?.date));
            let diffDate = secondDate.diff(firstDate, 'hours', true);
            let calculoHrsExtra = 0;
            const incidenciaVac = false;
    
            const hours = Math.floor(diffDate);
            const minutes = (diffDate - hours) * 60;
    
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes); 
    
    
            //si el total de horas registradas es menor al total de horas por dia -3
            //o el total de horas registradas es mayor al total de horas por dia +3
            //muestra los datos
            if (diffDate >= diffTimeShift - 3 && diffDate <= diffTimeShift + 3) {
              continue;
            }
    
            const horas_realizadas = date.toTimeString().split(' ')[0].split(':');
    
            registros.push({
              id: h,
              id_empleado: iterator,
             
            });
    
            //si existe incidencia de vacaciones se toma como hrs trabajadas
            if (incidenciaVac) {
              diffDate = diffTimeShift;
            }
    
            //se calcula las horas trabajadas y hrs extra
            calculoHrsExtra +=
              diffDate - diffTimeShift <= 0 ? 0 : diffDate - diffTimeShift;
    
            totalHrsTrabajadas += diffDate >= 0 ? diffDate : 0;
    
            /* eventDays.push({
                        date: format(index, 'yyyy-MM-dd'),
                        incidencia: {extra: incidenceExtra, incidencias: incidencias},
                        employeeShift: employeeShif.events[0]?.nameShift,
                    }); */
    
            h++;
          }
    
          totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;

        }

        let mailData = {
          totalIncidencias: totalIncidenciaPendiente,
          totalTimeCorrection: registros.length,
        }

        //envio de correo
        if(mailData.totalIncidencias > 0 || mailData.totalTimeCorrection > 0){
          
          await this.mailService.sendEmailPendingIncidence(user.map(user => user.email), 'Incidencias y correcciones de tiempo pendientes', mailData);
        }
        
      
    }
  }

  //obtener los lideres que tienen empleados a su cargo
  //para obtener las incidencias con status pendiente y que no se han procesado en mas de 48 horas
  //obtener las correcciones de tiempo de los empleados
  async getReportPendingIncidence48(){
    
    let idsJefeTurno: number[];
    let idsLider: number[] = [];
    let user: any;
    let empleados: any;
    let idsEmployees: number[] = [];
    let visibleJefeTurno: any[];
    

    //se obtienen los jefes de turno
    const jefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'emp')
      .innerJoinAndSelect('emp.job', 'job')
      .where('job.deleted_at IS NULL')
      .andWhere('job.cv_name = :name', { name: 'Jefe de Turno' })
      .getMany();

    idsJefeTurno = jefeTurno.map(jefe => jefe.id);

    //se asignan los jefes de turno al arreglo de lideres
    idsLider = [...idsJefeTurno];
    
    //se obtienen los lideres que tienen empleados a su cargo
    const listOrg = await this.dataSource.manager.createQueryBuilder('organigrama', 'organigrama')
      .innerJoinAndSelect('organigrama.leader', 'leader')
      .select('leader.id', 'leaderId')
      .addSelect('leader.name', 'leaderName')
      .addSelect('COUNT(organigrama.id)', 'total')
      .where('leader.deleted_at IS NULL')
      .andWhere('leader.id NOT IN (:...ids)', { ids: idsLider })
      .groupBy('leader.id')
      .getRawMany();

    let temporalIds = listOrg.map(lider => lider.id);
    idsLider.push(...listOrg.map(lider => lider.id));
    
    
    for (let i = 0; i < idsLider.length; i++) {
      let idsEmployees: number[] = [];
      let totalIncidenciaPendiente = 0;
      let registros = [];
      
      //se obtiene el usuario del lider
      user = await this.dataSource.manager.createQueryBuilder('user', 'user')
      .innerJoin('user.employee', 'employee')
      .where('employee.id = :id', { id: idsLider[i] })
      .getMany();

      //se obtienen los empleados asignados al lider por organigrama
      let org =  await this.dataSource.manager.createQueryBuilder('organigrama', 'organigrama')
      .innerJoinAndSelect('organigrama.employee', 'employee')
      .innerJoinAndSelect('organigrama.leader', 'leader')
      .where('leader.id = :id', { id: idsLider[i] })
      .getMany();

      
      idsEmployees = [...org.map(emp => emp.employee.id)];


      //se obtienen los empleados que puesto es visible por jefe de turno
      if(idsJefeTurno.includes(idsLider[i])){
        visibleJefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
        .innerJoinAndSelect('employee.job', 'job')
        .innerJoinAndSelect('employee.payRoll', 'payRoll')
        .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
        .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
        .where('job.shift_leader = 1')
        .andWhere('employee.deleted_at IS NULL')
        .orderBy('employee.employee_number', 'ASC')
        .getMany();

        idsEmployees = [...idsEmployees, ...visibleJefeTurno.map(emp => emp.id)];

      }
      

      //se obtienen las incidencias pendientes de los empleados
      //y la fecha de la incidencia es 1 dia antes de la fecha actual
      
      const diaAyer =  subDays(new Date(), 2);
      const sixMonthsAgo = subDays(new Date(), 90);
      let incidencias: any[];
      try {
        incidencias = await this.employeeIncidenceRepository.find({
          relations: {
            employee: true,
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
          where: {
            employee: {
              id: In(idsEmployees),
            },
            status: 'Pendiente',
            dateEmployeeIncidence: {
              date: LessThan(new Date(format(diaAyer, 'yyyy-MM-dd'))),
            },
          },
          order: {
            employee: {
              id: 'ASC',
            },
            type: 'ASC',
          },
        });
        
      } catch (error) {
        
      }
      
      //suma el total de incidencias pendientes
      totalIncidenciaPendiente += incidencias.length;

      //correccion de tiempos
      //fecha inicio y fecha fin
      const from = format(new Date(sixMonthsAgo), 'yyyy-MM-dd 23:59:59');
      const to = format(new Date(diaAyer), 'yyyy-MM-dd 00:00:00');
  
      //se recorre el arreglo de empleados
      //employees.emps
      let h = 0;
      for (const iterator of idsEmployees) {
        const eventDays = [];
        let totalHrsRequeridas = 0;
        let totalHrsTrabajadas = 0;
        const totalHrsExtra = 0;
        
        //se recorre el arreglo de dias generados
        for ( let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
          const dataDate = {
            start: index,
            end: index,
          };
          
          //se busca si existe una correccion de tiempo
          const searchTimeCorrection = await this.dataSource.manager.createQueryBuilder('time_correction', 'time_correction')
            .innerJoin('time_correction.employee', 'employee')
            .where('time_correction.date = :date', { date: format(index, 'yyyy-MM-dd') })
            .andWhere('employee.id = :id', { id: iterator })
            .getOne();
          
  
  
          //se verifica si el dia es festivo
          const dayCalendar = await this.calendarService.findByDate(index as any);
          
          //si es festivo no se muestra en el reporte
          if (dayCalendar) {
            if (dayCalendar.holiday) {
              continue;
            }
          }

          
          
          //si existe correccionm de tiempo salta el proceso
          if (searchTimeCorrection) {
            continue;
          }
  
          const nowDate = new Date(index);

          //turno actual
          const employeeShif = await this.employeeShiftService.findMore(
            dataDate,
            [iterator],
          );

          //si no existe turno actual no se muestra en el reporte
          if (employeeShif.events.length == 0) {
            continue;
          }
  
  
          //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
          //y que esten autorizadas
          const incidenciaCompensatorio =
            await this.employeeIncidenceRepository.find({
              relations: {
                employee: true,
                incidenceCatologue: true,
                dateEmployeeIncidence: true,
              },
              where: {
                employee: {
                  id: iterator,
                },
                dateEmployeeIncidence: {
                  date: Between(index as any, index as any),
                },
                status: 'Autorizada',
                type: In(['Compensatorio', 'Repago']),
              },
              order: {
                employee: {
                  id: 'ASC',
                },
                type: 'ASC',
              },
            });
  
          //si existe incidencia de tiempo compensatorio autorizada salta el proceso
          if (incidenciaCompensatorio.length > 0) {
            continue;
          }
  
          //se obtienen las incidencias del dia
          //si existe alguna de las siguientes no mostrara en el reporte
          const otherIncidence = await this.dataSource.manager.createQueryBuilder('employee_incidence', 'employee_incidence')
            .innerJoin('employee_incidence.employee', 'employee')
            .innerJoin('employee_incidence.incidenceCatologue', 'incidenceCatologue')
            .innerJoin('employee_incidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
            .where('employee.id = :id', { id: iterator })
            .andWhere('employee_incidence.status IN (:status)', { status: ['Autorizada'] })
            .andWhere('dateEmployeeIncidence.date BETWEEN :from AND :to', { from: format(new Date(index), 'yyyy-MM-dd'), to: format(new Date(index), 'yyyy-MM-dd') })
            .andWhere('incidenceCatologue.code_band IN (:...code_band)', { code_band: ['VAC', 'PSTP', 'PETP', 'PSTL', 'PCS', 'PETL', 'PSS', 'HDS', 'CAST', 'FINJ', 'HE', 'INC', 
              'DFT', 'VacM', 'Sind', 'PRTC', 'DOM', 'VACA', 'HO', 'HET', 'PSSE'] })
            .getMany();

          
                      
          
          //si existe incidencia no se muestra en el reporte
          if (otherIncidence.length > 0) {
            
            continue;
          }
  
          const turnoActual = employeeShif.events[0]?.nameShift;
          let hrEntrada = '00:00:00';
          let hrSalida = '23:59:00';
          let diaAnterior;
          let diaSiguente;
  
          const dataDateAnterior = {
            start: new Date(nowDate.setDate(nowDate.getDate() - 1)),
            end: new Date(nowDate.setDate(nowDate.getDate() - 1)),
          };
          const dataDateSiguiente = {
            start: new Date(nowDate.setDate(nowDate.getDate() + 1)),
            end: new Date(nowDate.setDate(nowDate.getDate() + 1)),
          };
  
          const employeeShifAnterior = await this.employeeShiftService.findMore(
            dataDateAnterior,
            `${iterator}`,
          );
          const employeeShifSiguiente = await this.employeeShiftService.findMore(
            dataDateSiguiente,
            `${iterator}`,
          );
          const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
          const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;
  
          //turno actual es igual al turno del dia anterior
          if (turnoActual == turnoAnterior) {
            //turno actual es igual al turno del dia siguiente
            if (turnoActual == turnoSiguiente) {
              switch (turnoActual) {
                case 'T1':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                  diaSiguente = new Date(index);
                  break;
                case 'T2':
                  hrEntrada = '05:00:00'; //dia Actual
                  hrSalida = '07:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
                case 'T3':
                  hrEntrada = '13:00:00'; //dia actual
                  hrSalida = '15:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
                case 'MIX':
                  hrEntrada = '03:00:00'; //dia actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'TI':
                  hrEntrada = '02:00:00'; //dia actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T4':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                  diaSiguente = new Date(index);
                  break;
                case 'T12-1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T12-2':
                  hrEntrada = '09:00:00'; //dia anterior
                  hrSalida = '08:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
              }
            } else {
              switch (turnoActual) {
                case 'T1':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                  diaSiguente = new Date(index);
                  break;
                case 'T2':
                  hrEntrada = '05:00:00'; //dia Actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T3':
                  hrEntrada = '13:00:00'; //dia actual
                  hrSalida = '07:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
                case 'MIX':
                  hrEntrada = '03:00:00'; //dia actual
                  hrSalida = '22:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'TI':
                  hrEntrada = '02:00:00'; //dia actual
                  hrSalida = '23:00:00'; //dia siguiente
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T4':
                  hrEntrada = '21:00:00'; //dia anterior
                  hrSalida = '15:00:00'; //dia actual
                  diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                  diaSiguente = new Date(index);
                  break;
                case 'T12-1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
                case 'T12-2':
                  hrEntrada = '12:00:00'; //dia anterior
                  hrSalida = '08:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                  break;
              }
            }
          } else {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T2':
                hrEntrada = '11:00:00'; //dia Actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T3':
                hrEntrada = '20:00:00'; //dia actual
                hrSalida = '08:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T4':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '16:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T12-1':
                  hrEntrada = '03:00:00'; //dia anterior
                  hrSalida = '22:00:00'; //dia actual
                  diaAnterior = new Date(index);
                  diaSiguente = new Date(index);
                  break;
              case 'T12-2':
                hrEntrada = '14:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
            }
          }
  
          const registrosChecadorNuevo = await this.checadorService.findbyDate(
            iterator,
            diaAnterior,
            diaSiguente,
            hrEntrada,
            hrSalida,
          );
          
  
          //se obtiene la hora de inicio y fin del turno
          let startTimeShift;
          let endTimeShift;
          if (turnoActual != 'T3') {
            startTimeShift = moment(
              new Date(
                `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
              ),
              'HH:mm',
            );
            endTimeShift = moment(
              new Date(
                `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`,
              ),
              'HH:mm',
            );
          } else {
            startTimeShift = moment(
              new Date(
                `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
              ),
              'HH:mm',
            );
            endTimeShift = moment(
              new Date(
                `${format(diaSiguente, 'yyyy-MM-dd')} ${
                  employeeShif.events[0]?.endTimeshift
                }`,
              ),
              'HH:mm',
            );
          }
  
          const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
          totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;
  
          //se obtienen los registros del dia
          
          const firstDate = moment(new Date(registrosChecadorNuevo[0]?.date));
          const secondDate = moment(new Date(registrosChecadorNuevo[registrosChecadorNuevo.length - 1]?.date));
          let diffDate = secondDate.diff(firstDate, 'hours', true);
          let calculoHrsExtra = 0;
          const incidenciaVac = false;
  
          const hours = Math.floor(diffDate);
          const minutes = (diffDate - hours) * 60;
  
          const date = new Date();
          date.setHours(hours);
          date.setMinutes(minutes); 
  
  
          //si el total de horas registradas es menor al total de horas por dia -3
          //o el total de horas registradas es mayor al total de horas por dia +3
          //muestra los datos
          if (diffDate >= diffTimeShift - 3 && diffDate <= diffTimeShift + 3) {
            continue;
          }
  
          const horas_realizadas = date.toTimeString().split(' ')[0].split(':');
  
          registros.push({
            id: h,
            id_empleado: iterator,
            
          });
  
          //si existe incidencia de vacaciones se toma como hrs trabajadas
          if (incidenciaVac) {
            diffDate = diffTimeShift;
          }
  
          //se calcula las horas trabajadas y hrs extra
          calculoHrsExtra +=
            diffDate - diffTimeShift <= 0 ? 0 : diffDate - diffTimeShift;
  
          totalHrsTrabajadas += diffDate >= 0 ? diffDate : 0;
  
          /* eventDays.push({
                      date: format(index, 'yyyy-MM-dd'),
                      incidencia: {extra: incidenceExtra, incidencias: incidencias},
                      employeeShift: employeeShif.events[0]?.nameShift,
                  }); */
  
          h++;
        }
  
        totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;

      }

      let jefeLider = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
      .innerJoinAndSelect('employee.organigramaL', 'org')
      .innerJoinAndSelect('org.leader', 'leader')
      .innerJoinAndSelect('leader.userId', 'user')
      .where('employee.id = :id', { id: idsLider[i] })
      .getOne();

      let mailData = {
        totalIncidencias: totalIncidenciaPendiente,
        totalTimeCorrection: registros.length,
        liderName: jefeLider.name + ' ' + jefeLider.paternal_surname + ' ' + jefeLider.maternal_surname,
      }
      
      

      let correos: string[] = [];

      correos.push(jefeLider.organigramaL[0].leader.userId[0].email);
      correos = [...correos, ...user.map(user => user.email)];
      
      //envio de correo
      if(mailData.totalIncidencias > 0 || mailData.totalTimeCorrection > 0){
        await this.mailService.sendEmailPendingIncidenceJefe(correos, 'Incidencias y correcciones de tiempo pendientes con mas de 48hrs', mailData);
      }
        
      
    }
  }
}
