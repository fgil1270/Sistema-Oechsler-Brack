import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule} from "@nestjs/config";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from "./enviroments";
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
import config from "./config";

@Module({
  imports: [
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
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_oechsler',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
