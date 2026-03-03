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
  Between
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CompetenceDto } from '../dto/create_competence.dto';
import { Competence } from '../entities/competence.entity';
import { TypeCompetence } from '../entities/type_competence.entity';
import { TypeElementCompetence } from '../entities/type_element_competence.entity';

@Injectable()
export class CompetenceService {
  constructor(
    @InjectRepository(Competence) private competence: Repository<Competence>,
    @InjectRepository(TypeCompetence) private typeCompetence: Repository<TypeCompetence>,
    @InjectRepository(TypeElementCompetence) private typeElementCompetence: Repository<TypeElementCompetence>,
  ) { }

  async create(currData: CompetenceDto) {
    const competence = await this.competence.findOne({
      where: [
        { name: Like(`%${currData.name}%`) },
        { code: Like(`%${currData.code}%`) },
      ],
    });

    if (competence) {
      throw new NotFoundException('La competencia ya existe');
    }

    const typeCompetence = await this.typeCompetence.findOne({
      where: { id: 1 },
    });

    const typeElementCompetence = await this.typeElementCompetence.findOne({
      where: { id: 2 },
    });

    const newCompetence = this.competence.create({
      name: (currData.name.trim()),
      code: (currData.code.toUpperCase().trim()),
      typeCompetence: typeCompetence,
      typeElementCompetence: typeElementCompetence
    });
    return {
      data: await this.competence.save(newCompetence),
      message: 'Competencia creada exitosamente',
    };
  }

  async findAll() {
    const competence = await this.competence.find({
      relations: {
        typeCompetence: true,
        typeElementCompetence: true,
      },
    });

    return competence;
  }

  async findOne(id: number) {
    const competence = await this.competence.findOne({
      where: {
        id: id,
      },
      relations: {
        typeCompetence: true,
        typeElementCompetence: true,
        job: true,
        course: true,
      },
    });

    return competence;
  }
}
