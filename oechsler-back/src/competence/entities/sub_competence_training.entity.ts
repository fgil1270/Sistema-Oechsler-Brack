import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany,
} from 'typeorm';

import { Competence } from './competence.entity';

@Entity()
export class SubCompetenceTraining {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Competence, (competence) => competence.subCompetenceTrainings)
    @JoinColumn({ name: 'competence_id' })
    competence: Competence;
}