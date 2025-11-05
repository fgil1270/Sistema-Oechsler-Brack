import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateTrainingMachineDto, UpdateTrainingMachineDto } from '../dto/create-training-machine.dto';
import { TrainingMachineService } from '../service/training-machine.service';

@Controller('training-machines')
export class TrainingMachineController {
  constructor(private readonly trainingMachineService: TrainingMachineService) { }

  @Post()
  create(@Body() createTrainingMachineDto: CreateTrainingMachineDto) {
    return this.trainingMachineService.create(createTrainingMachineDto);
  }

  @Get()
  findAll() {
    return this.trainingMachineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingMachineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingMachineDto: UpdateTrainingMachineDto) {
    return this.trainingMachineService.update(+id, updateTrainingMachineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingMachineService.remove(+id);
  }
}
