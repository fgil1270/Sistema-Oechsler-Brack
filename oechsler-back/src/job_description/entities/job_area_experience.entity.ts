import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { JobDescription } from './job_description.entity';

@Entity()
export class JobAreaExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    area: string;

    @Column({ type: 'decimal', precision: 10, scale: 1 })
    experience: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => JobDescription, (jobDescription) => jobDescription.jobAreaExperience)
    @JoinColumn()
    jobDescription: JobDescription;
}