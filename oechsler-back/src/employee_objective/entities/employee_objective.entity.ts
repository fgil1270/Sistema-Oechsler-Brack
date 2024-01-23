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
import { Employee } from '../../employees/entities/employee.entity';
import { EmployeeObjectiveEvaluation } from './employee_objetive_evaluation.entity';
import { PercentageDefinition } from '../../evaluation_annual/percentage_definition/entities/percentage_definition.entity';

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

    @ManyToOne(() => Employee, post => post.employeeObjective)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => PercentageDefinition, post => post.employeeObjective)
    @JoinColumn()
    percentageDefinition: EmployeeObjective;

    @ManyToOne(() => Employee, post => post.employeeObjectiveEvaluated)
    @JoinColumn()
    evaluatedBy: Employee;

    @OneToMany(() => EmployeeObjectiveEvaluation, post => post.employeeObjective)
    employeeObjectiveEvaluation: EmployeeObjectiveEvaluation[];
    
}