import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCourseEfficiencyDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id de la solicitud de curso' })
    requestCourseId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del empleado' })
    employeeId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Id del leader' })
    leaderId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha de la evaluación' })
    evaluationDate: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Comentario' })
    comment: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Comentario dos' })
    commentTwo: string;

    @IsArray()
    @ApiProperty({ description: 'Array de las preguntas para evaluar' })
    courseEfficiencyQuestion: any[];
}

export class UpdateCourseEfficiencyDto extends PartialType(CreateCourseEfficiencyDto) {
  
}