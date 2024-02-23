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
import { TypeCompetence } from './type_competence.entity';
import { TypeElementCompetence } from './type_element_competence.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Course } from '../../course/entities/course.entity';

@Entity()
export class Competence {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => TypeCompetence, post => post.competence)
    @JoinColumn()
    typeCompetence: TypeCompetence;

    @ManyToOne(() => TypeElementCompetence, post => post.competence)
    @JoinColumn()
    typeElementCompetence: TypeElementCompetence;

    @ManyToMany(() => Job, (job) => job.competence)
    job: Job[];

    @OneToMany(() => Course, (course) => course.competence)
    course: Course[];

}
