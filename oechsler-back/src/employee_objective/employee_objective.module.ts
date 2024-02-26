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
import { CourseModule } from 'src/course/course.module';
import { DncCourse } from './entities/dnc_course.entity';
import { DncCourseManual } from './entities/dnc_manual.entity';
import { CourseEvaluation } from './entities/course_evaluation.entity';
import { CourseEvaluationMannual } from './entities/course_evaluation_mannual.entity';
import { CompetenceEvaluation } from './entities/competence_evaluation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DefinitionObjectiveAnnual,
            EmployeeObjective,
            EmployeeObjectiveEvaluation,
            DncCourse,
            DncCourseManual,
            CourseEvaluation,
            CourseEvaluationMannual,
            CompetenceEvaluation
        ]),
        OrganigramaModule,
        PercentageDefinitionModule,
        CourseModule
    ],
    controllers: [EmployeeObjetiveController],
    providers: [EmployeeObjetiveService],
    exports: [EmployeeObjetiveService]
})
export class EmployeeObjectiveModule {}
