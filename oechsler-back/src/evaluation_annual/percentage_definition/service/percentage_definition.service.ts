/*
https://docs.nestjs.com/providers#services
*/
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePercentageDefinitionDto } from '../dto/create_percentage_definition.dto';
import { PercentageDefinition } from '../entities/percentage_definition.entity';

@Injectable()
export class PercentageDefinitionService {
  constructor(
    @InjectRepository(PercentageDefinition)
    private percentageDefinitionRepository: Repository<PercentageDefinition>,
  ) {}

  status: {
    message: string;
    code: number;
    error: boolean;
  };

  async create(currData: CreatePercentageDefinitionDto) {
    const percentaje = await this.percentageDefinitionRepository.create(
      currData,
    );

    if (!(await this.percentageDefinitionRepository.save(percentaje))) {
      this.status = {
        message: 'Error al crear la definicion de porcentaje',
        code: 400,
        error: true,
      };

      return this.status;
    }

    this.status = {
      message: 'Definicion de porcentaje creada correctamente',
      code: 201,
      error: false,
    };

    return this.status;
  }

  async findAll() {
    const percentages = await this.percentageDefinitionRepository.find();

    if (!percentages) {
      this.status = {
        message: 'No se encontraron definiciones de porcentaje',
        code: 404,
        error: true,
      };

      return this.status;
    }

    this.status = {
      message: 'Definiciones de porcentaje encontradas',
      code: 200,
      error: false,
    };

    return {
      status: this.status,
      percentages: percentages,
    };
  }

  async findOne(id: number) {
    const percentage = await this.percentageDefinitionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!percentage) {
      this.status = {
        message: 'No se encontro la definicion de porcentaje',
        code: 404,
        error: true,
      };

      return {
        status: this.status,
        percentage: percentage,
      };
    }

    this.status = {
      message: 'Definicion de porcentaje encontrada',
      code: 200,
      error: false,
    };

    return {
      status: this.status,
      percentage: percentage,
    };
  }

  async findByYear(year: number) {
    const percentage = await this.percentageDefinitionRepository.findOne({
      where: {
        year: year,
      },
    });

    if (!percentage) {
      this.status = {
        message: 'No se encontro la definicion de porcentaje',
        code: 404,
        error: true,
      };

      return {
        status: this.status,
        percentage: percentage,
      };
    }

    this.status = {
      message: 'Definicion de porcentaje encontrada',
      code: 200,
      error: false,
    };

    return {
      status: this.status,
      percentage: percentage,
    };
  }
}
