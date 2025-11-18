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
  OneToMany,
} from 'typeorm';
import { TypeCompetence } from './type_competence.entity';
import { TypeElementCompetence } from './type_element_competence.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Course } from '../../course/entities/course.entity';
import { DncCourseManual } from '../../employee_objective/entities/dnc_manual.entity';
import { CompetenceEvaluation } from '../../employee_objective/entities/competence_evaluation.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';
import { CompetenceMachine } from '../../training_machine/entities/competence_machine.entity';

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

  @ManyToOne(() => TypeCompetence, (post) => post.competence)
  @JoinColumn()
  typeCompetence: TypeCompetence;

  @ManyToOne(() => TypeElementCompetence, (post) => post.competence)
  @JoinColumn()
  typeElementCompetence: TypeElementCompetence;

  @ManyToMany(() => Job, (job) => job.competence)
  job: Job[];

  @OneToMany(() => Course, (course) => course.competence)
  course: Course[];

  @OneToMany(() => DncCourseManual, (post) => post.competence)
  dncCourseManual: DncCourseManual[];

  @OneToMany(() => CompetenceEvaluation, (post) => post.competence)
  competenceEvaluation: CompetenceEvaluation[];

  @OneToMany(() => RequestCourse, (post) => post.competence)
  requestCompetence: RequestCourse[];

  @OneToMany(() => CompetenceMachine, (competenceMachine) => competenceMachine.competence)
  competenceMachines: CompetenceMachine[];

  @Column({ type: 'boolean', default: false })
  is_production: boolean;
}
