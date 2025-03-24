import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity()
export class EmployeeDepartmentHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (post) => post.employeeDepartmentHistory)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Department, (post) => post.employeeDepartmentHistory)
    @JoinColumn()
    department: Department;
}
