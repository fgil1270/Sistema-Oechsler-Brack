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

import { TrainingMachine } from '../entities/training_machine.entity';
import { CreateTrainingMachineDto, UpdateTrainingMachineDto } from '../dto/create-training-machine.dto';


@Injectable()
export class TrainingMachineService {

  constructor(
    @InjectRepository(TrainingMachine) private trainingMachineRepository: Repository<TrainingMachine>,
  ) { }

  create(createTrainingMachineDto: CreateTrainingMachineDto) {
    return 'This action adds a new training-machine';
  }

  findAll() {
    const trainingMachines = this.trainingMachineRepository.find();

    return trainingMachines;
  }

  //buscar por id
  async findOne(id: number) {
    const trainingMachine = await this.trainingMachineRepository.findOne({ where: { id: id } });
    if (!trainingMachine) {
      throw new NotFoundException(`Training machine with ID ${id} not found`);
    }
    return trainingMachine;

  }

  update(id: number, updateTrainingMachineDto: UpdateTrainingMachineDto) {
    return `This action updates a #id training-machine`;
  }

  remove(id: number) {
    return `This action removes a #id training-machine`;
  }
}
