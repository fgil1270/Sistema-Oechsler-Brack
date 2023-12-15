import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { VacationsProfile } from './vacations-profile.entity';

@Entity()
export class VacationsProfileDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default:0 })
    year: number;

    @Column({ type: 'int', default: 0})
    day: number;

    @Column({ type: 'int', default: 0})
    total: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => VacationsProfile, post => post.vacationProfileDetail)
    @JoinColumn()
    vacationProfile: VacationsProfile;

}