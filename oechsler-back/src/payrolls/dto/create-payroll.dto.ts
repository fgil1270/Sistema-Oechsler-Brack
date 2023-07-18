import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePayrollDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Tipo de nómina' })
    name: string;
}

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {}
