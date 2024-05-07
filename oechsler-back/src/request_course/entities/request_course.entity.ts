import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    ManyToMany,
    ManyToOne,
    JoinTable,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn, 
    DeleteDateColumn,
    OneToMany
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Department } from '../../departments/entities/department.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Competence } from '../../competence/entities/competence.entity';
import { RequestCourseAssignment } from './request_course_assignment.entity';

@Entity()
export class RequestCourse {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'varchar', length: 255})
    course_name: string;

    @Column({ type: 'varchar', length: 255 })
    training_reason: string;

    @Column({ type: 'varchar', length: 255 })
    priority: string;

    @Column({ type: 'varchar', length: 255, default: null })
    efficiency_period: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost: number;

    @Column({ type: 'set', enum: ['MXN', 'USD', 'EUR'], default: 'MXN'})
    currency: string;

    @Column({ type: 'varchar', length: 255, default: null })
    type: string;

    @Column({ type:'timestamp', default: null})
    tentative_date_start: Date;

    @Column({ type:'timestamp', default: null})
    tentative_date_end: Date;

    @Column({ type:'timestamp', default: null})
    approved_at_leader: Date;

    @Column({ type:'timestamp', default: null})
    canceled_at_leader: Date;

    @Column({ type:'timestamp', default: null})
    approved_at_rh: Date;

    @Column({ type:'timestamp', default: null})
    canceled_at_rh: Date;

    @Column({ type:'timestamp', default: null})
    approved_at_gm: Date;

    @Column({ type:'timestamp', default: null})
    canceled_at_gm: Date;

    @Column({ type: 'varchar', length: 255, default: null})
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Course, post => post.requestCourse)
    @JoinColumn()
    course: Course;

    @ManyToOne(() => Department, post => post.requestDepartment)
    @JoinColumn()
    department: Department;

    @ManyToOne(() => Employee, post => post.requestEmployee)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Competence, post => post.requestCompetence)
    @JoinColumn()
    competence: Competence;

    @ManyToOne(() => Employee, post => post.requestEmployeeLeader)
    @JoinTable()
    leader: Employee;

    @ManyToOne(() => Employee, post => post.requestEmployeeRh)
    @JoinTable()
    rh: Employee;

    @ManyToOne(() => Employee, post => post.requestEmployeeGm)
    @JoinTable()
    gm: Employee;

    @OneToMany(() => RequestCourseAssignment, post => post.requestCourse)
    requestCourseAssignment: RequestCourseAssignment[];

    @Column({ type: 'varchar', length: 255, default: null })
    origin: string;

    @ManyToOne(() => Employee, post => post.requestEmployeeBy)
    @JoinTable()
    requestBy: Employee;

}
