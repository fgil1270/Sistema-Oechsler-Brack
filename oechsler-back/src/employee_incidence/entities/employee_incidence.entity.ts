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
  OneToOne,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { IncidenceCatologue } from '../../incidence_catologue/entities/incidence_catologue.entity';
import { DateEmployeeIncidence } from './date_employee_incidence.entity';
import { EventIncidence } from './event_incidence.entity';

@Entity()
export class EmployeeIncidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', default: null })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_hour: number;

  @Column({ type: 'time', default: null })
  start_hour: string;

  @Column({ type: 'time', default: null })
  end_hour: Date;

  @Column({ type: 'date', nullable: true })
  date_aproved_leader: Date;

  @Column({ type: 'date', nullable: true })
  date_aproved_rh: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'date', nullable: true })
  date_canceled: Date;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Employee, (post) => post.employeeIncidence)
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => IncidenceCatologue, (post) => post.employeeIncidence)
  @JoinColumn()
  incidenceCatologue: IncidenceCatologue;

  @ManyToOne(() => Employee, (post) => post.employeeIncidenceLeader)
  @JoinColumn()
  leader: Employee;

  @ManyToOne(() => Employee, (post) => post.employeeIncidenceRh)
  @JoinColumn()
  rh: Employee;

  @OneToMany(() => DateEmployeeIncidence, (post) => post.employeeIncidence)
  dateEmployeeIncidence: DateEmployeeIncidence[];

  @ManyToOne(() => Employee, (post) => post.employeeIncidenceCancel)
  @JoinColumn()
  canceledBy: Employee;

  @ManyToOne(() => Employee, (post) => post.employeeIncidenceCreate)
  @JoinColumn()
  createdBy: Employee;

  @Column({ type: 'int', nullable: true })
  shift: Number;

  @Column({ type: 'text', nullable: true })
  commentCancel: string;

  @Column({ type: 'boolean', default: false })
  approveRHComment: boolean;

  @Column({ type: 'time', nullable: true })
  hour_approved_leader: Date;

  @Column({ type: 'text', nullable: true })
  employee_image: string;

  @OneToOne(() => EventIncidence)
  @JoinColumn()
  eventIncidence: EventIncidence;
}
