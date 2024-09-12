import { WebsocketModule } from './websockets/websocket.module';
import { MailModule } from './mail/mail.module';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import { RolesModule } from './roles/roles.module';
import { ViewsModule } from './views/views.module';
import { DepartmentsModule } from './departments/departments.module';
import { JobsModule } from './jobs/jobs.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { VacationsProfileModule } from './vacations-profile/vacations-profile.module';
import { EmployeeProfilesModule } from './employee-profiles/employee-profiles.module';
import { EmployeesModule } from './employees/employees.module';
import { OrganigramaModule } from './organigrama/organigrama.module';
import { ShiftModule } from './shift/shift.module';
import { PatternModule } from './pattern/pattern.module';
import { EmployeeShiftModule } from './employee_shift/employee_shift.module';
import { IncidenceCatologueModule } from './incidence_catologue/incidence_catologue.module';
import { EmployeeIncidenceModule } from './employee_incidence/employee_incidence.module';
import config from './config';
import { ChecadorModule } from './checador/checador.module';
import { TimeCorrectionModule } from './time_correction/time_correction.module';
import { LogAdjustmentVacationModule } from './log_adjustment_vacation/log_adjustment_vacation.module';
import { CalendarModule } from './calendar/calendar.module';
import { CompetenceModule } from './competence/competence.module';
import { PercentageDefinitionModule } from './evaluation_annual/percentage_definition/percentage_definition.module';
import { EmployeeObjectiveModule } from './employee_objective/employee_objective.module';
import { CourseModule } from './course/course.module';
import { DocumentModule } from './document/document.module';
import { DocumentClasificationModule } from './document_clasification/document_clasification.module';
import { DocumentEmployeeModule } from './document_employee/document_employee.module';
import { RequestCourseModule } from './request_course/request_course.module';
import { SupplierModule } from './supplier/supplier.module';
import { EnabledCreateIncidenceModule } from './enabled_create_incidence/enabled_create_incidence.module';


@Module({
  imports: [
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
    EnabledCreateIncidenceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
