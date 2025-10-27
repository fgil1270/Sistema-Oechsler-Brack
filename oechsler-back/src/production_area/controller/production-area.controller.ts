import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductionAreaDto, UpdateProductionAreaDto } from '../dto/create-production-area.dto';
import { ProductionAreaService } from '../service/production-area.service';

@Controller('production-areas')
export class ProductionAreaController {
  constructor(private readonly productionAreaService: ProductionAreaService) { }

  @Post()
  create(@Body() createProductionAreaDto: CreateProductionAreaDto) {
    return this.productionAreaService.create(createProductionAreaDto);
  }

  @Get()
  findAll() {
    return this.productionAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionAreaDto: UpdateProductionAreaDto) {
    return this.productionAreaService.update(+id, updateProductionAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionAreaService.remove(+id);
  }
}
