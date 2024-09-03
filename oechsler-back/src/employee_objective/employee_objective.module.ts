/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeObjetiveController, EmployeeObjetiveMedioAnoController } from './controller/employee_objetive.controller';
import { EmployeeObjetiveService } from './service/employee_objective.service';
import { DefinitionObjectiveAnnual } from './entities/definition_objective_annual.entity';
import { EmployeeObjective } from './entities/objective.entity';
import { EmployeeObjectiveEvaluation } from './entities/objetive_evaluation.entity';
import { DncCourse } from './entities/dnc_course.entity';
import { DncCourseManual } from './entities/dnc_manual.entity';
import { CourseEvaluation } from './entities/course_evaluation.entity';
import { CourseEvaluationMannual } from './entities/course_evaluation_mannual.entity';
import { CompetenceEvaluation } from './entities/competence_evaluation.entity';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { PercentageDefinitionModule } from '../evaluation_annual/percentage_definition/percentage_definition.module';
import { CompetenceModule } from '../competence/competence.module';
import { EmployeesModule } from '../employees/employees.module';
import { CourseModule } from '../course/course.module';
import { MailModule } from '../mail/mail.module';
import { RequestCourseModule } from '../request_course/request_course.module';
import { SupplierModule } from '../supplier/supplier.module';

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
      CompetenceEvaluation,
    ]),
    OrganigramaModule,
    PercentageDefinitionModule,
    CompetenceModule,
    EmployeesModule,
    CourseModule,
    MailModule,
    RequestCourseModule,
    SupplierModule,
  ],
  controllers: [EmployeeObjetiveController, EmployeeObjetiveMedioAnoController],
  providers: [EmployeeObjetiveService],
  exports: [EmployeeObjetiveService],
})
export class EmployeeObjectiveModule {}
