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
    OneToMany,
    OneToOne,
} from 'typeorm';
import { RequestCourse } from './request_course.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class RequestCourseAssessmentEmployee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    value_uno: number;

    @Column({ type: 'int' })
    value_dos: number;

    @Column({ type: 'int' })
    value_tres: number;

    @Column({ type: 'text', default: null })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => RequestCourse, (requestCourse) => requestCourse.request_course_assessment_employee)
    @JoinColumn()
    request_course: RequestCourse;

    @ManyToOne(() => Employee, (employee) => employee.request_course_assessment_employee)
    @JoinColumn()
    employee: Employee;

}
