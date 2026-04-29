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
    OneToOne,
} from 'typeorm';

import { ProccessEvaluation } from './proccess-evaluation.entity';
import { ProccessEvaluationResponse } from './proccess-evaluation-response.entity';
import { ProccessEvaluationQuizResponse } from './proccess-evaluation-quiz-response.entity';

@Entity()
export class ProccessEvaluationQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    question: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ProccessEvaluation, (proccessEvaluation) => proccessEvaluation.question)
    @JoinColumn()
    proccessEvaluation: ProccessEvaluation;

    @OneToMany(() => ProccessEvaluationResponse, (proccessEvaluationResponse) => proccessEvaluationResponse.proccessEvaluationQuestion)
    response: ProccessEvaluationResponse[];

    @OneToMany(() => ProccessEvaluationQuizResponse, (proccessEvaluationQuizResponse) => proccessEvaluationQuizResponse.proccessEvaluationQuestion)
    evaluationQuizResponse: ProccessEvaluationQuizResponse[];
}