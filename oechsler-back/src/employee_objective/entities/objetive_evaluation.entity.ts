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
import { EmployeeObjective } from './objective.entity';

@Entity()
export class EmployeeObjectiveEvaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    value_half_year: number;

    @Column({ type: 'text' })
    comment_half_year: string;

    @Column({ type: 'int' })
    value_end_year: number;

    @Column({ type: 'text' })
    comment_end_year: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => EmployeeObjective, post => post.objectiveEvaluation)
    @JoinColumn()
    objective: EmployeeObjective;

}