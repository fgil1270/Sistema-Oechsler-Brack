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
import { Competence } from '../../competence/entities/competence.entity';

@Entity()
export class CompetenceEvaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    type: string;

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

    @ManyToOne(() => DefinitionObjectiveAnnual, post => post.competenceEvaluation)
    @JoinColumn()
    definitionObjectiveAnnual: DefinitionObjectiveAnnual;

    @ManyToOne(() => Competence, post => post.competenceEvaluation)
    @JoinColumn()
    competence: Competence;

    
}