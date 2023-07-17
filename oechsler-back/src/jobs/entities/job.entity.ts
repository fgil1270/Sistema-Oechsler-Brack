import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
