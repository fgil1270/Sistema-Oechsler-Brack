/*
https://docs.nestjs.com/modules
*/
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobDocumentService } from './service/job-document.service';
import { JobDocumentController } from './controller/job-document.controller';
import { JobDocument } from './entities/job-document.entity';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobDocument]),
        JobsModule,
    ],
    controllers: [JobDocumentController],
    providers: [JobDocumentService],
    exports: [JobDocumentService],
})
export class JobDocumentModule { }
