import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    cv_code: string;

    @Column({ type: 'varchar', length: 255})
    cv_name: string;

    @Column({ type: 'boolean', default: false})
    shift_leader: boolean;

    @Column({ type: 'boolean', default: false})
    plc: boolean;

    @OneToMany(() => Employee, post => post.job)
    employee: Employee[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
