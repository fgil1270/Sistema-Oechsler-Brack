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
import { PercentageDefinition } from '../../evaluation_annual/percentage_definition/entities/percentage_definition.entity';
import { EmployeeObjective } from './objective.entity';

@Entity()
export class DefinitionObjectiveAnnual {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, post => post.definitionObjectiveAnnual)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => PercentageDefinition, post => post.definitionObjectiveAnnual)
    @JoinColumn()
    percentageDefinition: PercentageDefinition;

    @ManyToOne(() => Employee, post => post.definitionObjectiveAnnualEvaluatedBy)
    @JoinColumn()
    evaluatedBy: Employee;

    @OneToMany(() => EmployeeObjective, post => post.definitionObjectiveAnnual)
    objective: EmployeeObjective[];

    
}