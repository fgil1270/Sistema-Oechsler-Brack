/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CourseService } from '../service/course.service';
import { CourseDto } from '../dto/create_course.dto';
import { Course } from '../entities/course.entity';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Cursos')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create a new course' })
  @Post()
  create(@Body() createCourseDto: CourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @ApiOperation({ summary: 'Obtener todos los cursos' })
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: 'Acceso a la vista de cursos' })
  @Get('/acceso')
  @Views('cursos')
  findOne() {
    return this.courseService.findAll();
  }

  
  @ApiOperation({ summary: 'Obtener objetivos de entrenamiento' })
  @Get('/trainin-goal')
  getTraininGoalAll() {
    return this.courseService.getTraininGoalAll();
  }

  @ApiOperation({ summary: 'Obtener curso por id' })
  @Get(':id')
  findCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id); 
  }

  @ApiOperation({ summary: 'Actualizar Curso' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: CourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Eliminar Curso' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.delete(id);
  }
}
