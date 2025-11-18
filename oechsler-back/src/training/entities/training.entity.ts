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

import { TrainingMachine } from '../../training_machine/entities/training_machine.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { FileTraining } from './file-training.entity';
import { HistoryTraining } from './history-training.entity';

@ApiTags('training')
@Entity()
export class Training {
    @ApiProperty({ description: 'Unique identifier for the training' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Start date of the training' })
    @Column({ type: 'datetime' })
    start_date: Date;

    @ApiProperty({ description: 'End date of the training' })
    @Column({ type: 'datetime' })
    end_date: Date;

    @ApiProperty({ description: 'Status of the training' })
    @Column({ type: 'varchar', length: 255 })
    status: string;

    @ApiProperty({ description: 'Fecha de creación del entrenamiento' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización del entrenamiento' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Fecha de eliminación del entrenamiento' })
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => TrainingMachine, (trainingMachine) => trainingMachine.training)
    @JoinColumn({ name: 'training_machine_id' })
    trainingMachine: TrainingMachine;

    @ManyToOne(() => Employee, (employee) => employee.training)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @OneToMany(() => FileTraining, (fileTraining) => fileTraining.training)
    fileTraining: FileTraining[];

    @OneToMany(() => HistoryTraining, (historyTraining) => historyTraining.training)
    historyTraining: HistoryTraining[];

    @ManyToOne(() => Employee, (employee) => employee.trainer)
    @JoinColumn({ name: 'trainer_id' })
    employeeTrainer: Employee;
}