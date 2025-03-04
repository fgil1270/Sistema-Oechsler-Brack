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
import { CourseEfficiency } from './course_efficiency.entity';

@Entity()
export class CourseEfficiencyQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', default: null })
    question: string;

    @Column({ type: 'varchar', length: 255, default: null })
    calification: string;

    @Column({ type: 'boolean', default: false })
    is_number: boolean;

    @Column({ type: 'text', default: null })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => CourseEfficiency, (post) => post.courseEfficiencyQuestion)
    @JoinColumn()
    courseEfficiency: CourseEfficiency;
}