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

import { Training } from './training.entity';
import { TrainingMachine } from '../../training_machine/entities/training_machine.entity';
import { Employee } from '../../employees/entities/employee.entity';

@ApiTags('history_training')
@Entity()
export class HistoryTraining {
    @ApiProperty({ description: 'Unique identifier for the history training' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Start date of the training' })
    @Column({ type: 'datetime' })
    start_date: Date;

    @ApiProperty({ description: 'End date of the training' })
    @Column({ type: 'datetime' })
    end_date: Date;

    @ApiProperty({ description: 'Creation date of the history training' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Update date of the history training' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Deletion date of the history training' })
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Training, (training) => training.historyTraining)
    @JoinColumn({ name: 'training_id' })
    training: Training;

    @ManyToOne(() => TrainingMachine, (trainingMachine) => trainingMachine.historyTraining)
    @JoinColumn({ name: 'training_machine_id' })
    trainingMachine: TrainingMachine;

    @ManyToOne(() => Employee, (employee) => employee.historyTraining)
    @JoinColumn({ name: 'trainer_id' })
    employeeTrainer: Employee;
}