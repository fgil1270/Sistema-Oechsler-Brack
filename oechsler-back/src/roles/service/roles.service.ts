import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private configService: ConfigService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(role);
  }

  async findAll() {
    const roles = await this.roleRepository.find();
    if (!roles) {
      throw new NotFoundException(`Roles not found`);
    }
    return roles;
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({id:id});
        
        if (!role) {
            throw new NotFoundException(`Role #${id} not found`);
        }
        return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    await this.roleRepository.merge(role, updateRoleDto);
    return await this.roleRepository.update(id, role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    return await this.roleRepository.softDelete(id);
  }
}
