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
import { DefinitionObjectiveAnnual } from './definition_objective_annual.entity';

@Entity()
export class ObjectiveQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    question: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', nullable: true })
    value: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => DefinitionObjectiveAnnual, (post) => post.objectiveQuestion)
    @JoinColumn()
    definitionObjectiveAnnual: DefinitionObjectiveAnnual;
}