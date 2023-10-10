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

@Entity('Checador')
export class Checador {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'timestamp'})
    date: Date;

    @ManyToOne(() => Employee, post => post.employeeChecadas)
    @JoinColumn()
    employee: Employee;

    @Column({ type: 'int' })
    numRegistroChecador: number;

}

