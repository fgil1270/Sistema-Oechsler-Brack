import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCalendarDto {
  @IsString()
  @ApiProperty({ description: 'Nombre del dia' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Fecha' })
  date: string;

  @IsString()
  @ApiProperty({ description: 'Etiqueta del dia' })
  label: string;

  @IsBoolean()
  @ApiProperty({ description: 'Es festivo' })
  holiday: boolean;

  @IsString()
  @ApiProperty({ description: 'Descripción' })
  description: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Es sugerido' })
  suggest: boolean;
}

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) { }
