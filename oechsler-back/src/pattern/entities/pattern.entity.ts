import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from 'typeorm';
import { EmployeeShift } from '../../employee_shift/entities/employee_shift.entity';

@Entity()
export class Pattern {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'boolean', default: false})
    empalme: boolean;

    @Column({ type: 'int', default: 0})
    periodicity: number;

    @Column({ type: 'varchar', length: 255})
    serie_shifts: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => EmployeeShift, (post) => post.pattern)
    employeeShift: EmployeeShift[];

}
