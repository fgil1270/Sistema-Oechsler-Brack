import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeesService } from '../employees/service/employees.service';
import { EmployeesController, VacationsReportController } from '../employees/controller/employees.controller';
import { Employee } from '../employees/entities/employee.entity';
import { JobsModule } from '../jobs/jobs.module';
import { DepartmentsModule } from '../departments/departments.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { VacationsProfileModule } from '../vacations-profile/vacations-profile.module';
import { EmployeeProfilesModule } from '../employee-profiles/employee-profiles.module';
import { UsersModule } from '../users/users.module';
import { OrganigramaModule } from '../organigrama/organigrama.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee
    ]),
    JobsModule,
    DepartmentsModule,
    PayrollsModule,
    VacationsProfileModule,
    EmployeeProfilesModule,
    forwardRef(() => UsersModule),
    OrganigramaModule
    
  ],
  controllers: [EmployeesController, VacationsReportController],
  providers: [EmployeesService],
  exports: [EmployeesService]
})
export class EmployeesModule {}
