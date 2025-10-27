import { PartialType } from '@nestjs/mapped-types';


export class CreateProductionAreaDto {
  name: string;
  age: number;
}

export class UpdateProductionAreaDto extends PartialType(CreateProductionAreaDto) { }
