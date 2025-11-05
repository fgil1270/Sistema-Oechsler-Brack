import { Injectable } from '@nestjs/common';
import { CreateTrainingMachineDto, UpdateTrainingMachineDto } from '../dto/create-training-machine.dto';


@Injectable()
export class TrainingMachineService {
  create(createTrainingMachineDto: CreateTrainingMachineDto) {
    return 'This action adds a new training-machine';
  }

  findAll() {
    return `This action returns all training-machines`;
  }

  findOne(id: number) {
    return `This action returns a #id training-machine`;
  }

  update(id: number, updateTrainingMachineDto: UpdateTrainingMachineDto) {
    return `This action updates a #id training-machine`;
  }

  remove(id: number) {
    return `This action removes a #id training-machine`;
  }
}
