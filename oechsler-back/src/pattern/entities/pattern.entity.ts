import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Shift } from '../../shift/entities/shift.entity';
import * as Joi from 'joi';

@Entity()
export class Pattern {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'boolean', default: false})
    empalme: boolean;

    @Column({ type: 'int', default: 0})
    periodicity: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    deleted_at: Date;

    @ManyToMany(() => Shift, shift => shift.patterns)
    @JoinTable({
        joinColumn: {
            name: 'patternId'
        },
        inverseJoinColumn: {
            name: 'shiftId'
        }
    })
    shifts: Shift[];
}
