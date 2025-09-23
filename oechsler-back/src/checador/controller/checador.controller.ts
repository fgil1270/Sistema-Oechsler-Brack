/*
https://docs.nestjs.com/controllers#controllers
*/

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
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ChecadorService } from '../service/checador.service';
import { CreateChecadaDto, UpdateChecadaDto, FindChecadaDto } from '../dto/create-checada.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reloj Checador')
@Controller('checador')
export class ChecadorController {
  constructor(
    private readonly checadorService: ChecadorService
  ) { }

  @ApiOperation({ summary: 'Crear registro de entrada o salida del empleado' })
  @Post()
  create(@Body() createChecadaDto: CreateChecadaDto, @CurrentUser() user: any) {
    return this.checadorService.create(createChecadaDto, user);
  }

  @ApiOperation({ summary: 'buscar registros de entrada y salida por id de empleado y rango de fechas' })
  @Get()
  findbyDate(@Query() data: UpdateChecadaDto) {
    return this.checadorService.findbyDate(
      data.empleadoId,
      data.startDate,
      data.endDate,
      data.startTime,
      data.endTime,
    );
  }

  @ApiOperation({ summary: 'Acceso a la vista de Autorizar Checada' })
  @Views('autorizar_checada')
  @Get('access')
  accesViewAutorizedChecadas() {
    return true;
  }

  @ApiOperation({ summary: 'buscar registros de entrada y salida por array de ids de empleado y rango de fechas' })
  //@Views('autorizar_checada')
  @Post('byIds')
  findbyDateOrganigrama(@Body() data: FindChecadaDto, @CurrentUser() user: any) {
    return this.checadorService.findbyDateOrganigrama(data, user);
  }

  @ApiOperation({ summary: 'Acceso a la vista de Nomipaq' })
  @Views('nomipaq')
  @Get('nomipaq')
  findView() {
    return true;
  }

  @ApiOperation({
    summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq',
  })
  @Views('nomipaq')
  @Get('nomipaq/report')
  reportNomipaq(@Query() data: any, @CurrentUser() user: any) {
    return this.checadorService.reportNomipaq(data, user);
  }

  @ApiOperation({ summary: 'Actualizar Checada' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateChecadaDto,
  ) {
    return this.checadorService.update(data, id);
  }

  @ApiOperation({ summary: 'Eliminar registro de checada' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.checadorService.remove(id);
  }
}
