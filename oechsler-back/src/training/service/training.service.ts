import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  UpdateResult,
  DeleteResult,
  IsNull,
  Not,
  Like,
  In,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Training } from '../entities/training.entity';
import { CreateTrainingDto, UpdateTrainingDto } from '../dto/create-training.dto';


@Injectable()
export class TrainingService {

  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>,
  ) { }

  create(createTrainingDto: CreateTrainingDto) {
    const training = this.trainingRepository.create(createTrainingDto);
    return this.trainingRepository.save(training);
  }

  findAll() {
    return this.trainingRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #id training`;
  }

  update(id: number, updateTrainingDto: UpdateTrainingDto) {
    return `This action updates a #id training`;
  }

  remove(id: number) {
    return `This action removes a #id training`;
  }
}
