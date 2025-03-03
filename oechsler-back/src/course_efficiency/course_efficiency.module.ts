import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEfficiencyService } from './service/course_efficiency.service';
import { CourseEfficiency } from './entities/course_efficiency.entity';
import { CourseEfficiencyQuestion } from './entities/course_efficiency_question.entity';
import { CourseEfficiencyController } from './controller/course_efficiency.controller';
import { RequestCourseModule } from '../request_course/request_course.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEfficiency, CourseEfficiencyQuestion]),
    RequestCourseModule,
    EmployeesModule,
  ],
  providers: [CourseEfficiencyService,],
  controllers: [CourseEfficiencyController]
})
export class CourseEfficiencyModule { }
