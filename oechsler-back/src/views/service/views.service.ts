import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateViewDto } from '../dto/create-view.dto';
import { UpdateViewDto } from '../dto/update-view.dto';
import { View } from '../entities/view.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View) private viewRepository: Repository<View>
  ) {}

  async create(createModuleDto: CreateViewDto) {
    const mod = this.viewRepository.create(createModuleDto);
    return await this.viewRepository.save(mod);
  }

  async findAll() {
    const mod = await this.viewRepository.find();
    console.log(mod);
    if (!mod) {
      throw new NotFoundException(`Modules not found`);
    }
    return mod;
  }

  async findOne(id: number) {
    const mod = await this.viewRepository.findOneBy({id:id});
    if (!mod) {
      throw new NotFoundException(`Module #${id} not found`);
    }
    return mod;
  }

  async update(id: number, updateModuleDto: UpdateViewDto) {
    const mod = await this.findOne(id);
    this.viewRepository.merge(mod, updateModuleDto);
    return await this.viewRepository.update(id, mod);
  }

  async remove(id: number) {
    return await this.viewRepository.softDelete(id);
  }
}
