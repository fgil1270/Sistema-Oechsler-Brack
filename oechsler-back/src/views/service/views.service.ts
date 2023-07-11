import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult, Not, IsNull } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateViewDto } from '../dto/create-view.dto';
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
    const total = await this.viewRepository.count();
    const views = await this.viewRepository.find();
    
    if (!views) {
      throw new NotFoundException(`Views not found`);
    }
    return {
      total: total,
      views: views
    };
  }

  async findAllDeleted() {
    const total = await this.viewRepository.count();
    const views = await this.viewRepository.find({ 
      where: { deleted_at: Not(IsNull()) }, withDeleted: true 
    });
    
    if (!views) {
      throw new NotFoundException(`Views not found`);
    }
    return {
      total: total,
      views: views
    };
  }

  async findOne(id: number) {
    console.log(typeof id);
    const view = await this.viewRepository.findOne({
      relations: {
        roles: true
      },
      where: {
        id: id
      },
      withDeleted: true
    });
    console.log(view)
    if (!view) {
      throw new NotFoundException(`View #${id} not found`);
    }
    return {
      view
    };
  }

  async update(id: number, updateModuleDto: CreateViewDto) {
    console.log(id);
    const view = await this.viewRepository.findOneBy({id});
    console.log(view);
    this.viewRepository.merge(view, updateModuleDto);
    return await this.viewRepository.update(id, view);
  }

  async remove(id: number) {
    return await this.viewRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.viewRepository.restore(id);
  }
}
