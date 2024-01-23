/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeObjetiveController } from './controller/employee_objetive.controller';
import { EmployeeObjetiveService } from './service/employee_objective.service';
import { EmployeeObjective } from './entities/employee_objective.entity';
import { EmployeeObjectiveEvaluation } from './entities/employee_objetive_evaluation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployeeObjective,
            EmployeeObjectiveEvaluation
        ])
    ],
    controllers: [EmployeeObjetiveController],
    providers: [EmployeeObjetiveService],
    exports: [EmployeeObjetiveService]
})
export class EmployeeObjectiveModule {}
