import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeIncidenceService } from './service/employee_incidence.service';
import { EmployeeIncidenceController } from './controller/employee_incidence.controller';
import { EmployeeIncidence } from './entities/employee_incidence.entity';
import { DateEmployeeIncidence } from './entities/date_employee_incidence.entity';
import { IncidenceCatologueModule } from '../incidence_catologue/incidence_catologue.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeShiftModule } from '../employee_shift/employee_shift.module';
import { EmployeeProfilesModule } from '../employee-profiles/employee-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeIncidence,
      DateEmployeeIncidence
    ]),
    IncidenceCatologueModule,
    EmployeesModule,
    EmployeeShiftModule,
    EmployeeProfilesModule
  ],
  controllers: [EmployeeIncidenceController],
  providers: [EmployeeIncidenceService],
  exports: [EmployeeIncidenceService]
})
export class EmployeeIncidenceModule {}
