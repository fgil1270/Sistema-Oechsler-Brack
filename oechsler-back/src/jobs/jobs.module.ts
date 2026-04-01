import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './service/jobs.service';
import { JobsController } from './controller/jobs.controller';
import { Job } from './entities/job.entity';
import { JobCompetence } from './entities/job_competence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobCompetence])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule { }
