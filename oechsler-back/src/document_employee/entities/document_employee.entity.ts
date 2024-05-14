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
import { Document } from '../../document/entities/document.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class DocumentEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  route: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Document, (post) => post.documentEmployee)
  @JoinColumn()
  document: Document;

  @ManyToOne(() => Employee, (post) => post.documentEmployee)
  @JoinColumn()
  employee: Employee;
}
