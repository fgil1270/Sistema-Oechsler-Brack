import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { Training } from './training.entity';

@ApiTags('file_training')
@Entity()
export class FileTraining {
    @ApiProperty({ description: 'Unique identifier for the file training' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre del archivo de entrenamiento' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({ description: 'Ruta del archivo de entrenamiento' })
    @Column({ type: 'varchar', length: 255 })
    route: string;

    @ApiProperty({ description: 'Fecha de creación del archivo de entrenamiento' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización del archivo de entrenamiento' })
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty({ description: 'Fecha de eliminación del archivo de entrenamiento' })
    @DeleteDateColumn()
    deleted_at: Date;

}