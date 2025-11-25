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
import { EmployeeIncidence } from './employee_incidence.entity';

@Entity()
export class EventIncidence {
    @ApiProperty({ description: 'UUID del evento de incidencia' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Fecha de creación del evento de incidencia' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización del evento de incidencia' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Fecha de eliminación del evento de incidencia' })
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => EmployeeIncidence, (employeeIncidence) => employeeIncidence.eventIncidence)
    employeeIncidence: EmployeeIncidence;

}