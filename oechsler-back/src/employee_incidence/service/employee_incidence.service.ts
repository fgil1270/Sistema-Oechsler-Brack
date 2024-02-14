import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';
import * as moment from 'moment';
import ical, { ICalAttendee, ICalAttendeeStatus, ICalCalendarMethod, ICalEventBusyStatus, ICalEventStatus } from 'ical-generator';

import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto, ReportEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from "../entities/employee_incidence.entity";
import { DateEmployeeIncidence } from "../entities/date_employee_incidence.entity";
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { ChecadorService } from '../../checador/service/checador.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { MailData, MailService } from '../../mail/mail.service';
import { EmployeeProfile } from '../../employee-profiles/entities/employee-profile.entity';
import { UsersService } from '../../users/service/users.service';
import { ICalEvent, ICalCalendar } from 'ical-generator';


@Injectable()
export class EmployeeIncidenceService {
  constructor(
    @InjectRepository(EmployeeIncidence) private employeeIncidenceRepository: Repository<EmployeeIncidence>,
    @InjectRepository(DateEmployeeIncidence) private dateEmployeeIncidenceRepository: Repository<DateEmployeeIncidence>,
    private incidenceCatologueService: IncidenceCatologueService,
    private employeeService: EmployeesService,
    private employeeShiftService: EmployeeShiftService,
    @Inject(forwardRef(() => ChecadorService)) private checadorService: ChecadorService,
    private payRollService: PayrollsService,
    private organigramaService: OrganigramaService,
    private mailService: MailService,
    private userService: UsersService
  ) {}

  async create(createEmployeeIncidenceDto: CreateEmployeeIncidenceDto, user: any) {
    
      let idsEmployees: any = createEmployeeIncidenceDto.id_employee;
      const IncidenceCatologue = await this.incidenceCatologueService.findOne(createEmployeeIncidenceDto.id_incidence_catologue);
      const employee = await this.employeeService.findMore(idsEmployees.split(','));
      const leader = await this.employeeService.findOne(user.idEmployee);
      const startDate = new Date(createEmployeeIncidenceDto.start_date);
      const endDate = new Date(createEmployeeIncidenceDto.end_date);
      const createdBy = await this.employeeService.findOne(user.idEmployee);
      const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
      let totalDays = 0;
      
      /* if(IncidenceCatologue.require_shift){
        for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
          await this.employeeShiftService.findEmployeeShiftsByDate(index, idsEmployees.split(','));
        }
      } */

      for (let j = 0; j < employee.emps.length; j++) {
        const element = employee.emps[j];

        let isLeader: boolean = false;
        user.roles.forEach(role => {
          if(role.name == 'Jefe de Area' || role.name == 'RH' || role.name == 'Admin'){
            isLeader = true;
          }
        });

        if(employee.emps[j].id == user.idEmployee){
          isLeader = false;
        }

        for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {

          let ifCreate = false;
          let weekDaysProfile = employee.emps[j].employeeProfile.work_days;
          
          let dayLetter = weekDays[index.getDay()];
          let dayLetterProfile = false;

          for (let index = 0; index < weekDaysProfile.length; index++) {
            const letraPerfil = weekDaysProfile[index];
            if(letraPerfil == dayLetter){
              dayLetterProfile = true;
            }
            
          }

          //SI EL DIA SELECCIONADO EXISTE EN EL PERFIL DEL EMPLEADO
          if(dayLetterProfile){

            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            const employeeShiftExist = await this.employeeShiftService.findEmployeeShiftsByDate(
              index,
              [employee.emps[j].id]
            );
            totalDays++;
            
          }else{
            //si el dia no pertenece al perfil
            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            let sql = `select * from employee_shift where employeeId = ${employee.emps[j].id} and start_date = '${format(index, 'yyyy-MM-dd')}'`;
            const employeeShiftExist = await this.employeeIncidenceRepository.query(sql);
            
            if(employeeShiftExist.length > 0){
              totalDays++;
            }
           
            /* const employeeShiftExist = await this.employeeShiftService.findEmployeeShiftsByDate(
              index,
              [employee.emps[j].id]
            ); */
            
          }

          
        }
        
        const employeeIncidenceCreate = await this.employeeIncidenceRepository.create({
          employee: employee.emps[j],
          incidenceCatologue: IncidenceCatologue,
          descripcion: createEmployeeIncidenceDto.description,
          total_hour: createEmployeeIncidenceDto.total_hour,
          start_hour: createEmployeeIncidenceDto.start_hour,
          end_hour: createEmployeeIncidenceDto.end_hour,
          date_aproved_leader: isLeader ? new Date() : null,
          leader: isLeader ? leader.emp : null,
          status: isLeader ? 'Autorizada' : 'Pendiente',
          type: createEmployeeIncidenceDto.type, 
          createdBy: createdBy.emp
        });
        let to = [];
        let subject = '';
        if(employeeIncidenceCreate.employee.id == user.idEmployee){
          let lideres = await this.organigramaService.leaders(employeeIncidenceCreate.employee.id);
          for (let index = 0; index < lideres.orgs.length; index++) {
            const lider = lideres.orgs[index];
            const userLider = await this.userService.findByIdEmployee(lider.leader.id);
            to.push(userLider.user.email);
            
          }
          subject = `Autorizar incidencia: ${employeeIncidenceCreate.employee.employee_number}, ${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname}, Dia: ${format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd')} al ${format(new Date(createEmployeeIncidenceDto.end_date), 'yyyy-MM-dd')}`;
        }else{
          const mailUser = await this.userService.findByIdEmployee(employeeIncidenceCreate.employee.id);
          let lideres = await this.organigramaService.leaders(employeeIncidenceCreate.employee.id);
          for (let index = 0; index < lideres.orgs.length; index++) {
            const lider = lideres.orgs[index];
            const userLider = await this.userService.findByIdEmployee(lider.leader.id);
            to.push(userLider.user.email);
            
          }
          to.push(mailUser.user.email);
          subject = `${employeeIncidenceCreate.incidenceCatologue.name} / ${employeeIncidenceCreate.employee.employee_number}, ${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname}, Dia: ${format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd')} al ${format(new Date(createEmployeeIncidenceDto.end_date), 'yyyy-MM-dd')}`;
        }
        let mailData: MailData = {
            employee: `${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname}`,
            employeeNumber: employeeIncidenceCreate.employee.employee_number,
            incidence: employeeIncidenceCreate.incidenceCatologue.name,
            efectivos: totalDays,
            totalHours: createEmployeeIncidenceDto.total_hour,
            dia: `${format(new Date(createEmployeeIncidenceDto.start_date), 'yyyy-MM-dd')} al ${format(new Date(createEmployeeIncidenceDto.end_date), 'yyyy-MM-dd')}`
        };

        const calendar = ical();
        calendar.method(ICalCalendarMethod.REQUEST)
        calendar.timezone('America/Mexico_City');
        calendar.createEvent({
          start: new Date(employeeIncidenceCreate.dateEmployeeIncidence[0].date + ' ' + employeeIncidenceCreate.start_hour),
          end: new Date(employeeIncidenceCreate.dateEmployeeIncidence[employeeIncidenceCreate.dateEmployeeIncidence.length - 1].date +' '+ employeeIncidenceCreate.end_hour),
          timezone: 'America/Mexico_City',
          summary: subject,
          description: 'It works ;)',
          url: 'https://example.com',
          busystatus: ICalEventBusyStatus.FREE,
          //status: ICalEventStatus.CONFIRMED,
          attendees: [
            {
              email: to[1],
              status: ICalAttendeeStatus.ACCEPTED,
            },
            {
              email: to[0],
              rsvp:true,
              status: ICalAttendeeStatus.ACCEPTED,
            },
          ]
        });
        

        //ENVIO DE CORREO
        const mail = await this.mailService.sendEmailCreateIncidence(
          subject, 
          mailData,
          to
        ); 


        const employeeIncidence = await this.employeeIncidenceRepository.save(employeeIncidenceCreate);
        
        for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
              
          ////////////
          ////////// revisar
          /////////
                  
          //Se obtiene el perfil del empleado
         
          let ifCreate = false;
          let weekDaysProfile = employee.emps[j].employeeProfile.work_days;
          
          let dayLetter = weekDays[index.getDay()];
          let dayLetterProfile = false;
          for (let index = 0; index < weekDaysProfile.length; index++) {
            const letraPerfil = weekDaysProfile[index];
            if(letraPerfil == dayLetter){
              dayLetterProfile = true;
            }
            
          }
          //SI EL DIA SELECCIONADO EXISTE EN EL PERFIL DEL EMPLEADO
          if(dayLetterProfile){

            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            ifCreate = true;
          }else{
            //si el dia no pertenece al perfil
            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            let sql = `select * from employee_shift where employeeId = ${employee.emps[j].id} and start_date = '${format(index, 'yyyy-MM-dd')}'`;
            const employeeShiftExist = await this.employeeIncidenceRepository.query(sql);
            
            if(employeeShiftExist.length > 0){
              ifCreate = true;
            }
            
            
          }
          //si el dia tiene turno crea la incidencia en el dia
          if(ifCreate){
            const dateEmployeeIncidence = await this.dateEmployeeIncidenceRepository.create({
              employeeIncidence: employeeIncidence,
              date: index
            }); 
  
            await this.dateEmployeeIncidenceRepository.save(dateEmployeeIncidence);
          }

          
        }
        
      }

    return ;
  }

  async findAll() {
    return `This action returns all employeeIncidence`;
  }

  //se obtienen las incidencias de los empleados por rango de fechas y ids de empleados
  async findAllIncidencesByIdsEmployee(data: any) {
    
    let startDate = new Date(data.start); 
    let from = format(new Date(data.start), 'yyyy-MM-dd')
    let to = format(new Date(data.end), 'yyyy-MM-dd')
    let tipo = '';

    const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true
      },
      where: {
        employee: {
          id: In(data.ids.split(','))
        }, 
        dateEmployeeIncidence: {
          date: Between(from as any, to as any)
        },
        incidenceCatologue: {
          code: data.code? In(data.code) :  Not(IsNull())
        },
        status: data.status? In(data.status) : Not(IsNull())
      } 
    });
    
    let i = 0;
    let newIncidences = [];

    if(incidences){
      incidences.forEach(incidence => {
        let textColor = '#fff';
  
        if(incidence.incidenceCatologue.color == '#faf20f' || incidence.incidenceCatologue.color == '#ffdeec'){
          textColor = '#000';
        }
  
        incidence.dateEmployeeIncidence.forEach(date => {
          i++;
  
          newIncidences.push({
            id: i,
            incidenceId: incidence.id,
            resourceId: incidence.employee.id,
            title: incidence.incidenceCatologue.name,
            code: incidence.incidenceCatologue.code,
            codeBand: incidence.incidenceCatologue.code_band,
            reportNomina: incidence.incidenceCatologue.repor_nomina,
            description: incidence.descripcion,
            total_hour: incidence.total_hour,
            start: date.date,
            end: date.date,
            backgroundColor: incidence.incidenceCatologue.color,
            unique_day: incidence.incidenceCatologue.unique_day,
            textColor: textColor,
            status: incidence.status
          });
          
        });
  
        
  
      });
    }

    


    /* const incidencesEmployee = incidences.map(incidence => {
      i++;
      let textColor = '#fff';
      if(incidence.incidenceCatologue.color == '#faf20f' || incidence.incidenceCatologue.color == '#ffdeec'){
        textColor = '#000';
      }
      let dateLength = incidence.dateEmployeeIncidence.length;
      let startDate = incidence.dateEmployeeIncidence[0].date;
      let endDate = incidence.dateEmployeeIncidence[dateLength - 1].date;
      if(dateLength == 1){
        endDate = incidence.dateEmployeeIncidence[0].date;
      }else{
        endDate = incidence.dateEmployeeIncidence[dateLength - 1].date;
      }
       
      return {
        id: i,
        incidenceId: incidence.id,
        resourceId: incidence.employee.id,
        title: incidence.incidenceCatologue.name,
        code: incidence.incidenceCatologue.code,
        codeBand: incidence.incidenceCatologue.code_band,
        reportNomina: incidence.incidenceCatologue.repor_nomina,
        description: incidence.descripcion,
        total_hour: incidence.total_hour,
        start: startDate,
        end: endDate,
        backgroundColor: incidence.incidenceCatologue.color,
        unique_day: incidence.incidenceCatologue.unique_day,
        textColor: textColor,
        status: incidence.status
      }
    }); */
    
    return newIncidences;
  }

  //se obtienen las incidencias de los empleados por dia
  async findAllIncidencesDay(data: any) {

    let startDate = new Date(data.start + ' 00:00:00');
    let year = startDate.getFullYear();
    let date = startDate.getUTCDate();
    let month = startDate.getMonth() + 1;
    let startDateFormat = format(new Date(year + '-' + month + '-' + date) , 'yyyy-MM-dd');
    let to = format(new Date(data.end), 'yyyy-MM-dd');
    
    //datos del empleado
    const employee = await this.employeeService.findOne(data.ids);
    
    //se obtienen las incidencias del dia seleccionado
    const incidences = await this.employeeIncidenceRepository.find({
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
        employee: {
          id: In(data.ids.split(','))
        },
        dateEmployeeIncidence: {
          date: startDate as any
        }
      }
    });
    
    const employeeShift = await this.employeeShiftService.findEmployeeShiftsByDate(startDate, data.ids.split(','));
    
    //se genera arreglo de ids de incidencias
    const idsIncidence = incidences.map(incidence => incidence.id);

    //se obtienen los dias de la incidencias
    const dateIncidence = await this.dateEmployeeIncidenceRepository.find({
      where: {
        employeeIncidence: In(idsIncidence) 
      }
    });

    let i = 0;
    
    const incidencesEmployee = incidences.map(incidence => {
      i++;
      let dateLength = incidence.dateEmployeeIncidence.length;
      let startDate = incidence.dateEmployeeIncidence[0].date;
      let endDate = incidence.dateEmployeeIncidence[dateLength - 1].date;
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
        status: incidence.status
      }
    });
    
    return {
      incidencesEmployee,
      employee,
      employeeShift
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
        id: id
      }
    });

    if(!incidence){
      throw new NotFoundException('No se encontro la incidencia');
    }

    return incidence;
  }

  //buscar por estatus
  async findIncidencesByStatus(data: ReportEmployeeIncidenceDto, user: any){
    let whereQuery: any;
    let idsEmployees: any = [];

    //se obtienen los empleados por organigrama
    let organigrama = await this.organigramaService.findJerarquia(
      {
        type: data.type,
      },
      user
    );


    for (let index = 0; index < organigrama.length; index++) {
      const element = organigrama[index];
      idsEmployees.push(element.id);
    }

    if(data.status == 'Todas'){
      whereQuery = ''
    } else{
      whereQuery = {
        status: data.status,

      }
    }
    
    const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true,
        leader: true,
        createdBy: true,
      },
      where: {
        employee: {
          id: In(idsEmployees)
        }, 
        dateEmployeeIncidence: {
          date: Between(format(new Date(data.start_date), 'yyyy-MM-dd') , format(new Date(data.end_date), 'yyyy-MM-dd'))
        }, 
        ...whereQuery
      },
      
    });

    const total =  incidences.length;

    if(!incidences){
      throw new NotFoundException(`Incidencias con estatus ${data.status} no encontradas`);
    }

    return {
      incidences,
      total
    };
  }

  //buscar incidencias doubles
  async findIncidencesByStatusDouble(status: string, approvalDouble: boolean){
    
    let whereQuery: any;
    if(status == 'Todas'){
      whereQuery = [
        {
          status: 'Pendiente',
          incidenceCatologue: {
            approval_double: true
          },
        },
        {
          status: 'Autorizada',
          incidenceCatologue: {
            approval_double: true
          },
        },
        {
          status: 'Rechazada',
          incidenceCatologue: {
            approval_double: true
          },
        }
      ];
        
      
    } else{
      whereQuery = {
        status: status,
        incidenceCatologue: {
          approval_double: true
        },
      }
      
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
      where: whereQuery
      
    });

    const total =  await this.employeeIncidenceRepository.count({
      where: whereQuery
    });

    if(!incidences){
      throw new NotFoundException(`Incidencias con estatus ${status} no encontradas`);
    }

    return {
      incidences,
      total
    };
  }

  //report tiempo compensatorio
  async reportCompensatoryTime(data: any, userLogin: any){
    

    let from = format(new Date(data.start_date), 'yyyy-MM-dd')
    let to = format(new Date(data.end_date), 'yyyy-MM-dd')
    let isAdmin: boolean = false;
    let isLeader: boolean = false;
    let conditions: any;
    let report: any;
    let query = '';
    let dataEmployee = [];


    userLogin.roles.forEach(role => {
      if(role.name == 'Admin' || role.name == 'RH'){
        isAdmin = true;
      }
      if(role.name == 'Jefe de Area' || role.name == 'RH'){
        isLeader = true;
      } 
      
    });

    if(isAdmin){
      conditions = {
      };
      query = `SELECT * FROM employee AS e
      `; 
    }

    if(isLeader){ //leader o jefe de turno
      conditions = {
        job: {
          shift_leader: true
        },
        organigramaL: userLogin.idEmployee
      };

      query = `
            SELECT * FROM employee AS e
            INNER JOIN job AS j ON e.jobId = j.id
            WHERE j.shift_leader = 1 
            UNION
            SELECT * FROM employee AS e
            INNER JOIN organigrama AS o ON e.id = o.employeeId
            WHERE o.leaderId = ${userLogin.idEmployee}
            `;


    }
    
    const employees = await this.employeeIncidenceRepository.query(query);

    for (let i = 0; i < employees.length; i++) {
      let dataIncidence = [];

      //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
      //y que esten autorizadas 
      const incidenciaCompensatorio = await this.employeeIncidenceRepository.find({
        relations: {
          employee: true,
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
        where: {
          employee: {
            id: employees[i].id
          }, 
          dateEmployeeIncidence: {
            date: Between(from as any, to as any)
          },
          status: 'Autorizada',
          type: In(['Compensatorio', 'Repago']) 
        },
        order: {
          employee: {
            id: 'ASC'
          },
          type: 'ASC'
        }
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


        const employeeShift = await this.employeeIncidenceRepository.query(queryShift);
        
        
        //const employeeShift = await this.employeeShiftService.findEmployeeShiftsByDate(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date, [employees[i].id]);
        

        let hrEntrada = '';
        let hrSalida = '';
        let diaAnterior: any;
        let diaSiguente: any;
        let turnoActual = employeeShift[0].code;
        let nowDate = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);

        
        switch (turnoActual) {
          case 'T1':
              hrEntrada = '04:00:00'; //dia anterior
              hrSalida = '23:00:00'; //dia actual
              diaAnterior = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              diaSiguente = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              break;
          case 'T2':
              hrEntrada = '03:00:00'; //dia Actual
              hrSalida = '08:00:00'; //dia siguiente
              diaAnterior = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
              break;
          case 'T3':
              hrEntrada = '12:00:00';  //dia actual 
              hrSalida = '23:00:00';  //dia siguiente
              diaAnterior = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              diaSiguente = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date); 
              break;
          case 'MIX':
              hrEntrada = '02:00:00';  //dia actual 
              hrSalida = '23:00:00';  //dia siguiente
              diaAnterior = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              diaSiguente = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date); 
              break;
            case 'TI':
              hrEntrada = '02:00:00';  //dia actual
              hrSalida = '23:00:00';  //dia siguiente
              diaAnterior = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date);
              diaSiguente = new Date(incidenciaCompensatorio[j].dateEmployeeIncidence[0].date); 
              break;
        }
        
        const registrosChecador = await this.checadorService.findbyDate(parseInt(employees[i].id), diaAnterior, diaSiguente, hrEntrada, hrSalida);
        let firstHr = moment(new Date(registrosChecador[0]?.date));
        let secondHr = moment(new Date(registrosChecador[registrosChecador.length-1]?.date));
        let diffHr = secondHr.diff(firstHr, 'hours', true);
        let hrsTotales = incidenciaCompensatorio[j].total_hour - (diffHr > 0? diffHr : 0);
        
        dataIncidence.push({
          fecha: incidenciaCompensatorio[j].dateEmployeeIncidence[0].date, 
          concepto: incidenciaCompensatorio[j].type, 
          hrsAutorizadas: incidenciaCompensatorio[j].total_hour, 
          hrsTrabajadas: diffHr > 0? diffHr.toFixed(2) : 0, 
          hrsTotales: hrsTotales.toFixed(2) ,
        });
        
      }


      //se obtiene el tipo de nomina del empleado
      const payroll = await this.payRollService.findOne(employees[i].payRollId);


      dataEmployee.push({
        id: employees[i].id,
        name: employees[i].name + ' ' + employees[i].paternal_surname + ' ' + employees[i].maternal_surname,
        fecha: dataIncidence,
        nomina: payroll.payroll.name,
      });

      

    }

    

    
    return dataEmployee;


  }


  async update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto, user: any) {

    
    const employeeIncidence = await this.employeeIncidenceRepository.findOne({
      where: {
        id: id
      },
      relations: {
        employee: true,
        incidenceCatologue: true,
        dateEmployeeIncidence: true
      }

    });

    const userAutoriza = await this.employeeService.findOne(user.idEmployee);

    if(!employeeIncidence){
      throw new NotFoundException('No se encontro la incidencia');
    }
    const to = [];
    let emailUser = await this.userService.findByIdEmployee(employeeIncidence.employee.id);
    let lideres = await this.organigramaService.leaders(employeeIncidence.employee.id);
    for (let index = 0; index < lideres.orgs.length; index++) {
      const lider = lideres.orgs[index];
      const userLider = await this.userService.findByIdEmployee(lider.leader.id);
      to.push(userLider.user.email);
    }
    to.push(emailUser.user.email);

    let subject = '';
    let mailData: MailData;
    
    const calendar = ical();

    if(updateEmployeeIncidenceDto.status == 'Autorizada'){
      employeeIncidence.date_aproved_leader = new Date();
      employeeIncidence.leader = userAutoriza.emp;
      //ENVIO DE CORREO
      subject = `${employeeIncidence.incidenceCatologue.name} / ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname} / (-)`;
      mailData = {
        employee: `${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`,
        employeeNumber : employeeIncidence.employee.employee_number,
        incidence: employeeIncidence.incidenceCatologue.name,
        efectivos: 0,
        totalHours: employeeIncidence.total_hour,
        dia: ``
      };

      calendar.method(ICalCalendarMethod.REQUEST)
      calendar.timezone('America/Mexico_City');
      calendar.createEvent({
        start: new Date(employeeIncidence.dateEmployeeIncidence[0].date + ' ' + employeeIncidence.start_hour),
        end: new Date(employeeIncidence.dateEmployeeIncidence[employeeIncidence.dateEmployeeIncidence.length - 1].date +' '+ employeeIncidence.end_hour),
        timezone: 'America/Mexico_City',
        summary: subject,
        description: 'It works ;)',
        url: 'https://example.com',
        busystatus: ICalEventBusyStatus.FREE,
        //status: ICalEventStatus.CONFIRMED,
        attendees: [
          
          {
            email: to[1],
            status: ICalAttendeeStatus.ACCEPTED,
          },
          {
            email: to[0],
            rsvp:true,
            status: ICalAttendeeStatus.ACCEPTED,
          },
        ]
      });
      //se envia correo
      const mail = await this.mailService.sendEmailAutorizaIncidence(
        subject, 
        mailData,
        to,
        calendar
      );
      
      
    }

    if(updateEmployeeIncidenceDto.status == 'Rechazada'){
      employeeIncidence.date_canceled = new Date();
      employeeIncidence.canceledBy = userAutoriza.emp;
      //ENVIO DE CORREO
      subject = `Incidencia Rechazada: ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`;
      mailData = {
        employee: `${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname}`,
        employeeNumber : Number(employeeIncidence.employee.employee_number),
        incidence: employeeIncidence.incidenceCatologue.name,
        efectivos: 0,
        totalHours: employeeIncidence.total_hour,
        dia: ``
      };

      //se envia correo
      const mail = await this.mailService.sendEmailRechazaIncidence(
        subject, 
        mailData,
        to
      );
      
    }
    

    employeeIncidence.status = updateEmployeeIncidenceDto.status;
    return await this.employeeIncidenceRepository.save(employeeIncidence);

    //return await this.employeeIncidenceRepository.update(employeeIncidence.id, employeeIncidence);
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }

  //report horario flexible
  async reportFlexTime(data: any, userLogin: any){
    

    let from = format(new Date(data.start_date), 'yyyy-MM-dd')
    let to = format(new Date(data.end_date), 'yyyy-MM-dd')
    let isAdmin: boolean = false;
    let isLeader: boolean = false;
    let conditions: any;
    let employees: any;    
    let dataEmployee = [];
    let registros = [];
    let diasGenerados = [];
    let letraSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];


    userLogin.roles.forEach(role => {
      if(role.name == 'Admin' || role.name == 'RH'){
        isAdmin = true;
      }
      if(role.name == 'Jefe de Area' || role.name == 'RH'){
        isLeader = true;
      } 
      
    });

    if(isAdmin){
      conditions = {
      };
      employees = await this.employeeService.findAll(); 
      employees = employees.emps;
    }

    if(isLeader){ //leader o jefe de turno
      conditions = {
        job: {
          shift_leader: true
        },
        organigramaL: userLogin.idEmployee
      };

      employees = await this.organigramaService.findJerarquia({
        type: data.type,
        startDate : '',
        endDate: ''
      }, userLogin);
      


    }
   
    
    let newArray = employees.filter((e) => e.employeeProfile.name == 'PERFIL C - Mixto');
    //generacion de dias seleccionados

    for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
            
      diasGenerados.push(
          format(x, 'yyyy-MM-dd')
      );
      
    }
    
    

    for (let i = 0; i < newArray.length; i++) {
      let eventDays = [];
      let totalHrsRequeridas = 0;
      let totalHrsTrabajadas = 0;

      for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
            
        let dayLetter ;
        let weekDaysProfile = newArray[i].employeeProfile.work_days;
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
        
        totalHrsRequeridas = weekDaysProfile.includes(dayLetter)? totalHrsRequeridas + newArray[i].employeeProfile.work_shift_hrs : totalHrsRequeridas + 0;

      }

      for (let dia = new Date(from); dia <= new Date(to); dia = new Date(dia.setDate(dia.getDate() + 1))) {
            
        //se realiza la busqueda de incidencias de tiempo compensatorio por empleado y por rango de fechas
        //y que esten autorizadas 
        const incidencias = await this.employeeIncidenceRepository.find({
          relations: {
            employee: true,
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
          where: {
            employee: {
              id: newArray[i].id
            }, 
            dateEmployeeIncidence: {
              date: dia as any
            },
            status: 'Autorizada'
          },
          order: {
            employee: {
              id: 'ASC'
            },
            type: 'ASC'
          }
        });
        let sumaHrsIncidencias = 0;
        
        //se realiza la suma o resta de horas de las incidencias
        incidencias.some(async (incidence) => {
          let currentIncidence = await this.employeeIncidenceRepository.findOne({
            relations: {
              employee: true,
              incidenceCatologue: true,
              dateEmployeeIncidence: true,
            },
            where: {
              id: incidence.id
            }
          });

          if(incidence.incidenceCatologue.affected_type == 'Sumar horas'){
           
            sumaHrsIncidencias += Number(incidence.total_hour / currentIncidence.dateEmployeeIncidence.length);
            
          }
          if(incidence.incidenceCatologue.affected_type == 'Restar horas'){
            
            sumaHrsIncidencias -= Number(incidence.total_hour / currentIncidence.dateEmployeeIncidence.length);
          }
          
        });
          
        
        

        //se obtiene el turno del dia seleccionado
        let shift = await this.employeeShiftService.findMore({
          start: format(dia, 'yyyy-MM-dd'),
          end: format(dia, 'yyyy-MM-dd'),
        }, `${newArray[i].id}`);


        let hrEntrada = '00:00:00';
        let hrSalida = '23:59:59';
        let diaAnterior = dia;
        let diaSiguente = dia;

        const registrosChecador = await this.checadorService.findbyDate(parseInt(newArray[i].id), diaAnterior, diaSiguente, hrEntrada, hrSalida);
        let firstHr;
        let secondHr;
        let diffHr;

        if(registrosChecador.length > 0){
          firstHr = moment(new Date(registrosChecador[0]?.date));
          secondHr = registrosChecador.length > 1? moment(new Date(registrosChecador[registrosChecador.length-1]?.date)) : moment(new Date(registrosChecador[0]?.date));
          diffHr = secondHr.diff(firstHr, 'hours', true);

        }

        eventDays.push({
          date: format(dia, 'yyyy-MM-dd'),
          incidencia: incidencias,
          employeeShift: shift.events[0]?.nameShift,
          entrada: registrosChecador.length >= 1? format(new Date(firstHr), 'HH:mm:ss') : '',
          salida: registrosChecador.length >= 2? format(new Date(secondHr), 'HH:mm:ss') : '',
        });

        
        totalHrsTrabajadas += diffHr > 0? diffHr : 0;
        totalHrsTrabajadas += sumaHrsIncidencias;
                
      }

      
      registros.push({
        idEmpleado: newArray[i].id,
        numeroNomina: newArray[i].employee_number,
        nombre: newArray[i].name+' '+newArray[i].paternal_surname+' '+newArray[i].maternal_surname,
        perfile: newArray[i].employeeProfile.name,
        date: eventDays,
        horas_objetivo: totalHrsRequeridas.toFixed(2),
        horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
      }); 

      
    
      //registros.concat(eventDays); 

        
    }

    return {
      registros,
      diasGenerados
    };


  }
}
