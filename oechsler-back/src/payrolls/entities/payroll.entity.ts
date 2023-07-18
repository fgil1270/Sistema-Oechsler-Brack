import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
@Entity()
export class Payroll {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255})
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
