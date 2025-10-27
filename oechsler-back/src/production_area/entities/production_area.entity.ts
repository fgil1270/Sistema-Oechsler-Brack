import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('production_area')
@Entity()
export class ProductionArea {
  @ApiProperty({ description: 'Unique identifier for the production area' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del área de producción' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Comentario sobre el área de producción' })
  @Column()
  comment: string;

  @ApiProperty({ description: 'Fecha de creación del área de producción' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización del área de producción' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación del área de producción' })
  @DeleteDateColumn()
  deletedAt: Date;
}