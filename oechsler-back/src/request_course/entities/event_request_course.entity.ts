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
    OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RequestCourse } from './request_course.entity';

@Entity()
export class EventRequestCourse {
    @ApiProperty({ description: 'UUID del evento de solicitud de curso' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Fecha de creación del evento de solicitud de curso' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización del evento de solicitud de curso' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Fecha de eliminación del evento de solicitud de curso' })
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => RequestCourse, (requestCourse) => requestCourse.eventRequestCourse)
    requestCourse: RequestCourse;

}