/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  Post,
  Body,
  Res,
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
import { Request, Response } from 'express';
import { createGzip } from 'zlib';

import { ChecadorService } from '../service/checador.service';
import { CreateChecadaDto, UpdateChecadaDto, FindChecadaDto, NomipaqDto } from '../dto/create-checada.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CustomLoggerService } from '../../logger/logger.service';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reloj Checador')
@Controller('checador')
export class ChecadorController {
  private log = new CustomLoggerService();
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
  reportNomipaq(@Query() data: NomipaqDto, @CurrentUser() user: any) {
    return this.checadorService.reportNomipaq(data, user);
  }

  @ApiOperation({
    summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq',
  })
  @Views('nomipaq')
  @Post('nomipaq/report/v2')
  async reportNomipaqV2(
    @Body() data: NomipaqDto,
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const supportsGzip = typeof acceptEncoding === 'string' && acceptEncoding.includes('gzip');
    const output = supportsGzip ? createGzip() : res;
    let diasGenerados: string[] = [];
    let isFirstRegistro = true;

    res.status(200);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    if (supportsGzip) {
      res.setHeader('Content-Encoding', 'gzip');
      res.append('Vary', 'Accept-Encoding');
      output.pipe(res);
    }

    try {
      await this.checadorService.reportNomipaqV2(data, user, {
        start: (days: string[]) => {
          diasGenerados = days;
          output.write('{"registros":[');
        },
        writeRegistro: (registro: Record<string, unknown>) => {
          output.write(`${isFirstRegistro ? '' : ','}${JSON.stringify(registro)}`);
          isFirstRegistro = false;
        },
        end: () => {
          output.write(`],"diasGenerados":${JSON.stringify(diasGenerados)}}`);
          output.end();
        },
      });
    } catch (error) {
      if (res.headersSent) {
        // Evita cerrar abruptamente el socket (ERR_FAILED en navegador)
        output.end();
        return;
      }
      this.log.error('Error en reportNomipaqV2', error);
      throw error;
    }
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
