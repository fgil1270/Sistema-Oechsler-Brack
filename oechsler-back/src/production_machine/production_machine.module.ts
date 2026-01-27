import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductionMachine } from '../production_machine/entities/production_machine.entity';
import { ProductionMachineService } from './service/production_machine.service';
import { ProductionMachineController, ProductionMachineEmployeeController } from './controller/production_machine.controller';
import { ProductionMachineEmployee } from './entities/production_machine_employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { ProductionMachineEmployeeService } from './service/production_machine_employee.service';
import { EmployeeShiftModule } from '../employee_shift/employee_shift.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionMachine, ProductionMachineEmployee]),
    EmployeesModule,
    EmployeeShiftModule,
  ],
  controllers: [ProductionMachineController, ProductionMachineEmployeeController],
  providers: [ProductionMachineService, ProductionMachineEmployeeService],
  exports: [ProductionMachineService, ProductionMachineEmployeeService],
})
export class ProductionMachineModule { }
