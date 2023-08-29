import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeIncidenceService } from './service/employee_incidence.service';
import { EmployeeIncidenceController } from './controller/employee_incidence.controller';
import { EmployeeIncidence } from './entities/employee_incidence.entity';
import { DateEmployeeIncidence } from './entities/date_employee_incidence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeIncidence,
      DateEmployeeIncidence
    ])
  ],
  controllers: [EmployeeIncidenceController],
  providers: [EmployeeIncidenceService],
  exports: [EmployeeIncidenceService]
})
export class EmployeeIncidenceModule {}
