import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateEmployeeShiftDto, UpdateEmployeeShiftDto } from '../dto/create-employee_shift.dto';
import { EmployeeShift } from "../entities/employee_shift.entity";

@Injectable()
export class EmployeeShiftService {
  constructor(
    @InjectRepository(EmployeeShift) private employeeShiftRepository: Repository<EmployeeShift>
  ) {}

  async create(createEmployeeShiftDto: CreateEmployeeShiftDto) {
    
  }

  async findAll() {
    return `This action returns all employeeShift`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employeeShift`;
  }

  async update(id: number, updateEmployeeShiftDto: UpdateEmployeeShiftDto) {
    return `This action updates a #${id} employeeShift`;
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeShift`;
  }
}
