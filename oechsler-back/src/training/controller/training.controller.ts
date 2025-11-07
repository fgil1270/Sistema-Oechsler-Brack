import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateTrainingDto, UpdateTrainingDto } from '../dto/create-training.dto';
import { TrainingService } from '../service/training.service';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Entrenamientos')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) { }

  @ApiOperation({ summary: 'Crear Entrenamiento de empleado' })
  @Post()
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingService.create(createTrainingDto);
  }

  @ApiOperation({ summary: 'Listar entrenamientos' })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.trainingService.findAll();
  }

  @ApiOperation({ summary: 'Acceder a las vistas de entrenamiento' })
  @HttpCode(HttpStatus.OK)
  @Get('access')
  @Views('entrenamiento')
  access() {
    return this.trainingService.findAll();
  }

  @ApiOperation({ summary: 'Listar entrenamiento por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar entrenamiento' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingDto: UpdateTrainingDto) {
    return this.trainingService.update(+id, updateTrainingDto);
  }

  @ApiOperation({ summary: 'Eliminar entrenamiento' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingService.remove(+id);
  }
}
