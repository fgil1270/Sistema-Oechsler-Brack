import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { EmployeeIncidence } from '../../employee_incidence/entities/employee_incidence.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class IncidenceCatologue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 20 })
    code: string;

    @Column({ type: 'varchar', length: 255 })
    code_band: string;

    @Column({ type: 'boolean', default: false })
    approval_double: boolean;

    @Column({ type: 'boolean', default: false })
    require_description: boolean;

    @Column({ type: 'boolean', default: false })
    require_range_hrs: boolean;

    @Column({ type: 'boolean', default: false })
    unique_day: boolean;

    @Column({ type: 'boolean', default: false })
    total_vacation: boolean;

    @Column({ type: 'boolean', default: false })
    half_day: boolean;

    @Column({ type: 'boolean', default: false })
    automatic_approval: boolean;

    @Column({ type: 'boolean', default: false })
    total_hours: boolean;

    @Column({ type: 'boolean', default: false })
    repor_nomina: boolean;

    @Column({ type: 'boolean', default: false })
    require_shift: boolean;

    @Column({ type: 'varchar', length: 255, default: null })
    color: string;
    
    @Column({ type: 'boolean', default: false })
    require_date_range: boolean;

    @CreateDateColumn()
    creatted_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => EmployeeIncidence, (post) => post.incidenceCatologue)
    employeeIncidence: EmployeeIncidence[];

    @ManyToMany(() => Role, (role) => role.IncidencesCatologue)
    @JoinTable({
        joinColumn: {
            name: 'incidenceCatologueId'
        },
        inverseJoinColumn: {
            name: 'roleId'
        }
    })
    roles: Role[];
}
