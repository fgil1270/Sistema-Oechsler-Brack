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
import { DefinitionObjectiveAnnual } from './definition_objective_annual.entity';
import { Competence } from '../../competence/entities/competence.entity';
import { CourseEvaluationMannual } from './course_evaluation_mannual.entity';

@Entity()
export class DncCourseManual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  goal: string;

  @Column({ type: 'varchar', length: 255 })
  train: string;

  @Column({ type: 'varchar', length: 255 })
  priority: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => DefinitionObjectiveAnnual, (post) => post.dncCourseManual)
  @JoinColumn()
  definitionObjectiveAnnual: DefinitionObjectiveAnnual;

  @OneToMany(() => CourseEvaluationMannual, (post) => post.dncCourseManual)
  courseEvaluationMannual: CourseEvaluationMannual[];

  @ManyToOne(() => Competence, (post) => post.dncCourseManual)
  @JoinColumn()
  competence: Competence;
}
