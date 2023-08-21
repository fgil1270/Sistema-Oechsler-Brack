import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { IncidenceCatologue } from '../../incidence_catologue/entities/incidence_catologue.entity';

@Entity()
export class EmployeeIncidence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', default: null })
    descripcion: string;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date' })
    end_date: Date;

    @Column({ type: 'int', default: 0 })
    total_hour: number;

    @Column({ type: 'time', default: null })
    start_hour: string;

    @Column({ type: 'time', default: null })
    end_hour: Date;

    @Column({ type: 'date'})
    date_aproved_leader: Date;

    @Column({ type: 'date'})
    date_aproved_rh: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, post => post.employeeIncidence)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => IncidenceCatologue, post => post.employeeIncidence)
    @JoinColumn()
    incidenceCatologue: IncidenceCatologue;

    @ManyToOne(() => Employee, post => post.employeeIncidence)
    @JoinColumn()
    leader: Employee;

    @ManyToOne(() => Employee, post => post.employeeIncidence)
    @JoinColumn()
    rh: Employee;
}
