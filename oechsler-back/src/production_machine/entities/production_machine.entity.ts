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

import { ProductionMachineEmployee } from './production_machine_employee.entity';

@Entity()
export class ProductionMachine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'int', default: 1 })
    total_employees: number;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => ProductionMachineEmployee, (productionMachineEmployee) => productionMachineEmployee.productionMachine)
    productionMachineEmployees: ProductionMachineEmployee[];
}
