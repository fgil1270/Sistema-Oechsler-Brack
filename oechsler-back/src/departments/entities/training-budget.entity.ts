import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Department } from './department.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('training-budget')
@Entity()
export class TrainingBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Monto del presupuesto de entrenamiento',
    type: 'decimal',
    example: 1000.00,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ApiProperty({
    description: 'Año del presupuesto',
    type: 'year',
    example: 2023,
  })
  @Column({ type: 'year' })
  year: number;

  @ApiProperty({
    description: 'Departamento asociado al presupuesto de entrenamiento',
    type: () => Department,
  })
  @ManyToOne(() => Department, (department) => department.training_budgetId)
  departmentId: Department;

  @ApiProperty({
    description: 'Fecha de creación del presupuesto',
    type: 'date',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de actualización del presupuesto',
    type: 'date',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({
    description: 'Fecha de eliminación del presupuesto',
    type: 'date',
  })
  @DeleteDateColumn()
  deleted_at: Date;
}
