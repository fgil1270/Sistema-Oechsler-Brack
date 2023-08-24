import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
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

  async findByIdsEmployee(data: any) {
    
    const incidences = await this.employeeIncidenceRepository.find({
      relations: {
        employee: true,
        incidenceCatologue: true
      },
      where: {
        employee: {
          id: In(data.ids.split(','))
        },
      }
    });
    console.log(incidences);
    const incidencesEmployee = incidences.map(incidence => {
      return {
        id: incidence.id,
        resourceId: incidence.employee.id,
        title: incidence.incidenceCatologue.name,
        start: incidence.start_date,
        end: incidence.end_date,
        backgroundColor: incidence.incidenceCatologue.color,
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
