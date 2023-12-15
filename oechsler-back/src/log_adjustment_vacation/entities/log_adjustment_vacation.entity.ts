import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";
import { Employee } from "../../employees/entities/employee.entity";


@Entity()
export class LogAdjustmentVacation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employee, post => post.logAdjustmentVacationEmployee)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Employee, post => post.logAdjustmentVacationLeader)
    @JoinColumn()
    leader: Employee;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    before_value: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    new_value: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}