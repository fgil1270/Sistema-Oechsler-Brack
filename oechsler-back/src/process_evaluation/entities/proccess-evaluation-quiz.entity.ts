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
import { Employee } from 'src/employees/entities/employee.entity';
import { ProccessEvaluationQuizResponse } from './proccess-evaluation-quiz-response.entity';

@Entity()
export class ProccessEvaluationQuiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @Column({ type: 'int', default: 0 })
    intentos: number;

    @Column({ type: 'date', nullable: true })
    evaluation_date: Date;

    @Column({ type: 'date', nullable: true })
    new_limit_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ProccessEvaluation, (proccessEvaluation) => proccessEvaluation.questionQuiz)
    @JoinColumn()
    proccessEvaluation: ProccessEvaluation;

    @ManyToOne(() => Employee, (employee) => employee.proccessEvaluationQuiz)
    @JoinColumn()
    employee: Employee;

    @OneToMany(() => ProccessEvaluationQuizResponse, (proccessEvaluationQuizResponse) => proccessEvaluationQuizResponse.proccessEvaluationQuiz)
    evaluationQuizResponse: ProccessEvaluationQuizResponse[];
}