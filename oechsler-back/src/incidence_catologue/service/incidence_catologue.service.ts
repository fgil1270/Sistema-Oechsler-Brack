import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateIncidenceCatologueDto, UpdateIncidenceCatologueDto } from '../dto/create-incidence_catologue.dto';
import { IncidenceCatologue } from "../entities/incidence_catologue.entity";

@Injectable()
export class IncidenceCatologueService {
  constructor(
    @InjectRepository(IncidenceCatologue) private incidenceCatologueRepository: Repository<IncidenceCatologue>
  ) {}

  async create(createIncidenceCatologueDto: CreateIncidenceCatologueDto) {
    return 'This action adds a new incidenceCatologue';
  }

  async findAll() {
    const incidenceCatologue = await this.incidenceCatologueRepository.find({
      order: {
        name: 'ASC'
      }
    });

    if (!incidenceCatologue) {
      throw new NotFoundException(`No se encontraron registros`);
    }

    return incidenceCatologue;

  }

  async findOne(id: number) {
    const incidenceCatologue = await this.incidenceCatologueRepository.findOne({
      where: {
        id: id
      }
    });

    if (!incidenceCatologue) {
      throw new NotFoundException(`IncidenceCatologue #${id} not found`);
    }

    return incidenceCatologue;
  }

  async findName(name: string) {
    const incidenceCatologue = await this.incidenceCatologueRepository.findOne({
      where: {
        name: name
      }
    });

    if (!incidenceCatologue) {
      throw new NotFoundException(`IncidenceCatologue #${name} not found`);
    }

    return incidenceCatologue; 
  }

  async update(id: number, updateIncidenceCatologueDto: UpdateIncidenceCatologueDto) {
    return `This action updates a #${id} incidenceCatologue`;
  }

  async remove(id: number) {
    const incidenceCatologue = await this.incidenceCatologueRepository.findOne({
      where: {
        id: id
      }
    });

    if (!incidenceCatologue) {
      throw new NotFoundException(`IncidenceCatologue #${id} not found`);
    } 

    return await this.incidenceCatologueRepository.softRemove(incidenceCatologue); 
  }
}
