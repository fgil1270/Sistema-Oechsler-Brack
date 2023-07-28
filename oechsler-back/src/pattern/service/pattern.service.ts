import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreatePatternDto, UpdatePatternDto } from '../dto/create-pattern.dto';
import { Pattern } from "../entities/pattern.entity";

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(Pattern) private patternRepository: Repository<Pattern>
  ) {}

  async create(createPatternDto: CreatePatternDto) {
    const patternExist = await this.patternRepository.findOne({
      where: {
        name: Like(`%${createPatternDto.name}%`)
      }
    });

    if (patternExist?.id) {
      throw new BadRequestException(`El Patrón ya existe`);
    }

    const pattern = this.patternRepository.create(createPatternDto);
    return await this.patternRepository.save(pattern);
  }

  async findAll() {
    const total = await this.patternRepository.count();
    const patterns = await this.patternRepository.find({
      relations: {
        shifts: true
      }
    });
    
    if (!patterns) {
      throw new NotFoundException(`Patterns not found`);
    }
    return {
      total: total,
      patterns: patterns
    };
  }

  async findOne(id: number) {
    const pattern = await this.patternRepository.findOne({
      where: {
        id: id
      },
      relations: {
        shifts: true
      }
    });
    if (!pattern) {
      throw new NotFoundException(`Pattern #${id} not found`);
    }
    return {
      pattern
    };
  }

  async update(id: number, updatePatternDto: UpdatePatternDto) {
    const pattern = await this.patternRepository.findOne({
      where: {
        id: id
      }
    });
    if (!pattern) {
      throw new NotFoundException(`Pattern #${id} not found`);
    }
    
    const patternUpdated = Object.assign(pattern, updatePatternDto);
    return await this.patternRepository.update(id, patternUpdated);
  }

  async remove(id: number) {
    const pattern = await this.patternRepository.findOne({
      where: {
        id: id
      }
    });
    if (!pattern) {
      throw new NotFoundException(`Pattern #${id} not found`);
    }
    return await this.patternRepository.softDelete(pattern);
  }
}
