import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany
} from 'typeorm';
import { Competence } from '../../competence/entities/competence.entity';
import { DncCourse } from '../../employee_objective/entities/dnc_course.entity';
import { TraininGoal } from './trainin_goal.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';


@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @Column({ type: 'boolean', default: false})
    req_efficiency: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Competence, post => post.course)
    @JoinColumn()
    competence: Competence;

    @OneToMany(() => DncCourse, post => post.course)
    dncCourse: DncCourse[];

    @ManyToOne(() => TraininGoal, post => post.course)
    @JoinColumn()
    traininGoal: TraininGoal;

    @OneToMany(() => RequestCourse, (post) => post.course)
    requestCourse: RequestCourse[];


    
}