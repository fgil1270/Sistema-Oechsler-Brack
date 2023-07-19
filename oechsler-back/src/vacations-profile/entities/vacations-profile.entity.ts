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
export class VacationsProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255})
    cv_code: string;

    @Column({ unique: true, type: 'varchar', length: 255})
    cv_description: string;

    @Column({ type: 'boolean' , default: false})
    special: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
    premium_percentage: number;

    @Column({ type: 'int', default: 0})
    day: number;

    @Column({ type: 'int', default: 0})
    total: number;

    @OneToMany(() => Employee, post => post.vacationProfile)
    employee: Employee[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}
