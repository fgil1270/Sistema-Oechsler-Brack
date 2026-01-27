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
import { ProductionMachineEmployeeService } from '../service/production_machine_employee.service';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Máquinas de producción')
@Controller('production-machine')
export class ProductionMachineController {
  constructor(private readonly productionMachineService: ProductionMachineService) { }
  @ApiOperation({ summary: 'Crear máquina de producción' })
  @Post()
  create(@Body() createProductionMachineDto: CreateProductionMachineDto) {
    return this.productionMachineService.create(createProductionMachineDto);
  }

  @ApiOperation({ summary: 'Listar máquinas de producción' })
  @Get()
  findAll() {
    return this.productionMachineService.findAll();
  }

  @ApiOperation({ summary: 'Listar máquinas de producción con empleados' })
  @Get('employees')
  findAllWithEmployees() {
    return this.productionMachineService.findAllWithEmployees();
  }

  @ApiOperation({ summary: 'Listar máquina de producción por ID' })
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

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Relacion Máquina de Producción - Empleado')
@Controller('production-machine-employee')
export class ProductionMachineEmployeeController {
  constructor(
    private readonly productionMachineEmployeeService: ProductionMachineEmployeeService,
  ) { }

  //asignacion maquina de produccion - empleado
  @ApiOperation({ summary: 'Crear asignación máquina de producción - empleado' })
  @Post()
  create(@Body() createProductionMachineEmployeeDto: any) {
    return this.productionMachineEmployeeService.create(
      createProductionMachineEmployeeDto,
    );
  }

}
