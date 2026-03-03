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
export class JobAbsenceDelegate {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => JobDescription, (jobDescription) => jobDescription.jobAbsenceDelegate)
    @JoinColumn()
    jobDescription: JobDescription;

    @ManyToOne(() => Job, (job) => job.jobAbsenceDelegate)
    @JoinColumn()
    job: Job;
}