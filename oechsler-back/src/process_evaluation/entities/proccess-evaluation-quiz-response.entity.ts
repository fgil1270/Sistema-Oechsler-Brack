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

import { ProccessEvaluationQuiz } from './proccess-evaluation-quiz.entity';
import { ProccessEvaluationQuestion } from './proccess-evaluation-question.entity';
import { ProccessEvaluationResponse } from './proccess-evaluation-response.entity';

@Entity()
export class ProccessEvaluationQuizResponse {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProccessEvaluationQuiz, (proccessEvaluationQuiz) => proccessEvaluationQuiz.evaluationQuizResponse)
    @JoinColumn()
    proccessEvaluationQuiz: ProccessEvaluationQuiz;

    @ManyToOne(() => ProccessEvaluationQuestion, (proccessEvaluationQuestion) => proccessEvaluationQuestion.evaluationQuizResponse)
    @JoinColumn()
    proccessEvaluationQuestion: ProccessEvaluationQuestion;

    @ManyToOne(() => ProccessEvaluationResponse, (proccessEvaluationResponse) => proccessEvaluationResponse.evaluationQuizResponse)
    @JoinColumn()
    proccessEvaluationResponse: ProccessEvaluationResponse;
}