import { Injectable } from '@nestjs/common';
import { CreateTrainingDto, UpdateTrainingDto } from '../dto/create-training.dto';


@Injectable()
export class TrainingService {
  create(createTrainingDto: CreateTrainingDto) {
    return 'This action adds a new training';
  }

  findAll() {
    return `This action returns all trainings`;
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
