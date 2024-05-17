import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentController } from './controller/document.controller';
import { DocumentService } from './service/document.service';
import { Document } from './entities/document.entity';
import { DocumentClasificationModule } from '../document_clasification/document_clasification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    forwardRef(() => DocumentClasificationModule),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
