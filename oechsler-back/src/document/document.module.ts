import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentController } from './controller/document.controller';
import { DocumentService } from './service/document.service';
import { Document } from './entities/document.entity';


@Module({
  imports: [],
  providers: [
    DocumentService,],
  controllers: [
        DocumentController, ]
})
export class DocumentModule { }
