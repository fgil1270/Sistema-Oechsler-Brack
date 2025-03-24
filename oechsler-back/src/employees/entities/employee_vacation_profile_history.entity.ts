import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { VacationsProfile } from '../../vacations-profile/entities/vacations-profile.entity';


@Entity()
export class EmployeeVacationProfileHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Employee, (post) => post.employeeVacationProfileHistory)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => VacationsProfile, (post) => post.employeeVacationProfileHistory)
    @JoinColumn()
    vacationProfile: VacationsProfile;

}
