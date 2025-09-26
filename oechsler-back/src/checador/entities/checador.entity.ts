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
import { ApiProperty } from '@nestjs/swagger';

import { Employee } from '../../employees/entities/employee.entity';

@Entity('Checador')
export class Checador {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha y hora de la checada' })
  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => Employee, (post) => post.employeeChecadas)
  @JoinColumn()
  employee: Employee;

  @ApiProperty({ description: 'Tipo de checada 0=manual, 1=Home Offfice, 3=checador' })
  @Column({ type: 'int' })
  numRegistroChecador: number;

  @ApiProperty({ description: 'Comentario adicional sobre la checada' })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Employee, (post) => post.employeeChecadasCreateBy)
  @JoinColumn()
  createdBy: Employee;

  @ApiProperty({ description: 'status de la checada (Autorizada, Pendiente)' })
  @Column({ type: 'varchar', nullable: true })
  status: string;

  @ApiProperty({ description: 'Origen de la checada (Comedor)' })
  @Column({ type: 'varchar', nullable: true })
  origin: string;
}
