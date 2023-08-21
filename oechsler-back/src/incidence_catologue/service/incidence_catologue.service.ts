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
    return `This action returns all incidenceCatologue`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} incidenceCatologue`;
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

    return await this.incidenceCatologueRepository.softDelete(incidenceCatologue);
  }
}