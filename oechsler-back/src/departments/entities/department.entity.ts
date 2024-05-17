import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { TrainingBudget } from './training-budget.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  cv_code: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  cv_description: string;

  @OneToMany(() => TrainingBudget, (post) => post.departmentId)
  training_budgetId: TrainingBudget[];

  @Column({ type: 'int', default: 0 })
  cc: number;

  @OneToMany(() => Employee, (post) => post.department)
  employee: Employee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => RequestCourse, (post) => post.department)
  requestDepartment: RequestCourse[];
}
