import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In, Not, IsNull } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateViewDto } from '../dto/create-view.dto';
import { View } from '../entities/view.entity';
import { Role } from "../../roles/entities/role.entity";

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View) private viewRepository: Repository<View>,
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  async create(createModuleDto: CreateViewDto) {
    const mod = this.viewRepository.create(createModuleDto);
    return await this.viewRepository.save(mod);
  }

  async findAll() {
    const total = await this.viewRepository.count();
    const views = await this.viewRepository.find({
      relations: {
        roles: true
      }
    });
    
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
      relations: {
        roles: true
      },
      where: { deleted_at: Not(IsNull()) }, 
      withDeleted: true 
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
    
    const view = await this.viewRepository.findOne({
      relations: {
        roles: true
      },
      where: {
        id: id
      },
      withDeleted: true
    });
    if (!view) {
      throw new NotFoundException(`View #${id} not found`);
    }
    return {
      view
    };
  }

  async update(id: number, updateModuleDto: CreateViewDto) {
    const view = await this.viewRepository.findOneBy({id});
    this.viewRepository.merge(view, updateModuleDto);
    return await this.viewRepository.update(id, view);
  }

  async remove(id: number) {
    return await this.viewRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.viewRepository.restore(id);
  }

  async addRole(id: number, updateModuleDto: any) {
    const view = await this.findOne(id);
    
    let roles: any;
    let rolesView: any[] = [];
    
    if (updateModuleDto.edit === true) {
        view.view.roles.forEach((role) => {
          
          rolesView.push(role.id)
        });
        
        rolesView.push(updateModuleDto.rolesIds);
        
        roles = await this.roleRepository.findBy({ id: In(rolesView)});
        view.view.roles = roles;
        
    }else{
        view.view.roles = view.view.roles.filter((role) => {
        return role.id !== updateModuleDto.rolesIds
      });
    }

    return await this.viewRepository.save(view.view);
  }
}
