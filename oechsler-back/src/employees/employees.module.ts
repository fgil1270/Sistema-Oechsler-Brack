import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeesService } from '../employees/service/employees.service';
import { EmployeesController } from '../employees/controller/employees.controller';
import { Employee } from '../employees/entities/employee.entity';
import { Job } from '../jobs/entities/job.entity';
import { Payroll } from '../payrolls/entities/payroll.entity';
import { Department } from '../departments/entities/department.entity';
import { VacationsProfile } from '../vacations-profile/entities/vacations-profile.entity';
import { EmployeeProfile } from '../employee-profiles/entities/employee-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Job,
      Payroll,
      Department,
      VacationsProfile,
      EmployeeProfile
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService]
})
export class EmployeesModule {}
