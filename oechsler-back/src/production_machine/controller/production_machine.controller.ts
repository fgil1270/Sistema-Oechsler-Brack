import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateProductionMachineDto } from '../dto/create_production_machine.dto';
import { ProductionMachineService } from '../service/production_machine.service';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@Controller('production-machines')
export class ProductionMachineController {
  constructor(private readonly productionMachineService: ProductionMachineService) { }

  @Post()
  create(@Body() createProductionMachineDto: CreateProductionMachineDto) {
    return this.productionMachineService.create(createProductionMachineDto);
  }

  @Get()
  findAll() {
    return this.productionMachineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionMachineService.findOne(id);
  }

  /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionMachineDto: UpdateProductionMachineDto) {
    return this.productionMachineService.update(+id, updateProductionMachineDto);
  } */

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionMachineService.remove(id);
  }
}
