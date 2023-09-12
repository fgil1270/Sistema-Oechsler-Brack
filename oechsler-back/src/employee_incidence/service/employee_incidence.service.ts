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


@Injectable()
export class EmployeeIncidenceService {
  constructor(
    @InjectRepository(EmployeeIncidence) private employeeIncidenceRepository: Repository<EmployeeIncidence>,
    @InjectRepository(DateEmployeeIncidence) private dateEmployeeIncidenceRepository: Repository<DateEmployeeIncidence>,
    private incidenceCatologueService: IncidenceCatologueService,
    private employeeService: EmployeesService,
    private employeeShiftService: EmployeeShiftService
  ) {}

  async create(createEmployeeIncidenceDto: CreateEmployeeIncidenceDto, user: any) {
   
    let idsEmployees: any = createEmployeeIncidenceDto.id_employee;
    const IncidenceCatologue = await this.incidenceCatologueService.findOne(createEmployeeIncidenceDto.id_incidence_catologue);
    const employee = await this.employeeService.findMore(idsEmployees.split(','));
    const leader = await this.employeeService.findOne(user.id_employee);
    const startDate = new Date(createEmployeeIncidenceDto.start_date);
    const endDate = new Date(createEmployeeIncidenceDto.end_date);
    
    
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
        status: isLeader ? 'Autorizada' : 'Pendiente'
      });

      const employeeIncidence = await this.employeeIncidenceRepository.save(employeeIncidenceCreate);
      
      for (let index = new Date(createEmployeeIncidenceDto.start_date) ; index <= new Date(createEmployeeIncidenceDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        const dateEmployeeIncidence = await this.dateEmployeeIncidenceRepository.create({
          employeeIncidence: employeeIncidence,
          date: index
        }); 

        await this.dateEmployeeIncidenceRepository.save(dateEmployeeIncidence);
      }

    });

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
    
    //se obtienen las incidencias del dia seleccionado
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

    return incidencesEmployee;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employeeIncidence`;
  }

  async update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto) {

    
    const employeeIncidence = await this.employeeIncidenceRepository.findOne({
      where: {
        id: id
      }
    });

    if(!employeeIncidence){
      throw new NotFoundException('No se encontro la incidencia');
    }
    employeeIncidence.status = updateEmployeeIncidenceDto.status;
    
    return await this.employeeIncidenceRepository.update(employeeIncidence.id, employeeIncidence);;
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }
}
