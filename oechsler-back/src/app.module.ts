import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { MailModule } from './mail/mail.module';
import { WebsocketModule } from './websockets/websocket.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { ChecadorModule } from './checador/checador.module';
import { CompetenceModule } from './competence/competence.module';
import config from './config';
import { CourseModule } from './course/course.module';
import { CourseEfficiencyModule } from './course_efficiency/course_efficiency.module';
import { DatabaseModule } from './database/database.module';
import { DepartmentsModule } from './departments/departments.module';
import { DocumentModule } from './document/document.module';
import { DocumentClasificationModule } from './document_clasification/document_clasification.module';
import { DocumentEmployeeModule } from './document_employee/document_employee.module';
import { EmployeeProfilesModule } from './employee-profiles/employee-profiles.module';
import { EmployeeIncidenceModule } from './employee_incidence/employee_incidence.module';
import { CronSendEmailPendingIncidenceService } from './employee_incidence/service/cron_send_email_pending_incidence.service';
import { EmployeeObjectiveModule } from './employee_objective/employee_objective.module';
import { EmployeeShiftModule } from './employee_shift/employee_shift.module';
import { EmployeesModule } from './employees/employees.module';
import { EnabledCreateIncidenceModule } from './enabled_create_incidence/enabled_create_incidence.module';
import { enviroments } from './enviroments';
import { PercentageDefinitionModule } from './evaluation_annual/percentage_definition/percentage_definition.module';
import { GeneralModule } from './general/general.module';
import { IncidenceCatologueModule } from './incidence_catologue/incidence_catologue.module';
import { JobDocumentModule } from './job_document/job_document.module';
import { JobsModule } from './jobs/jobs.module';
import { LogAdjustmentVacationModule } from './log_adjustment_vacation/log_adjustment_vacation.module';
import { CustomLoggerService } from './logger/logger.service';
import { OrganigramaModule } from './organigrama/organigrama.module';
import { PatternModule } from './pattern/pattern.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { ProductionAreaModule } from './production_area/production_area.module';
import { RequestCourseModule } from './request_course/request_course.module';
import { CronRequestCourseService } from './request_course/service/cron_request_course.service';
import { RolesModule } from './roles/roles.module';
import { ShiftModule } from './shift/shift.module';
import { SupplierModule } from './supplier/supplier.module';
import { TimeCorrectionModule } from './time_correction/time_correction.module';
import { TrainingModule } from './training/training.module';
import { TrainingMachineModule } from './training_machine/training_machine.module';
import { UsersModule } from './users/users.module';
import { VacationsProfileModule } from './vacations-profile/vacations-profile.module';
import { ViewsModule } from './views/views.module';
import { ProductionMachineModule } from './production_machine/production_machine.module';


@Module({
  imports: [
    JobDocumentModule,
    WebsocketModule,
    MailModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: process.env.MYSQL_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    DatabaseModule,
    RolesModule,
    ViewsModule,
    DepartmentsModule,
    JobsModule,
    PayrollsModule,
    VacationsProfileModule,
    EmployeeProfilesModule,
    EmployeesModule,
    OrganigramaModule,
    ShiftModule,
    PatternModule,
    EmployeeShiftModule,
    IncidenceCatologueModule,
    EmployeeIncidenceModule,
    ChecadorModule,
    TimeCorrectionModule,
    LogAdjustmentVacationModule,
    CalendarModule,
    CompetenceModule,
    PercentageDefinitionModule,
    EmployeeObjectiveModule,
    CourseModule,
    DocumentModule,
    DocumentEmployeeModule,
    DocumentClasificationModule,
    RequestCourseModule,
    SupplierModule,
    EnabledCreateIncidenceModule,
    CourseEfficiencyModule,
    GeneralModule,
    ProductionAreaModule,
    TrainingMachineModule,
    TrainingModule,
    ProductionMachineModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    CronSendEmailPendingIncidenceService,
    CustomLoggerService,
    CronRequestCourseService
  ],
})
export class AppModule { }
