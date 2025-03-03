import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateCourseEfficiencyDto, UpdateCourseEfficiencyDto } from '../dto/course_efficiency.dto';
import { CourseEfficiencyService } from '../service/course_efficiency.service';

@ApiTags('Eficiencia de cursos')
@Controller('course-efficiency')
export class CourseEfficiencyController {
  constructor(private readonly courseEfficiencyService: CourseEfficiencyService) {}

  @Post()
  create(@Body() createCourseEfficiencyDto: CreateCourseEfficiencyDto) {
    return this.courseEfficiencyService.create(createCourseEfficiencyDto);
  }

  @Get()
  findAll() {
    return this.courseEfficiencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseEfficiencyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseEfficiencyDto: UpdateCourseEfficiencyDto) {
    return this.courseEfficiencyService.update(+id, updateCourseEfficiencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseEfficiencyService.remove(+id);
  }
}
