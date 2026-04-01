import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';
import { Competence } from '../../competence/entities/competence.entity';

@Entity('job_competence')
export class JobCompetence {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Job, (job) => job.jobCompetences, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobId' })
    job: Job;

    @Column()
    jobId: number;

    @ManyToOne(() => Competence, (competence) => competence.jobCompetences, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'competenceId' })
    competence: Competence;

    @Column()
    competenceId: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    domain: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
