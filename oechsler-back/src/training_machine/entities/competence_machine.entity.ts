import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { TrainingMachine } from './training_machine.entity';
import { Competence } from '../../competence/entities/competence.entity';

@ApiTags('competence_machine')
@Entity()
export class CompetenceMachine {
    @ApiProperty({ description: 'Unique identifier for the competence machine' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Estado de la máquina de competencia' })
    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => TrainingMachine, (trainingMachine) => trainingMachine.competenceMachines)
    @JoinColumn({ name: 'training_machine_id' })
    trainingMachine: TrainingMachine;

    @ManyToOne(() => Competence, (competence) => competence.competenceMachines)
    @JoinColumn({ name: 'competence_id' })
    competence: Competence;
}