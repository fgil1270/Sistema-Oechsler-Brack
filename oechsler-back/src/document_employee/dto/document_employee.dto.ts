import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDocumentEmployeeDto {
}

export class UpdateDocumentEmployeeDto extends PartialType(CreateDocumentEmployeeDto) {
}