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
import { Employee } from '../../employees/entities/employee.entity';
import { PercentageDefinition } from '../../evaluation_annual/percentage_definition/entities/percentage_definition.entity';
import { EmployeeObjective } from './objective.entity';
import { DncCourse } from './dnc_course.entity';
import { DncCourseManual } from './dnc_manual.entity';
import { CompetenceEvaluation } from './competence_evaluation.entity';
import { ObjectiveQuestion } from './objective_question.entity';

@Entity()
export class DefinitionObjectiveAnnual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Employee, (post) => post.definitionObjectiveAnnual)
  @JoinColumn()
  employee: Employee;

  @ManyToOne(
    () => PercentageDefinition,
    (post) => post.definitionObjectiveAnnual,
  )
  @JoinColumn()
  percentageDefinition: PercentageDefinition;

  @ManyToOne(
    () => Employee,
    (post) => post.definitionObjectiveAnnualEvaluatedBy,
  )
  @JoinColumn()
  evaluatedBy: Employee;

  @OneToMany(() => EmployeeObjective, (post) => post.definitionObjectiveAnnual)
  objective: EmployeeObjective[];

  @OneToMany(() => DncCourse, (post) => post.definitionObjectiveAnnual)
  dncCourse: DncCourse[];

  @OneToMany(() => DncCourseManual, (post) => post.definitionObjectiveAnnual)
  dncCourseManual: DncCourseManual[];

  @OneToMany(
    () => CompetenceEvaluation,
    (post) => post.definitionObjectiveAnnual,
  )
  competenceEvaluation: CompetenceEvaluation[];

  @Column({ type: 'text', nullable: true })
  comment_edit: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  half_year_employee_range: string;

  @Column({ type: 'int', nullable: true })
  half_year_employee_value: number;

  @Column({ type: 'text', nullable: true })
  half_year_employee_comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  end_year_employee_range: string;

  @Column({ type: 'int', nullable: true })
  end_year_employee_value: number;

  @Column({ type: 'text', nullable: true })
  end_year_employee_comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  half_year_leader_range: string;

  @Column({ type: 'int', nullable: true })
  half_year_leader_value: number;

  @Column({ type: 'text', nullable: true })
  half_year_leader_comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  end_year_leader_range: string;

  @Column({ type: 'int', nullable: true })
  end_year_leader_value: number;

  @Column({ type: 'text', nullable: true })
  end_year_leader_comment: string;

  @OneToMany(() => ObjectiveQuestion, (post) => post.definitionObjectiveAnnual)
  objectiveQuestion: ObjectiveQuestion[];

  @Column({ type: 'boolean', nullable: true })
  is_evaluated: boolean;

}
