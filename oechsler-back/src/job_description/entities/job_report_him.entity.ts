import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { JobDescription } from './job_description.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class JobReportHim {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Job, (job) => job.jobReportHim)
    @JoinColumn()
    job: Job;

    @ManyToOne(() => JobDescription, (jobDescription) => jobDescription.jobReportHim)
    @JoinColumn()
    jobDescription: JobDescription;
}