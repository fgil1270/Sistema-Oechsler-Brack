import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { DncCourseManual } from './dnc_manual.entity';

@Entity()
export class CourseEvaluationMannual {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    value_half_year: Number;

    @Column({ type: 'text' })
    comment_half_year: string;

    @Column({ type: 'int' })
    value_end_year: Number;

    @Column({ type: 'text' })
    comment_end_year: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => DncCourseManual, post => post.courseEvaluationMannual)
    @JoinColumn()
    dncCourseManual: DncCourseManual;

    
}