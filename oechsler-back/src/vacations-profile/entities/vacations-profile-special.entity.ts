import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { VacationsProfile } from './vacations-profile.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class VacationsProfileSpecial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default: 0})
    day: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => VacationsProfile, post => post.vacationProfileSpecial)
    @JoinColumn()
    vacationProfile: VacationsProfile;

    @ManyToOne(() => Employee, post => post.vacationProfileSpecial)
    @JoinColumn()
    employee: Employee;




}