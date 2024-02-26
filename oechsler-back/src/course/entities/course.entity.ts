import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany
} from 'typeorm';
import { Competence } from '../../competence/entities/competence.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @Column({ type: 'boolean', default: false})
    req_efficiency: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Competence, post => post.course)
    @JoinColumn()
    competence: Competence;
}