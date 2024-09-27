import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Payroll } from 'src/payrolls/entities/payroll.entity';

@Entity()
export class EnabledCreateIncidence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date'})
    date: Date;

    @Column({ type: 'boolean', nullable: true })
    enabled: boolean;

    @ManyToOne(() => Employee, (post) => post.enabledCreateIncidence)
    @JoinColumn()
    employee: Employee;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Payroll, (post) => post.enabledCreateIncidence)
    @JoinColumn()
    payroll: Payroll;

}