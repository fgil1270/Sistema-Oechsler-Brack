import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
} from "typeorm";
import { Department } from "../../departments/entities/department.entity";
import { VacationsProfile } from "../../vacations-profile/entities/vacations-profile.entity";
import { Payroll } from "../../payrolls/entities/payroll.entity";
import { EmployeeProfile } from "../../employee-profiles/entities/employee-profile.entity";
import { Job } from "../../jobs/entities/job.entity";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Payroll, post => post.employeeId)
    @JoinColumn()
    payRollId: Payroll;
    
    @ManyToOne(() => Department, post => post.employeeId)
    @JoinColumn()
    departmentId: Department;
    
    @ManyToOne(() => VacationsProfile, post => post.employeeId)
    @JoinColumn()
    vacationProfileId: VacationsProfile;
    
    @ManyToOne(() => EmployeeProfile, post => post.employeeId)
    @JoinColumn()
    employeeProfileId: EmployeeProfile;
    
    @ManyToOne(() => Job, post => post.employeeId)
    @JoinColumn()
    jobId: Job;

    @Column({ type: 'varchar', length: 255})
    worker: string;

    @Column({ type: 'int', default: 0})
    employee_number:number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'varchar', length: 255})
    paternal_surname: string;

    @Column({ type: 'varchar', length: 255})
    maternal_surname: string;

    @Column({ type: 'varchar', length: 255})
    gender: string;

    @Column({ type: 'date'})
    birthdate: Date;

    @Column({ type: 'varchar', length: 255})
    country: string;

    @Column({ type: 'varchar', length: 255})
    citizenship: string;

    @Column({ type: 'varchar', length: 255})
    state: string;

    @Column({ type: 'varchar', length: 255})
    city: string;

    @Column({ type: 'varchar', length: 255})
    location: string;

    @Column({ type: 'varchar', length: 255})
    rfc: string;

    @Column({ type: 'varchar', length: 255})
    curp: string;

    @Column({ type: 'varchar', length: 255})
    nss: string;

    @Column({ type: 'date'})
    date_employment: Date;

    @Column({ type: 'date'})
    work_term_date: Date;

    @Column({ type: 'varchar', length: 255})
    email: string;

    @Column({ type: 'varchar', length: 255})
    phone: string;

    @Column({ type: 'varchar', length: 255})
    marital_status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
    salary: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
    daily_salary: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
    quote: number;

    @Column({ type: 'varchar', length: 255})
    type_contract: string;

    @Column({ type: 'boolean', default: false})
    visa: boolean;

    @Column({ type: 'boolean', default: false})
    fm_two: boolean;

    @Column({ type: 'boolean', default: false})
    travel: boolean;

    @Column({ type: 'boolean', default: false})
    brigade_member: boolean;

    @Column({ type: 'boolean', default: false})
    worker_status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}
