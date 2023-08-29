import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';

import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from "../entities/employee_incidence.entity";
import { el } from 'date-fns/locale';


@Injectable()
export class EmployeeIncidenceService {
  constructor(
    @InjectRepository(EmployeeIncidence) private employeeIncidenceRepository: Repository<EmployeeIncidence>
  ) {}

  async create(createEmployeeIncidenceDto: CreateEmployeeIncidenceDto) {
    return 'This action adds a new employeeIncidence';
  }

  async findAll() {
    return `This action returns all employeeIncidence`;
  }

  //se obtienen las incidencias de los empleados por rango de fechas y ids de empleados
  async findAllIncidencesByIdsEmployee(data: any) {
    
    let startDate = new Date(data.start);
    let from = format(new Date(startDate), 'yyyy-MM-dd')
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
        textColor: textColor
      }
    });
    console.log(incidencesEmployee);
    return incidencesEmployee;
  }

  //se obtienen las incidencias de los empleados por dia
  async findAllIncidencesDay(data: any) {
    
    console.log(data);
    let startDate = new Date(data.start.split('T')[0]);
    let year = startDate.getFullYear();
    let date = startDate.getUTCDate();
    let month = startDate.getMonth() + 1;
    let startDateFormat = format(new Date(year + '-' + month + '-' + date) , 'yyyy-MM-dd');
    let to = format(new Date(data.end), 'yyyy-MM-dd');
    console.log(data.start);
    console.log(startDate);
    console.log("mes: ", month);
    console.log("dia: ", date);
    console.log(startDateFormat);
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
    console.log(incidences);
    let i = 0;
    const incidencesEmployee = incidences.map(incidence => {
      i++;
      return {
        id: i,
        incidenceId: incidence.id,
        resourceId: incidence.employee.id,
        title: incidence.incidenceCatologue.name,
        description: incidence.descripcion,
        total_hour: incidence.total_hour,
        start: incidence.dateEmployeeIncidence,
        end: incidence.id,
        backgroundColor: incidence.incidenceCatologue.color,
        unique_day: incidence.incidenceCatologue.unique_day,
      }
    });

    return incidencesEmployee;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employeeIncidence`;
  }

  async update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto) {
    return `This action updates a #${id} employeeIncidence`;
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }
}
