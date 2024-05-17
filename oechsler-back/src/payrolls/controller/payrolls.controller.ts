import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PayrollsService } from '../service/payrolls.service';
import { CreatePayrollDto } from '../dto/create-payroll.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Nóminas')
@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @ApiOperation({ summary: 'Crear nómina' })
  @Post()
  create(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollsService.create(createPayrollDto);
  }

  @ApiOperation({ summary: 'Listar nóminas' })
  @Get()
  findAll() {
    return this.payrollsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar nómina' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar nómina' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePayrollDto: CreatePayrollDto,
  ) {
    return this.payrollsService.update(id, updatePayrollDto);
  }

  @ApiOperation({ summary: 'Eliminar nómina' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.remove(id);
  }
}
