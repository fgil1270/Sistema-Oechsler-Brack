import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';


export class CreateTrainingMachineDto {
  @ApiProperty({ description: 'Nombre de la máquina de entrenamiento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Comentario sobre la máquina de entrenamiento' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ description: 'Total de empleados en la máquina de entrenamiento' })
  @IsNumber()
  @IsNotEmpty()
  total_employees: number;

  @ApiProperty({ description: 'Estado de la máquina de entrenamiento' })
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}

export class UpdateTrainingMachineDto extends PartialType(CreateTrainingMachineDto) { }
