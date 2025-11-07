import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateTrainingMachineDto, UpdateTrainingMachineDto } from '../dto/create-training-machine.dto';
import { TrainingMachineService } from '../service/training-machine.service';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Maquinas de entrenamiento')
@Controller('training-machine')
export class TrainingMachineController {
  constructor(private readonly trainingMachineService: TrainingMachineService) { }

  @ApiOperation({ summary: 'Crear máquina de entrenamiento' })
  @Post()
  create(@Body() createTrainingMachineDto: CreateTrainingMachineDto) {
    return this.trainingMachineService.create(createTrainingMachineDto);
  }

  @ApiOperation({ summary: 'Listar máquinas de entrenamiento' })
  @Get()
  findAll() {
    return this.trainingMachineService.findAll();
  }

  @ApiOperation({ summary: 'Listar máquinas de entrenamiento' })
  @Get('access')
  @Views('training_machine')
  access() {
    return this.trainingMachineService.findAll();
  }



  @ApiOperation({ summary: 'Listar máquinas de entrenamiento por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingMachineService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar máquina de entrenamiento' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingMachineDto: UpdateTrainingMachineDto) {
    return this.trainingMachineService.update(+id, updateTrainingMachineDto);
  }

  @ApiOperation({ summary: 'Eliminar máquina de entrenamiento' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingMachineService.remove(+id);
  }
}
