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

    @Column({ type: 'text', nullable: true })
    comment: string;

    @ManyToOne(() => Employee, post => post.employeeChecadasCreateBy)
    @JoinColumn()
    createdBy: Employee;
    
    @Column({ type: 'varchar', nullable: true })
    status: string;
}

