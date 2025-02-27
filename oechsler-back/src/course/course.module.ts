/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseService } from './service/course.service';
import { CourseController } from './controller/course.controller';
import { Course } from './entities/course.entity';
import { CompetenceModule } from '../competence/competence.module';
import { TraininGoal } from './entities/trainin_goal.entity';
import { CourseFile } from './entities/course_file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, TraininGoal, CourseFile]), CompetenceModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
