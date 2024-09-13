/*
https://docs.nestjs.com/providers#services
*/
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { JobDocumentDto } from '../dto/create-job-document.dto';
import { JobDocument } from '../entities/job-document.entity';
import { JobsService } from 'src/jobs/service/jobs.service';
import e from 'express';
import { find } from 'rxjs';

@Injectable()
export class JobDocumentService { 
    constructor(
        @InjectRepository(JobDocument) private jobDocumentRepository: Repository<JobDocument>,
        private jobService: JobsService,
    ) {}
    
    async create(jobDocumentDto: JobDocumentDto) {
        const status = {
            code: 200,
            message: 'OK',
            error: false,
            data: {},
            status: 'success',
          };
        
        const job = await this.jobService.findOne(jobDocumentDto.jobId);

        
        const jobDocument = this.jobDocumentRepository.create(jobDocumentDto);
        jobDocument.job = job;

        await this.jobDocumentRepository.save(jobDocument);

        status.data = jobDocument;
        status.message = 'Documento de trabajo creado';
        

        return status;
    }
    
    async findAll() {
        const jobDocument = await this.jobDocumentRepository.find();
        return jobDocument;
    }


    async findById(id: number) {
        const jobDocument = await this.jobDocumentRepository.findOne({
            relations: {
                job: true,
            },
            where: {
                id: id,
            },
        });

        if (!jobDocument) {
            throw new NotFoundException('Documento de trabajo no encontrado');
        }

        return jobDocument;
    }

    async findByJobId(jobId: number) {
        const jobDocument = await this.jobDocumentRepository.find({
            where: {
                job: {
                    id: jobId,
                },
            },
        });

        if (!jobDocument) {
            throw new NotFoundException('Documento de trabajo no encontrado');
        }

        return jobDocument;
    }
}
