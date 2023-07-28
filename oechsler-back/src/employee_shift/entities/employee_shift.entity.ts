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
import { Shift } from '../../shift/entities/shift.entity';
import { Pattern } from '../../pattern/entities/pattern.entity';

@Entity()
export class EmployeeShift {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date'})
    start_date: Date;

    @Column({ type: 'date'})
    end_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, post => post.employeeShift)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Shift, post => post.employeeShift)
    @JoinColumn()
    shift: Shift;

    @ManyToOne(() => Pattern, post => post.employeeShift)
    @JoinColumn()
    pattern: Pattern;
}
