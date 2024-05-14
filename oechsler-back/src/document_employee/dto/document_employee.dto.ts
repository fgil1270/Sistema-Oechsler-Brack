import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDocumentEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del documento' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del empleado' })
  employeeId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Id del documento' })
  documentId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'URL del documento' })
  route: string;
}

export class UpdateDocumentEmployeeDto extends PartialType(
  CreateDocumentEmployeeDto,
) {}
