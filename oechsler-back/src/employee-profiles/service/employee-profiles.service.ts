import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateEmployeeProfileDto } from '../dto/create-employee-profile.dto';
import { EmployeeProfile } from "../entities/employee-profile.entity";

@Injectable()
export class EmployeeProfilesService {
  constructor(
    @InjectRepository(EmployeeProfile) private employeeProfileRepository: Repository<EmployeeProfile>
  ){}

  async create(createEmployeeProfileDto: CreateEmployeeProfileDto) {
    const empExist = await this.employeeProfileRepository.findOne({
      where: {
        code: Like(`%${createEmployeeProfileDto.code}%`)
      }
    });

    if (empExist?.id) {
      throw new BadRequestException(`El Perfil de Empleado ya existe`);
    }

    const emp = this.employeeProfileRepository.create(createEmployeeProfileDto);
    return await this.employeeProfileRepository.save(emp);
  }

  async findAll() {
    const total = await this.employeeProfileRepository.count();
    const emps = await this.employeeProfileRepository.find();
    
    if (!emps) {
      throw new NotFoundException(`Profiles not found`);
    }
    return {
      total: total,
      emps: emps
    };
  }

  async findOne(id: number) {
    const emp = await this.employeeProfileRepository.findOne({
      where: {
        id: id
      }
    });
    if (!emp) {
      return null;
      throw new NotFoundException(`Profile #${id} not found`);
    }
    return {
      emp
    };
  }

  async update(id: number, updateEmployeeProfileDto: CreateEmployeeProfileDto) {
    const emp = await this.employeeProfileRepository.findOneBy({id});
    this.employeeProfileRepository.merge(emp, updateEmployeeProfileDto);
    return await this.employeeProfileRepository.update(id, emp);
  }

  async remove(id: number) {
    const emp = await this.employeeProfileRepository.findOne({
      where: {
        id: id
      }
    });
    if (!emp) {
      throw new NotFoundException(`Profile #${id} not found`);
    }
    return await this.employeeProfileRepository.delete(id);
  }
}
