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
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';
import { CourseEfficiencyQuestion } from './course_efficiency_question.entity';

@Entity()
export class CourseEfficiency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp'})
    date_evaluation: Date;

    @Column({ type: 'text', default: null })
    comment: string;

    @Column({ type: 'text', default: null })
    comment_two: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (post) => post.employeeCourseEfficiency)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Employee, (post) => post.employeeCourseEfficiencyLeader)
    evaluator: Employee;

    @ManyToOne(() => RequestCourse, (post) => post.courseEfficiency)
    @JoinColumn()
    requestCourse: RequestCourse;

    @OneToMany(() => CourseEfficiencyQuestion, (post) => post.courseEfficiency)
    courseEfficiencyQuestion: CourseEfficiencyQuestion[];
}