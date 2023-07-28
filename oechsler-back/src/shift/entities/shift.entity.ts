import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
} from 'typeorm';

@Entity()
export class Shift {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: 'varchar', length: 255})
    code:string;

    @Column({ type: 'varchar', length: 255})
    name:string;

    @Column({ type: 'time', default: '00:00:00'})
    start_time: Date;

    @Column({ type: 'time', default: '00:00:00'})
    end_time: Date;

    @Column({ type: 'set', enum: ['L', 'M', 'X', 'J', 'V', 'S', 'D']})
    day: string;

    @Column({ type: 'varchar', length: 255})
    color: string;

    @Column({ type: 'boolean', default: false})
    special: boolean;

    @Column({ type: 'boolean', default: false})
    created_at: Date;

    @Column({ type: 'boolean', default: false})
    updated_at: Date;

    @Column({ type: 'boolean', default: false})
    deleted_at: Date;
}
