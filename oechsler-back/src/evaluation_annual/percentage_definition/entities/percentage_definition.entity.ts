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
import { EmployeeObjective } from '../../../employee_objective/entities/employee_objective.entity';

@Entity()
export class PercentageDefinition {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    value_objetive: number;

    @Column({ type: 'int' })
    value_performance: number;

    @Column({ type: 'int' })
    value_competence: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => EmployeeObjective, post => post.percentageDefinition)
    employeeObjective: EmployeeObjective[];
}