import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ResponseDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The response of the process evaluation' })
    response: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'Indicates if the response is true or false' })
    isTrue: boolean;
}

export class QuestionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The question of the process evaluation' })
    question: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: 'The responses of the question', type: [ResponseDto] })
    responses: ResponseDto[];
}

export class CreateProcessEvaluationDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The title of the process evaluation' })
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'The review score of the process evaluation' })
    review: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Fecha límite para completar la evaluación' })
    limit_date: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: 'The questions of the process evaluation', type: [QuestionDto] })
    questions: QuestionDto[];
}