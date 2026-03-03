import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { JobDescription } from './job_description.entity';

@Entity()
export class JobDegree {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    degree: string;

    @Column({ type: 'varchar', length: 255 })
    dominio: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => JobDescription, (jobDescription) => jobDescription.jobDegree)
    @JoinColumn()
    jobDescription: JobDescription;

}
