import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEfficiencyService } from './service/course_efficiency.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [CourseEfficiencyService,],
  controllers: []
})
export class CourseEfficiencyModule { }
