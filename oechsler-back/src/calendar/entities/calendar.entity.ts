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
import { Employee } from '../../employees/entities/employee.entity';


@Entity('Calendar')
export class Calendar {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'date', nullable: true })
    date: Date;

    @Column({ type: 'varchar', length: 15 })
    label: string;

    @Column({ type: 'boolean', default: false })
    holiday: boolean;

    @Column({ type: 'text', default: null })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, post => post.calendar)
    @JoinColumn()
    created_by: Employee;

}
