import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateOrganigramaDto } from '../dto/create-organigrama.dto';
import { Organigrama } from '../entities/organigrama.entity';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Organigrama) private organigramaRepository: Repository<Organigrama>,
    private employeeService: EmployeesService
  ){}

  async create(createOrganigramaDto: CreateOrganigramaDto) {
    
    let orgDTO = {
      leader: null,
      employee: null,
      evaluar: false
    };

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
    try {
      const leader = await this.employeeService.findOne(createOrganigramaDto.leader);
      const employee = await this.employeeService.findOne(createOrganigramaDto.employee);
      
      orgDTO.leader = leader.emp;
      orgDTO.employee = employee.emp;
      orgDTO.evaluar = createOrganigramaDto.evaluar;
    } catch (error) {
      console.log(error);
    }
    

    const org = this.organigramaRepository.create(orgDTO);
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

  
  async findLeader(id: number) {
    //SE OBTIENEN LOS LIDERES DEL EMPLEADO
    const leaders = await this.organigramaRepository.find({
      relations: {
        leader: true,
        employee: true,
      },
      where: {
        employee: {
          id: id
        }
      },
    });
    
    let idsLeaders = [];
    idsLeaders.push(id);
    leaders.forEach((leader) => {
      idsLeaders.push(leader.leader.id);
    });
    
    const newLeaders = await this.employeeService.findLeaders(idsLeaders);
    
    return {
      orgs: newLeaders
    };
  }

  async findOne(id: number) {
    console.log(id);
    const org = await this.organigramaRepository.findOne({
      relations: {
        leader: {
          department: true,
          job: true
        },
        employee: {
          department: true,
          job: true
        },
      },
      where: {
        id: id
      }
    });
    if (!org) {
      throw new NotFoundException(`Organigrama #${id} not found`);
    }
    return {org};
  }

  async update(id: number, updateOrganigramaDto: CreateOrganigramaDto) {
    const org = await this.organigramaRepository.findOne({
      where: {
        id: id
      }
    });
    if (!org) {
      throw new NotFoundException(`Organigrama #${id} not found`);
    }
    const leader = await this.employeeService.findOne(updateOrganigramaDto.leader);
    org.leader = leader.emp;
    org.evaluar = updateOrganigramaDto.evaluar;
    return await this.organigramaRepository.save(org);
  }

  async remove(id: number) {
    return `This action removes a #${id} organigrama`;
  }
}
