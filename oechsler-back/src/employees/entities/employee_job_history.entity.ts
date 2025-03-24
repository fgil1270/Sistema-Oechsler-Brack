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
import { Job } from '../../jobs/entities/job.entity';


@Entity()
export class EmployeeJobHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (post) => post.employeeJobHistory)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Job, (post) => post.employeeJobHistory)
    @JoinColumn()
    job: Job;

}
