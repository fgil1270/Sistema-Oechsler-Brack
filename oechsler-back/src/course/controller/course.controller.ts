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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { CourseService } from '../service/course.service';
import { CourseDto } from '../dto/create_course.dto';
import { Course } from '../entities/course.entity';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

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

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  // Add more controller methods as needed
}
