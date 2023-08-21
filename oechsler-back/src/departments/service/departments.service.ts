import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateDepartmentDto } from '../dto/create-department.dto';
import { Department } from "../entities/department.entity";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private departmentRepository: Repository<Department>
  ){}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const deptExist = await this.departmentRepository.findOne({
      where: {
        cv_code: Like(`%${createDepartmentDto.cv_code}%`)
      }
    });

    if (deptExist?.id) {
      throw new BadRequestException(`El Departamento ya existe`);
    }

    const dept = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(dept);
  }

  async findAll() {
    const total = await this.departmentRepository.count();
    const depts = await this.departmentRepository.find({
      order: {
        cv_description: "ASC"
      }
    });
    
    if (!depts) {
      throw new NotFoundException(`Departments not found`);
    }
    
    return {
      total: total,
      depts: depts
    };
  }

  async findOne(id: number) {
    const dept = await this.departmentRepository.findOne({
      where: {
        id: id
      }
    });
    if (!dept) {
      throw new NotFoundException(`Deparment #${id} not found`);
    }
    
    return {
      dept
    };
  }

  async findName(name: string) {
    const dept = await this.departmentRepository.findOne({
      where: {
        cv_description: Like(`%${name}%`)
      }
    });
    if (!dept) {
      return null;
      throw new NotFoundException(`Deparment #${name} not found`);
    }
    return {dept};
  }

  async findLikeName(name: string) {
    let depts = await this.departmentRepository.find({
      where: {
        cv_description: Like(`%${name}%`)
      }
    });

    if(!depts) {
      throw new NotFoundException(`Departments not found`);
    }

    return {
      depts
    };
  }

  async update(id: number, updateDepartmentDto: CreateDepartmentDto) {
    const dept = await this.departmentRepository.findOneBy({id});
    this.departmentRepository.merge(dept, updateDepartmentDto);
    return await this.departmentRepository.update(id, dept);
  }

  async remove(id: number) {
    return await this.departmentRepository.softDelete(id);
  }
}
