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
import { Department } from '../../departments/entities/department.entity';
import { VacationsProfile } from '../../vacations-profile/entities/vacations-profile.entity';
import { Payroll } from '../../payrolls/entities/payroll.entity';
import { EmployeeProfile } from '../../employee-profiles/entities/employee-profile.entity';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/entities/user.entity';
import { Organigrama } from '../../organigrama/entities/organigrama.entity';
import { EmployeeShift } from '../../employee_shift/entities/employee_shift.entity';
import { EmployeeIncidence } from '../../employee_incidence/entities/employee_incidence.entity';
import { Checador } from '../../checador/entities/checador.entity';
import { TimeCorrection } from '../../time_correction/entities/time_correction.entity';
import { LogAdjustmentVacation } from '../../log_adjustment_vacation/entities/log_adjustment_vacation.entity';
import { Calendar } from '../../calendar/entities/calendar.entity';
import { DefinitionObjectiveAnnual } from '../../employee_objective/entities/definition_objective_annual.entity';
import { DocumentEmployee } from 'src/document_employee/entities/document_employee.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';
import { EnabledCreateIncidence } from 'src/enabled_create_incidence/entities/enabled-create-incidence.entity';
import { CourseEfficiency } from '../../course_efficiency/entities/course_efficiency.entity';
import { EmployeeJobHistory } from './employee_job_history.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payroll, (post) => post.employee)
  @JoinColumn()
  payRoll: Payroll;

  @ManyToOne(() => Department, (post) => post.employee)
  @JoinColumn()
  department: Department;

  @ManyToOne(() => VacationsProfile, (post) => post.employee)
  @JoinColumn()
  vacationProfile: VacationsProfile;

  @ManyToOne(() => EmployeeProfile, (post) => post.employee)
  @JoinColumn()
  employeeProfile: EmployeeProfile;

  @ManyToOne(() => Job, (post) => post.employee)
  @JoinColumn()
  job: Job;

  @Column({ type: 'varchar', length: 255 })
  worker: string;

  @Column({ type: 'int', default: 0 })
  employee_number: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  paternal_surname: string;

  @Column({ type: 'varchar', length: 255 })
  maternal_surname: string;

  @Column({ type: 'varchar', length: 255 })
  gender: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  citizenship: string;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  rfc: string;

  @Column({ type: 'varchar', length: 255 })
  curp: string;

  @Column({ type: 'varchar', length: 255 })
  nss: string;

  @Column({ type: 'date' })
  date_employment: Date;

  @Column({ type: 'date', default: null })
  work_term_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  marital_status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  daily_salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quote: number;

  @Column({ type: 'varchar', length: 255 })
  type_contract: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  visa: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  fm_two: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  travel: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  brigade_member: boolean;

  @Column({ type: 'boolean', default: false })
  worker_status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => User, (post) => post.employee)
  userId: User[];

  @OneToMany(() => Organigrama, (post) => post.employee)
  organigramaL: Organigrama[];

  @OneToMany(() => Organigrama, (post) => post.employee)
  organigramaE: Organigrama[];

  @OneToMany(() => EmployeeShift, (post) => post.employee)
  employeeShift: EmployeeShift[];

  @OneToMany(() => EmployeeIncidence, (post) => post.employee)
  employeeIncidence: EmployeeIncidence[];

  @OneToMany(() => EmployeeIncidence, (post) => post.canceledBy)
  employeeIncidenceCancel: EmployeeIncidence[];

  @OneToMany(() => EmployeeIncidence, (post) => post.createdBy)
  employeeIncidenceCreate: EmployeeIncidence[];

  @OneToMany(() => Checador, (post) => post.employee)
  employeeChecadas: Checador[];

  @OneToMany(() => TimeCorrection, (post) => post.employee)
  timeCorrection: TimeCorrection[];

  @OneToMany(() => TimeCorrection, (post) => post.created_by)
  timeCorrectionCreateBy: TimeCorrection[];

  @OneToMany(() => Checador, (post) => post.createdBy)
  employeeChecadasCreateBy: Checador[];

  @OneToMany(() => LogAdjustmentVacation, (post) => post.employee)
  logAdjustmentVacationEmployee: LogAdjustmentVacation[];

  @OneToMany(() => LogAdjustmentVacation, (post) => post.leader)
  logAdjustmentVacationLeader: LogAdjustmentVacation[];

  @OneToMany(() => Calendar, (post) => post.created_by)
  calendar: Calendar[];

  @OneToMany(() => EmployeeIncidence, (post) => post.rh)
  employeeIncidenceRh: EmployeeIncidence[];

  @OneToMany(() => EmployeeIncidence, (post) => post.leader)
  employeeIncidenceLeader: EmployeeIncidence[];

  @OneToMany(() => DefinitionObjectiveAnnual, (post) => post.employee)
  definitionObjectiveAnnual: DefinitionObjectiveAnnual[];

  @OneToMany(() => DefinitionObjectiveAnnual, (post) => post.evaluatedBy)
  definitionObjectiveAnnualEvaluatedBy: DefinitionObjectiveAnnual[];

  @OneToMany(() => DocumentEmployee, (post) => post.employee)
  documentEmployee: DocumentEmployee[];

  @OneToMany(() => RequestCourse, (post) => post.employee)
  requestEmployee: RequestCourse[];

  @OneToMany(() => RequestCourse, (post) => post.leader)
  requestEmployeeLeader: RequestCourse[];

  @OneToMany(() => RequestCourse, (post) => post.rh)
  requestEmployeeRh: RequestCourse[];

  @OneToMany(() => RequestCourse, (post) => post.gm)
  requestEmployeeGm: RequestCourse[];

  @OneToMany(() => RequestCourse, (post) => post.requestBy)
  requestEmployeeBy: RequestCourse[];

  @OneToMany(() => EnabledCreateIncidence, (post) => post.employee)
  enabledCreateIncidence: EnabledCreateIncidence[];

  @OneToMany(() => CourseEfficiency, (post) => post.employee)
  employeeCourseEfficiency: CourseEfficiency[];

  @OneToMany(() => CourseEfficiency, (post) => post.evaluator)
  employeeCourseEfficiencyLeader: CourseEfficiency[];

  @OneToMany(() => EmployeeJobHistory, (post) => post.employee)
  employeeJobHistory: EmployeeJobHistory[];
}
