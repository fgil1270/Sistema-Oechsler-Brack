import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { JobDocument } from '../../job_document/entities/job-document.entity';
import { EmployeeJobHistory } from '../../employees/entities/employee_job_history.entity';
import { JobDescription } from '../../job_description/entities/job_description.entity';
import { JobReportHim } from '../../job_description/entities/job_report_him.entity';
import { JobHelp } from '../../job_description/entities/job_help.entity';
import { JobAbsenceDelegate } from '../../job_description/entities/job_absence_delegate.entity';
import { JobCompetence } from './job_competence.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  cv_code: string;

  @Column({ type: 'varchar', length: 255 })
  cv_name: string;

  @Column({ type: 'boolean', default: false })
  shift_leader: boolean;

  @Column({ type: 'boolean', default: false })
  plc: boolean;

  @OneToMany(() => Employee, (post) => post.job)
  employee: Employee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => JobCompetence, (jobCompetence) => jobCompetence.job)
  jobCompetences: JobCompetence[];

  @OneToMany(() => JobDocument, (post) => post.job)
  jobDocument: JobDocument[];

  @Column({ type: 'boolean', default: false })
  produccion_visible: boolean;

  @OneToMany(() => EmployeeJobHistory, (post) => post.job)
  employeeJobHistory: EmployeeJobHistory[];

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'int', nullable: true })
  jobDescriptionId: number;

  @OneToOne(() => JobDescription, (jobDescription) => jobDescription.job, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'jobDescriptionId' })
  jobDescription: JobDescription;

  @OneToMany(() => JobReportHim, (jobReportHim) => jobReportHim.job)
  jobReportHim: JobReportHim[];

  @OneToMany(() => JobHelp, (jobHelp) => jobHelp.job)
  jobHelp: JobHelp[];

  @OneToMany(() => JobAbsenceDelegate, (jobAbsenceDelegate) => jobAbsenceDelegate.job)
  jobAbsenceDelegate: JobAbsenceDelegate[];

  @OneToMany(() => JobDescription, (jobDescription) => jobDescription.jobLeader)
  jobDescriptionLeader: JobDescription[];
}
