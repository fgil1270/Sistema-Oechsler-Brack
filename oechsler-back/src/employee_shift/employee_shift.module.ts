import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeShiftService } from './service/employee_shift.service';
import { EmployeeShiftController } from './controller/employee_shift.controller';
import { EmployeeShift } from './entities/employee_shift.entity';
import { EmployeesModule } from '../employees/employees.module';
import { ShiftModule } from '../shift/shift.module';
import { PatternModule } from '../pattern/pattern.module';
import { OrganigramaModule } from '../organigrama/organigrama.module';
import { RolesModule } from '../roles/roles.module';
import { DepartmentsModule } from '../departments/departments.module';
import { Department } from '../departments/entities/department.entity';
import { de } from 'date-fns/locale';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeShift,
      Department
    ]),
    EmployeesModule,
    ShiftModule,
    PatternModule,
    OrganigramaModule,
    RolesModule,
    DepartmentsModule
  ],
  controllers: [EmployeeShiftController],
  providers: [EmployeeShiftService],
  exports: [EmployeeShiftService]
})
export class EmployeeShiftModule {}
