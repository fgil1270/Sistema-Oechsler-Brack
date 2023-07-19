import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { Employee } from "../../employees/entities/employee.entity";

@Entity()
export class EmployeeProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: "varchar", length: 255 })
    code: string;

    @Column({ unique: true, type: "varchar", length: 255 })
    name: string;

    @Column({ type: "time", default: "00:00:00" })
    delay_time: number;

    @Column({ type: "int", default: 0 })
    work_week_hrs: number;

    @Column({ type: "int", default: 0 })
    work_shift_hrs: number;

    @Column({ type: "int", default: 0 })
    over_time_limit: number;

    @Column({ type: "set", enum: ["L", "M", "X", "J", "V", "S", "D"] })
    work_days: string;

    @Column({ type: "int", default: 0 })
    apply_extra_hrs: boolean;

    @OneToMany(() => Employee, (post) => post.employeeProfile)
    employee: Employee[];

    @CreateDateColumn()    
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
