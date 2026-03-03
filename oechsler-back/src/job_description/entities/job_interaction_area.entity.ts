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
import { Employee } from 'src/employees/entities/employee.entity';

@Entity()
export class JobInteractionArea {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => JobDescription, (jobDescription) => jobDescription.jobInteractionArea)
    @JoinColumn()
    jobDescription: JobDescription;

}