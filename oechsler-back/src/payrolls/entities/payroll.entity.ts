import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { EnabledCreateIncidence } from 'src/enabled_create_incidence/entities/enabled-create-incidence.entity';
import { EmployeePayrollHistory } from '../../employees/entities/employee_payroll_history.entity';

@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Employee, (post) => post.payRoll)
  employee: Employee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => EnabledCreateIncidence, (post) => post.payroll)
  enabledCreateIncidence: EnabledCreateIncidence[];

  @OneToMany(() => EmployeePayrollHistory, (post) => post.payroll)
  employeePayrollHistory: EmployeePayrollHistory[];
}
