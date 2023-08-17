import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm'

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
    home_office: boolean;

    @Column({ type: 'boolean', default: false })
    approval_double: boolean;

    @Column({ type: 'boolean', default: false })
    descriptiva: boolean;

    @Column({ type: 'boolean', default: false })
    operativa: boolean;

    @Column({ type: 'boolean', default: false })
    periodo: boolean;

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

    @CreateDateColumn()
    creatted_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
