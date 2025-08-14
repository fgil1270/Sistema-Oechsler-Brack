import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del curso',
    example: 'Curso de programacion',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descripcion del curso',
    example: 'Curso de programacion basica',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Estado del curso', example: 'Activo' })
  status: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'Requiere eficiencia', example: 'true' })
  req_efficiency: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id de la competencia', example: 1 })
  competences: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id del objetivo de entrenamiento', example: 1 })
  traininGoal: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'Requiere documento Constancia', example: 'true' })
  req_constancy: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'Requiere Examen', example: 'true' })
  req_quiz: boolean;
}

export class UpdateCourseDto extends PartialType(CourseDto) { }
