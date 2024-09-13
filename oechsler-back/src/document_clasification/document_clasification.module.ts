import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentClasification } from './entities/document_clasification.entity';
import { DocumentClasificationController } from './controller/document_clasification.controller';
import { DocumentClasificationService } from './service/document_clasification.service';
import { DocumentModule } from '../document/document.module';
import { DocumentEmployeeModule } from '../document_employee/document_employee.module';
import { EmployeesModule } from '../employees/employees.module';
import { JobsModule } from '../jobs/jobs.module';
import { JobDocumentModule } from '../job_document/job_document.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentClasification]),
    forwardRef(() => DocumentModule),
    DocumentEmployeeModule,
    EmployeesModule,
    JobsModule,
    JobDocumentModule,
  ],
  providers: [DocumentClasificationService],
  controllers: [DocumentClasificationController],
  exports: [DocumentClasificationService],
})
export class DocumentClasificationModule {}
