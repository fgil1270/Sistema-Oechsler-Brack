import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

import { Job } from '../../jobs/entities/job.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { JobActivity } from './job_activities.entity';
import { JobReportHim } from './job_report_him.entity';
import { JobHelp } from './job_help.entity';
import { JobAbsenceDelegate } from './job_absence_delegate.entity';
import { JobInteractionArea } from './job_interaction_area.entity';
import { JobDegree } from './job_degree.entity';
import { JobAreaExperience } from './job_area_experience.entity';

@Entity()
export class JobDescription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    area: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    type_job: string;

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => Job, (job) => job.jobDescription)
    job: Job;

    @ManyToOne(() => Employee, (employee) => employee.jobDescriptionAuthorizeLeader)
    @JoinColumn()
    authorizeLeader: Employee;

    @Column({ type: 'datetime', nullable: true })
    lead_authorized_at: Date;

    @ManyToOne(() => Employee, (employee) => employee.jobDescriptionAuthorizeManager)
    @JoinColumn()
    authorizeManager: Employee;

    @Column({ type: 'datetime', nullable: true })
    manager_authorized_at: Date;

    @ManyToOne(() => Employee, (employee) => employee.jobDescriptionAuthorizeRh)
    @JoinColumn()
    authorizeRh: Employee;

    @Column({ type: 'datetime', nullable: true })
    rh_authorized_at: Date;

    @OneToMany(() => JobActivity, (jobActivity) => jobActivity.jobDescription)
    activities: JobActivity[];

    @OneToMany(() => JobReportHim, (jobReportHim) => jobReportHim.jobDescription)
    jobReportHim: JobReportHim[];

    @OneToMany(() => JobHelp, (jobHelp) => jobHelp.jobDescription)
    jobHelp: JobHelp[];

    @OneToMany(() => JobAbsenceDelegate, (jobAbsenceDelegate) => jobAbsenceDelegate.jobDescription)
    jobAbsenceDelegate: JobAbsenceDelegate[];

    @OneToMany(() => JobInteractionArea, (jobInteractionArea) => jobInteractionArea.jobDescription)
    jobInteractionArea: JobInteractionArea[];

    @OneToMany(() => JobDegree, (jobDegree) => jobDegree.jobDescription)
    jobDegree: JobDegree[];

    @OneToMany(() => JobAreaExperience, (jobAreaExperience) => jobAreaExperience.jobDescription)
    jobAreaExperience: JobAreaExperience[];

    @ManyToOne(() => Job, (job) => job.jobDescriptionLeader)
    @JoinColumn()
    jobLeader: Job;
}