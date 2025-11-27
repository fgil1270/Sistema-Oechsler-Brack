import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { RequestCourse } from './request_course.entity';
import { Teacher } from '../../supplier/entities/teacher.entity';
import { EventRequestCourse } from './event_request_course.entity';

@Entity()
export class RequestCourseAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: null })
  date_start: Date;

  @Column({ type: 'timestamp', default: null })
  date_end: Date;

  @Column({ type: 'set', enum: ['L', 'M', 'X', 'J', 'V', 'S', 'D'] })
  day: string;

  @Column({ type: 'text', default: null })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToMany(() => RequestCourse, (requestCourse) => requestCourse.requestCourseAssignment)
  @JoinTable({
    joinColumn: {
      name: 'requestCourseAssignmentId',
    },
    inverseJoinColumn: {
      name: 'requestCourseId',
    },
  })
  requestCourse: RequestCourse[];

  @ManyToOne(() => Teacher, (post) => post.requestCourseAssignment)
  @JoinColumn()
  teacher: Teacher;

  @OneToOne(() => EventRequestCourse, (eventRequestCourse) => eventRequestCourse.requestCourseAssignment)
  @JoinColumn()
  eventRequestCourse: EventRequestCourse;
}
