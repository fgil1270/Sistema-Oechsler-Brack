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

import { Employee } from '../../employees/entities/employee.entity';
import { ProccessEvaluationQuestion } from './proccess-evaluation-question.entity';
import { ProccessEvaluationQuiz } from './proccess-evaluation-quiz.entity';

@Entity()
export class ProccessEvaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'int', default: 0 })
    review: number;

    @Column({ type: 'date' })
    limit_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (employee) => employee.proccessEvaluation)
    @JoinColumn()
    createdBy: Employee;

    @OneToMany(() => ProccessEvaluationQuestion, (proccessEvaluationQuestion) => proccessEvaluationQuestion.proccessEvaluation)
    question: ProccessEvaluationQuestion[];

    @OneToMany(() => ProccessEvaluationQuiz, (proccessEvaluationQuiz) => proccessEvaluationQuiz.proccessEvaluation)
    questionQuiz: ProccessEvaluationQuiz[];

}