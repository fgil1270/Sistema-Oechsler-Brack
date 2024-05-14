import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmployeeIncidence } from './employee_incidence.entity';

@Entity()
export class DateEmployeeIncidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => EmployeeIncidence, (post) => post.dateEmployeeIncidence)
  @JoinColumn()
  employeeIncidence: EmployeeIncidence;
}
