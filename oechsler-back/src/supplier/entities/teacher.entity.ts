import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { RequestCourseAssignment } from '../../request_course/entities/request_course_assignment.entity';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    paternal_surname: string;

    @Column({ type: 'varchar', length: 255 })
    maternal_surname: string;

    @Column({ type: 'varchar', length: 255, default: null})
    type: string;

    @Column({ type: 'varchar', length: 255, default: null})
    gender: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Supplier, (post) => post.teacher)
    @JoinColumn()
    supplier: Supplier;

    @OneToMany(() => RequestCourseAssignment, (post) => post.teacher)
    requestCourseAssignment: RequestCourseAssignment[];
}