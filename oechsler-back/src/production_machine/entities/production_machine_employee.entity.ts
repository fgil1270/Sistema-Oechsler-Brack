import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { ProductionMachine } from './production_machine.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class ProductionMachineEmployee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ProductionMachine, (productionMachine) => productionMachine.productionMachineEmployees)
    @JoinColumn({ name: 'production_machine_id' })
    productionMachine: ProductionMachine;

    @ManyToOne(() => Employee, (employee) => employee.productionMachineEmployees)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;
}