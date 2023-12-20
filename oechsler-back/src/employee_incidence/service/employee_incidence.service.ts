import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto, ReportEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from "../entities/employee_incidence.entity";
import { DateEmployeeIncidence } from "../entities/date_employee_incidence.entity";
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { ChecadorService } from '../../checador/service/checador.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { MailService } from '../../mail/mail.service';


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
    private mailService: MailService
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
    
    if(IncidenceCatologue.require_shift){
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        await this.employeeShiftService.findEmployeeShiftsByDate(index, idsEmployees.split(','));
      }
    }

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

      //ENVIO DE CORREO
      /* const mail = await this.mailService.sendEmail(
        'Incidencia Creada', 
        `Incidencia: ${employeeIncidenceCreate.id} ${employeeIncidenceCreate.incidenceCatologue.name} - Empleado: ${employeeIncidenceCreate.employee.employee_number} ${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname} \nPara más información revisar vista de autorización de incidencias.`, 
        employeeIncidenceCreate.employee.name
      ); */
      
      const employeeIncidence = await this.employeeIncidenceRepository.save(employeeIncidenceCreate);
      
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
            
        ////////////
        ////////// revisar
        /////////
          /* const shift = await this.shiftService.findOne(createEmployeeShiftDto.shiftId); await this.employeeShiftService.findEmployeeShiftsByDate(index, idsEmployees.split(','));
          
          //Se obtiene el perfil del empleado
          

          let weekDaysProfile = employee.emps[j].employeeProfile.work_days.split(',');
          
          let dayLetter = weekDays[index.getDay()];
          let dayLetterProfile = weekDaysProfile.some((day) => day == dayLetter);
          
          
          if(shift.shift.code == 'TI'){
            dayLetterProfile = true;
          }
          //SI EL DIA SELECCIONADO EXISTE EN EL PERFIL DEL EMPLEADO
          if(dayLetterProfile){

            //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
            const employeeShiftExist = await this.employeeShiftService.findEmployeeShiftsByDate(
              index,
              [employee.emps[j].id]
            );
            
            
            if(!employeeShiftExist){
              
              const employeeShift = this.employeeShiftRepository.create({
                employee: employee.emp, 
                shift: shift.shift,
                start_date: format(index, 'yyyy-MM-dd') as any,
                end_date: format(index, 'yyyy-MM-dd') as any,
                pattern: null
              });
              
              await this.employeeShiftRepository.save(employeeShift);
            }else{
              employeeShiftExist.shift = shift.shift;
              
              await this.employeeShiftRepository.save(employeeShiftExist);
            }
          } */
        const dateEmployeeIncidence = await this.dateEmployeeIncidenceRepository.create({
          employeeIncidence: employeeIncidence,
          date: index
        }); 

        await this.dateEmployeeIncidenceRepository.save(dateEmployeeIncidence);
      }
      
    }

    /* employee.emps.forEach(async (emp) => {
      
      let isLeader: boolean = false;
      user.roles.forEach(role => {
        if(role.name == 'Jefe de Area' || role.name == 'RH'){
          isLeader = true;
        }
      });

      const employeeIncidenceCreate = await this.employeeIncidenceRepository.create({
        employee: emp,
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

      //ENVIO DE CORREO
      const mail = await this.mailService.sendEmail(
        'Incidencia Creada', 
        `Incidencia: ${employeeIncidenceCreate.id} ${employeeIncidenceCreate.incidenceCatologue.name} - Empleado: ${employeeIncidenceCreate.employee.employee_number} ${employeeIncidenceCreate.employee.name} ${employeeIncidenceCreate.employee.paternal_surname} ${employeeIncidenceCreate.employee.maternal_surname} \nPara más información revisar vista de autorización de incidencias.`, 
        employeeIncidenceCreate.employee.name
      );
      
      const employeeIncidence = await this.employeeIncidenceRepository.save(employeeIncidenceCreate);
      
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        const dateEmployeeIncidence = await this.dateEmployeeIncidenceRepository.create({
          employeeIncidence: employeeIncidence,
          date: index
        }); 

        await this.dateEmployeeIncidenceRepository.save(dateEmployeeIncidence);
      }

    });  */

    

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
          code: data.code? In(data.code) :  Not('')
        },
        status: In(data.status)
      } 
    });

    let i = 0;
    
    const incidencesEmployee = incidences.map(incidence => {
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
    });
    
    return incidencesEmployee;
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
      }

    });

    const userAutoriza = await this.employeeService.findOne(user.idEmployee);

    if(!employeeIncidence){
      throw new NotFoundException('No se encontro la incidencia');
    }

    if(updateEmployeeIncidenceDto.status == 'Autorizada'){
      employeeIncidence.date_aproved_leader = new Date();
      employeeIncidence.leader = userAutoriza.emp;
      //ENVIO DE CORREO
      const mail = await this.mailService.sendEmail(
        'Incidencia Autorizada', 
        `Incidencia: ${employeeIncidence.id} ${employeeIncidence.incidenceCatologue.name} - Empleado: ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname} \nPara más información revisar vista de autorización de incidencias.`, 
        employeeIncidence.employee.name
      );
    }

    if(updateEmployeeIncidenceDto.status == 'Rechazada'){
      employeeIncidence.date_canceled = new Date();
      employeeIncidence.canceledBy = userAutoriza.emp;
      //ENVIO DE CORREO
      const mail = await this.mailService.sendEmail(
        'Incidencia Rechazada', 
        `Incidencia: ${employeeIncidence.id} ${employeeIncidence.incidenceCatologue.name} - Empleado: ${employeeIncidence.employee.employee_number} ${employeeIncidence.employee.name} ${employeeIncidence.employee.paternal_surname} ${employeeIncidence.employee.maternal_surname} \nPara más información revisar vista de autorización de incidencias.`, 
        employeeIncidence.employee.name
      );
    }

    employeeIncidence.status = updateEmployeeIncidenceDto.status;
    return await this.employeeIncidenceRepository.save(employeeIncidence);

    //return await this.employeeIncidenceRepository.update(employeeIncidence.id, employeeIncidence);
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }
}
