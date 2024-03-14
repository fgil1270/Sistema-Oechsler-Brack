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
import { EmployeeObjectiveEvaluation } from './objetive_evaluation.entity';

@Entity()
export class EmployeeObjective {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    area: string;

    @Column({ type: 'varchar', length: 255 })
    goal: string;

    @Column({ type: 'varchar', length: 255 })
    calculation: string;

    @Column({ type: 'int' })
    percentage: number;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'varchar' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => DefinitionObjectiveAnnual, post => post.objective)
    @JoinColumn()
    definitionObjectiveAnnual: DefinitionObjectiveAnnual;

    @OneToMany(() => EmployeeObjectiveEvaluation, post => post.objective)
    objectiveEvaluation: EmployeeObjectiveEvaluation[];


    
}