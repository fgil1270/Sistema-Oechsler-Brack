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
import { Payroll } from '../../payrolls/entities/payroll.entity';

@Entity()
export class EmployeePayrollHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (post) => post.employeePayrollHistory)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Payroll, (post) => post.employeePayrollHistory)
    @JoinColumn()
    payroll: Payroll;

}
