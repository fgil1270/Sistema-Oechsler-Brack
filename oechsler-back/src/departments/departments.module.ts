import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentsService } from './service/departments.service';
import { DepartmentsController } from './controller/departments.controller';
import { Department } from './entities/department.entity';
import { TrainingBudget } from './entities/training-budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, TrainingBudget])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
