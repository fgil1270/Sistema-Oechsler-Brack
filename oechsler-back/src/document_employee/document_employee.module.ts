/*
https://docs.nestjs.com/modules
*/

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentEmployeeService } from './service/document_employee.service';
import { DocumentEmployeeController } from './controller/document_employee.controller';
import { DocumentEmployee } from './entities/document_employee.entity';
import { DocumentModule } from '../document/document.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEmployee]),
    forwardRef(() => DocumentModule),
    forwardRef(() => EmployeesModule),
  ],
  controllers: [DocumentEmployeeController],
  providers: [DocumentEmployeeService],
  exports: [DocumentEmployeeService],
})
export class DocumentEmployeeModule {}
