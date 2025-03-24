import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesService } from '../employees/service/employees.service';
import {
  EmployeesController,
  VacationsReportController,
} from '../employees/controller/employees.controller';
import { Employee } from '../employees/entities/employee.entity';
import { JobsModule } from '../jobs/jobs.module';
import { DepartmentsModule } from '../departments/departments.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { VacationsProfileModule } from '../vacations-profile/vacations-profile.module';
import { EmployeeProfilesModule } from '../employee-profiles/employee-profiles.module';
import { UsersModule } from '../users/users.module';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { CalendarModule } from '../calendar/calendar.module';
import { EmployeeJobHistory } from './entities/employee_job_history.entity';
import { EmployeeDepartmentHistory } from './entities/employee_department_history.entity';
import { EmployeePayrollHistory } from './entities/employee_payroll_history.entity';
import { EmployeeVacationProfileHistory } from './entities/employee_vacation_profile_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeJobHistory,
      EmployeeDepartmentHistory,
      EmployeePayrollHistory,
      EmployeeVacationProfileHistory
    ]),
    JobsModule,
    DepartmentsModule,
    PayrollsModule,
    VacationsProfileModule,
    EmployeeProfilesModule,
    forwardRef(() => UsersModule),
    OrganigramaModule,
    forwardRef(() => CalendarModule),
  ],
  controllers: [EmployeesController, VacationsReportController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
