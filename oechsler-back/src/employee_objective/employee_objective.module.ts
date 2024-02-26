/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeObjetiveController } from './controller/employee_objetive.controller';
import { EmployeeObjetiveService } from './service/employee_objective.service';
import { DefinitionObjectiveAnnual } from './entities/definition_objective_annual.entity';
import { EmployeeObjective } from './entities/objective.entity';
import { EmployeeObjectiveEvaluation } from './entities/objetive_evaluation.entity';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { PercentageDefinitionModule } from '../evaluation_annual/percentage_definition/percentage_definition.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DefinitionObjectiveAnnual,
            EmployeeObjective,
            EmployeeObjectiveEvaluation,
        ]),
        OrganigramaModule,
        PercentageDefinitionModule
    ],
    controllers: [EmployeeObjetiveController],
    providers: [EmployeeObjetiveService],
    exports: [EmployeeObjetiveService]
})
export class EmployeeObjectiveModule {}
