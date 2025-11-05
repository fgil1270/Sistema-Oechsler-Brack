import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { TrainingMachine } from '../../training_machine/entities/training_machine.entity';

@ApiTags('production_area')
@Entity()
export class ProductionArea {
  @ApiProperty({ description: 'Unique identifier for the production area' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del área de producción' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Comentario sobre el área de producción' })
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty({ description: 'Fecha de creación del área de producción' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de actualización del área de producción' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Fecha de eliminación del área de producción' })
  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => TrainingMachine, (trainingMachine) => trainingMachine.productionArea)
  trainingMachines: TrainingMachine[];
}