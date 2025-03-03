import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEfficiencyService } from './service/course_efficiency.service';
import { CourseEfficiency } from './entities/course_efficiency.entity';
import { CourseEfficiencyQuestion } from './entities/course_efficiency_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEfficiency, CourseEfficiencyQuestion])],
  providers: [CourseEfficiencyService,],
  controllers: []
})
export class CourseEfficiencyModule { }
