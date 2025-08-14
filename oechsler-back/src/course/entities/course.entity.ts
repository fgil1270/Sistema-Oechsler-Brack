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
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { Competence } from '../../competence/entities/competence.entity';
import { DncCourse } from '../../employee_objective/entities/dnc_course.entity';
import { TraininGoal } from './trainin_goal.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';
import { CourseFile } from './course_file.entity';

@ApiTags('Course')
@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del curso' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Descripción del curso' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Status del curso' })
  @Column({ type: 'varchar', length: 255 })
  status: string;

  @ApiProperty({ description: 'Requequiere evaluacion de eficiencia' })
  @Column({ type: 'boolean', default: false })
  req_efficiency: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Fecha de eliminación' })
  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({ description: 'Competencia asociada' })
  @ManyToOne(() => Competence, (post) => post.course)
  @JoinColumn()
  competence: Competence;

  @ApiProperty({ description: 'Cursos DNC asociados' })
  @OneToMany(() => DncCourse, (post) => post.course)
  dncCourse: DncCourse[];

  @ApiProperty({ description: 'Objetivo de capacitación asociado' })
  @ManyToOne(() => TraininGoal, (post) => post.course)
  @JoinColumn()
  traininGoal: TraininGoal;

  @ApiProperty({ description: 'Solicitudes de curso asociadas' })
  @OneToMany(() => RequestCourse, (post) => post.course)
  requestCourse: RequestCourse[];

  @ApiProperty({ description: 'Archivos del curso asociados' })
  @OneToMany(() => CourseFile, (post) => post.course)
  courseFile: CourseFile[];

  @ApiProperty({ description: 'Temario del curso' })
  @Column({ type: 'text', nullable: true })
  syllabus: string;

  @ApiProperty({ description: 'Requiere documento Constancia' })
  @Column({ type: 'boolean', default: false })
  req_constancy: boolean;

  @ApiProperty({ description: 'Requiere Examen' })
  @Column({ type: 'boolean', default: false })
  req_quiz: boolean;


}
