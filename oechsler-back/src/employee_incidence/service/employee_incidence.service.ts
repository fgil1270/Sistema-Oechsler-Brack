import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';

import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { EmployeeIncidence } from "../entities/employee_incidence.entity";


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
        incidenceCatologue: true
      },
      where: {
        employee: {
          id: In(data.ids.split(','))
        },
        start_date: MoreThanOrEqual(from as any),
        end_date: LessThanOrEqual(to as any)
      }
    });

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
        start: incidence.start_date,
        end: incidence.end_date,
        backgroundColor: incidence.incidenceCatologue.color,
        unique_day: incidence.incidenceCatologue.unique_day,
      }
    });

    return incidencesEmployee;
  }

  //se obtienen las incidencias de los empleados por dia
  async findAllIncidencesDay(data: any) {
    
    console.log(data);
    let startDate = new Date(data.start);
    let from = format(new Date(data.start + ' 00:00:00'), 'yyyy-MM-dd')
    let to = format(new Date(data.end + ' 00:00:00'), 'yyyy-MM-dd')
    console.log(startDate);
    console.log(new Date(startDate));
    console.log(from);
    const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true
      },
      where: {
        employee: {
          id: In(data.ids.split(','))
        },
        start_date: from as any
        
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
        start: incidence.start_date,
        end: incidence.end_date,
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
