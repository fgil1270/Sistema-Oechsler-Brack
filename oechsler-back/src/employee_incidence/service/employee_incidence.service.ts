import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';

import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from "../entities/employee_incidence.entity";
import { DateEmployeeIncidence } from "../entities/date_employee_incidence.entity";
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { MailService } from '../../mail/mail.service';


@Injectable()
export class EmployeeIncidenceService {
  constructor(
    @InjectRepository(EmployeeIncidence) private employeeIncidenceRepository: Repository<EmployeeIncidence>,
    @InjectRepository(DateEmployeeIncidence) private dateEmployeeIncidenceRepository: Repository<DateEmployeeIncidence>,
    private incidenceCatologueService: IncidenceCatologueService,
    private employeeService: EmployeesService,
    private employeeShiftService: EmployeeShiftService,
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
    
    if(IncidenceCatologue.require_shift){
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        await this.employeeShiftService.findEmployeeShiftsByDate(index, idsEmployees.split(','));
      }
    }

    employee.emps.forEach(async (emp) => {
      
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
        createdBy: createdBy.emp
      });

      console.log(user);
      const employeeIncidence = await this.employeeIncidenceRepository.save(employeeIncidenceCreate);
      
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        const dateEmployeeIncidence = await this.dateEmployeeIncidenceRepository.create({
          employeeIncidence: employeeIncidence,
          date: index
        }); 

        await this.dateEmployeeIncidenceRepository.save(dateEmployeeIncidence);
      }

    });

    //ENVIO DE CORREO
    const mail = await this.mailService.sendEmail();

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
        }
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
          date: startDateFormat as any
        }
      }
    });
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
    employee.emp
    return {
      incidencesEmployee,
      employee
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
  async findIncidencesByStatus(status: string){
    let whereQuery: any;
    if(status == 'Todas'){
      whereQuery = [
        { status: 'Pendiente' },
        { status: 'Autorizada' },
        { status: 'Rechazada' }
      ]
    } else{
      whereQuery = {
        status: status
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

  async update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto, user: any) {

    
    const employeeIncidence = await this.employeeIncidenceRepository.findOne({
      where: {
        id: id
      }
    });

    const userAutoriza = await this.employeeService.findOne(user.idEmployee);

    if(!employeeIncidence){
      throw new NotFoundException('No se encontro la incidencia');
    }

    if(updateEmployeeIncidenceDto.status == 'Autorizada'){
      employeeIncidence.date_aproved_leader = new Date();
      employeeIncidence.leader = userAutoriza.emp;
    }
    if(updateEmployeeIncidenceDto.status == 'Rechazada'){
      employeeIncidence.date_canceled = new Date();
      employeeIncidence.canceledBy = userAutoriza.emp;
    }
    employeeIncidence.status = updateEmployeeIncidenceDto.status;
    return await this.employeeIncidenceRepository.save(employeeIncidence);

    //return await this.employeeIncidenceRepository.update(employeeIncidence.id, employeeIncidence);
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }
}
