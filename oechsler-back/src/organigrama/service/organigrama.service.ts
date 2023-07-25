import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateOrganigramaDto } from '../dto/create-organigrama.dto';
import { Organigrama } from "../entities/organigrama.entity";
import { EmployeesService } from '../../employees/service/employees.service';
import { Employee } from '../../employees/entities/employee.entity';

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Organigrama) private organigramaRepository: Repository<Organigrama>,
    private employeeService: EmployeesService
  ){}

  async create(createOrganigramaDto: CreateOrganigramaDto) {
    const orgExist = await this.organigramaRepository.findOne({
      relations: {
        leader: true,
        employee: true
      },
      where : {
        leader: {
          id: createOrganigramaDto.leader
        },
        employee: {
          id: createOrganigramaDto.employee
        }
      }
    });

    if (orgExist?.id) {
      throw new BadRequestException(`La Relacion ya existe`);
    }

    const leader = await this.employeeService.findOne(createOrganigramaDto.leader);
    const employee = await this.employeeService.findOne(createOrganigramaDto.employee);
    orgExist.leader = leader.emp;
    orgExist.employee = employee.emp;

    const org = this.organigramaRepository.create(orgExist);
    return await this.organigramaRepository.save(org);
  }

  async findAll() {
    const total = await this.organigramaRepository.count();
    const orgs = await this.organigramaRepository.find({
      relations: {
        leader: {
          department: true,
          job: true
        },
        employee: {
          department: true,
          job: true
        },
      }
    });
    
    if (!orgs) {
      throw new NotFoundException(`Organigrama not found`);
    }
    return {
      total: total,
      orgs: orgs
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} organigrama`;
  }

  async update(id: number, updateOrganigramaDto: CreateOrganigramaDto) {
    return `This action updates a #${id} organigrama`;
  }

  async remove(id: number) {
    return `This action removes a #${id} organigrama`;
  }
}
