import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecadorController } from './controller/checador.controller';
import { Checador } from './entities/checador.entity';
import { ChecadorService } from './service/checador.service';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeShiftModule } from '../employee_shift/employee_shift.module';
import { EmployeeIncidenceModule } from '../employee_incidence/employee_incidence.module';
import { IncidenceCatologueModule } from '..//incidence_catologue/incidence_catologue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Checador
    ]),
    EmployeesModule,
    EmployeeShiftModule,
    EmployeeIncidenceModule,
    IncidenceCatologueModule
  ],
  providers: [ChecadorService],
  controllers: [ChecadorController],
  exports: [ChecadorService]
})
export class ChecadorModule { }
