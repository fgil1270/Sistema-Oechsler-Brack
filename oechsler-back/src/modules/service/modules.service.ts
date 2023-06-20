import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleViews } from "../entities/module.entity";

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleViews) private moduleRepository: Repository<ModuleViews>
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const mod = this.moduleRepository.create(createModuleDto);
    return await this.moduleRepository.save(mod);
  }

  async findAll() {
    const mod = await this.moduleRepository.find();
    console.log(mod);
    if (!mod) {
      throw new NotFoundException(`Modules not found`);
    }
    return mod;
  }

  async findOne(id: number) {
    const mod = await this.moduleRepository.findOneBy({id:id});
    if (!mod) {
      throw new NotFoundException(`Module #${id} not found`);
    }
    return mod;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    const mod = await this.findOne(id);
    this.moduleRepository.merge(mod, updateModuleDto);
    return await this.moduleRepository.update(id, mod);
  }

  async remove(id: number) {
    return await this.moduleRepository.softDelete(id);
  }
}
