import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Employee } from '../../employees/entities/employee.entity';

@Entity('calendar')
export class Calendar {
  @ApiProperty({ description: 'ID del evento' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del evento' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Fecha del evento' })
  @Column({ type: 'date', nullable: true })
  date: Date;

  @ApiProperty({ description: 'Etiqueta del evento' })
  @Column({ type: 'varchar', length: 15 })
  label: string;

  @ApiProperty({ description: 'Es festivo' })
  @Column({ type: 'boolean', default: false })
  holiday: boolean;

  @ApiProperty({ description: 'Descripción del evento' })
  @Column({ type: 'text', default: null })
  description: string;

  @ApiProperty({ description: 'Es sugerido para apartar' })
  @Column({ type: 'boolean', default: false })
  suggest: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Fecha de eliminación' })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({ description: 'Empleado que creó el evento' })
  @ManyToOne(() => Employee, (post) => post.calendar)
  @JoinColumn()
  created_by: Employee;


}
