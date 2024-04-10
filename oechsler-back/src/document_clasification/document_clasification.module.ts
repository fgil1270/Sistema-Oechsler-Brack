import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentClasification } from './entities/document_clasification.entity';
import { DocumentClasificationController } from './controller/document_clasification.controller';
import { DocumentClasificationService } from './service/document_clasification.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentClasification])
  ],
  providers: [DocumentClasificationService],
  controllers: [DocumentClasificationController],
  exports: [DocumentClasificationService]
})
export class DocumentClasificationModule { }
