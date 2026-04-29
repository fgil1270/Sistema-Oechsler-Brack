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

import { ProccessEvaluationQuestion } from './proccess-evaluation-question.entity';
import { ProccessEvaluationQuizResponse } from './proccess-evaluation-quiz-response.entity';

@Entity()
export class ProccessEvaluationResponse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    response: string;

    @Column({ type: 'boolean', default: false })
    isCorrect: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ProccessEvaluationQuestion, (proccessEvaluationQuestion) => proccessEvaluationQuestion.response)
    @JoinColumn()
    proccessEvaluationQuestion: ProccessEvaluationQuestion;

    @OneToMany(() => ProccessEvaluationQuizResponse, (proccessEvaluationQuizResponse) => proccessEvaluationQuizResponse.proccessEvaluationResponse)
    evaluationQuizResponse: ProccessEvaluationQuizResponse[];
}