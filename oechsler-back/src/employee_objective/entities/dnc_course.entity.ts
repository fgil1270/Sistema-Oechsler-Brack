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
import { DefinitionObjectiveAnnual } from './definition_objective_annual.entity';
import { Course } from '../../course/entities/course.entity';

@Entity()
export class DncCourse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    train: string;

    @Column({ type: 'varchar', length: 255 })
    priority: string;

    @Column({ type: 'text' })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => DefinitionObjectiveAnnual, post => post.dncCourse)
    @JoinColumn()
    definitionObjectiveAnnual: DefinitionObjectiveAnnual;

    @ManyToOne(() => Course, post => post.dncCourse)
    @JoinColumn()
    course: Course;

    
}