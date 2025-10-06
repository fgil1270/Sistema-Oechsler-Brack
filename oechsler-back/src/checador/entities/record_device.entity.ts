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
import { ApiProperty } from '@nestjs/swagger';

import { Checador } from './checador.entity';

@Entity()
export class RecordDevice {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre del dispositivo' })
    @Column({ type: 'timestamp' })
    device_name: string;

    @ApiProperty({ description: 'Descripción del dispositivo' })
    @Column({ type: 'varchar', nullable: true })
    description: string;

    @ApiProperty({ description: 'Número de serie del dispositivo' })
    @Column({ type: 'varchar', nullable: true })
    dev_serial_no: string;

    @ApiProperty({ description: 'Nombre del recurso' })
    @Column({ type: 'varchar', nullable: true })
    resource_name: string;

    @ApiProperty({ description: 'Origen de la checada (Comedor)' })
    @Column({ type: 'varchar', nullable: true })
    origin: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Checador, (checador) => checador.recordDevice)
    checadore: Checador[];

}
