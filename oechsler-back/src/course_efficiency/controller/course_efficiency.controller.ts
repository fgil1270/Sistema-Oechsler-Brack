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

import { CreateCourseEfficiencyDto, UpdateCourseEfficiencyDto } from '../dto/course_efficiency.dto';
import { CourseEfficiencyService } from '../service/course_efficiency.service';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Eficiencia de cursos')
@Controller('course-efficiency')
export class CourseEfficiencyController {
  constructor(private readonly courseEfficiencyService: CourseEfficiencyService) { }

  @Post()
  create(@Body() createCourseEfficiencyDto: CreateCourseEfficiencyDto, @CurrentUser() user: any) {
    return this.courseEfficiencyService.create(createCourseEfficiencyDto, user);
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
function User(): (target: CourseEfficiencyController, propertyKey: "create", parameterIndex: 1) => void {
  throw new Error('Function not implemented.');
}

