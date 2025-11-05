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

import { ProductionArea } from '../../production_area/entities/production_area.entity';
import { CompetenceMachine } from './competence_machine.entity';
import { Training } from '../../training/entities/training.entity';
import { HistoryTraining } from '../../training/entities/history-training.entity';

@ApiTags('training_machine')
@Entity()
export class TrainingMachine {
    @ApiProperty({ description: 'Unique identifier for the training machine' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre de la máquina de entrenamiento' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({ description: 'Comentario sobre la máquina de entrenamiento' })
    @Column({ type: 'text' })
    comment: string;

    @ApiProperty({ description: 'Total de empleados en la máquina de entrenamiento' })
    @Column({ type: 'int' })
    total_employees: number;

    @ApiProperty({ description: 'Estado de la máquina de entrenamiento' })
    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ApiProperty({ description: 'Fecha de creación de la máquina de entrenamiento' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización de la máquina de entrenamiento' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Fecha de eliminación de la máquina de entrenamiento' })
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ProductionArea, (productionArea) => productionArea.trainingMachines)
    @JoinColumn({ name: 'production_area_id' })
    productionArea: ProductionArea;

    @OneToMany(() => CompetenceMachine, (competenceMachine) => competenceMachine.trainingMachine)
    competenceMachines: CompetenceMachine[];

    @OneToMany(() => Training, (training) => training.trainingMachine)
    training: Training[];

    @OneToMany(() => HistoryTraining, (historyTraining) => historyTraining.trainingMachine)
    historyTraining: HistoryTraining[];
}