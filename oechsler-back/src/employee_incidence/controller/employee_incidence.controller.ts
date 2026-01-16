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
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


import { EmployeeIncidenceService } from '../service/employee_incidence.service';
import {
  CreateEmployeeIncidenceDto,
  UpdateEmployeeIncidenceDto,
  ReportEmployeeIncidenceDto,
} from '../dto/create-employee_incidence.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Incidencias de empleados')
@Controller('employee-incidence')
export class EmployeeIncidenceController {
  constructor(
    private readonly employeeIncidenceService: EmployeeIncidenceService,
  ) { }

  @ApiOperation({ summary: 'Crear incidencias de empleados' })
  @Post()
  create(
    @Body() createEmployeeIncidenceDto: CreateEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    return this.employeeIncidenceService.create(
      createEmployeeIncidenceDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Listar incidencias de empleados' })
  @Views('asignar_incidencia')
  @Get()
  findAll() {
    return true;
  }

  @ApiOperation({ summary: 'Buscar incidencia por id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeIncidenceService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar incidencia por status y aprobacion double' })
  @Get(':status/:approval')
  findIncidencesByStatusDouble(
    @Param('status') status: string,
    @Param('approval') approvalDouble: boolean,
    @Query() data: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    return this.employeeIncidenceService.findIncidencesByStatusDouble(
      data,
      status,
      approvalDouble,
      user
    );
  }

  //buscar incidencias por status y
  //rango de fechas
  @ApiOperation({ summary: 'Buscar incidencia por status' })
  @Get('incidences/status/:status')
  findIncidencesByStatus(
    @Query() data: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    return this.employeeIncidenceService.findIncidencesByStatus(data, user);
  }

  //buscar incidencias por status y
  //rango de fechas
  @ApiOperation({ summary: 'Buscar incidencia por status' })
  @Get('incidences/jerente/:status')
  findIncidencesPendientes(
    @Query() data: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    return this.employeeIncidenceService.findIncidencesPendientes(data, user);
  }

  //buscar incidencias de empleados por ids de empleados
  //y por rango de fechas
  @ApiOperation({
    summary: 'Listar todas las incidencias por ids de empleados',
  })
  @Post('incidences')
  findAllIncidencesByIdsEmployee(@Body() data: any, @Query() query: any) {
    const dataSerach = {
      ids: data.employees,
      start: data.start,
      end: data.end,
      status: data.status ? data.status : null,
      code_band: data.code_band ? data.code_band : null,
    };

    return this.employeeIncidenceService.findAllIncidencesByIdsEmployee(
      dataSerach,
    );
  }
  /* @Get('incidences/:ids/:start/:end')
  findAllIncidencesByIdsEmployee(@Param() data: any, @Query() query: any) {
    let dataSerach = {
      ids: data.ids,
      start: data.start,
      end: data.end,
      status: query.status? [query.status] : null,
      code: query.code ? [query.code] : null,
    } 
    return this.employeeIncidenceService.findAllIncidencesByIdsEmployee(dataSerach);
  } */

  //buscar incidencias del empleado por dia
  @ApiOperation({
    summary:
      'Listar todas las incidencias que corresponden al día de ese empleado',
  })
  @Get('incidences/date/:ids/:start/:end')
  findAllIncidencesDay(@Param() data: any) {
    return this.employeeIncidenceService.findAllIncidencesDay(data);
  }

  @ApiOperation({ summary: 'Acceso a vista Autorizar incidencias' })
  @Views('autorizar_incidencia', 'cancelar_incidencia')
  @Get('view/autorizar-incidencia/access/autorizar/incidencia/leader')
  AccessAutorizaIncidencia() {
    return true;
  }

  @ApiOperation({ summary: 'Actualizar incidencia de empleado' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    let update = this.employeeIncidenceService.update(
      id,
      updateEmployeeIncidenceDto,
      user,
    );

    return update;
  }

  @ApiOperation({ summary: 'Actualizar comentario de cancelacion de incidencia de empleado' })
  @Put(':id/comment')
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    let update = this.employeeIncidenceService.updateCommentCancelIncidence(
      id,
      updateEmployeeIncidenceDto,
      user,
    );

    return update;
  }

  @ApiOperation({ summary: 'Aprobar Incidencia por RH' })
  @Put(':id/approve')
  updateRh(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeIncidenceDto: any,
    @CurrentUser() user: any,
  ) {
    let approverh = this.employeeIncidenceService.approveRh(id, updateEmployeeIncidenceDto, user);

    return approverh;
  }

  @ApiOperation({ summary: 'Cancela incidencia multiple' })
  @Put('cancel/multiple')
  cancelMultiple(
    @Body() updateEmployeeIncidenceDto: any,
    @CurrentUser() user: any,
  ) {
    let cancelMultiple = this.employeeIncidenceService.cancelMultipleIncidence(updateEmployeeIncidenceDto, user);

    return cancelMultiple;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeIncidenceService.remove(id);
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reporte de incidencias de empleados')
@Controller('report/employee-incidence')
export class ReportEmployeeIncidenceController {
  constructor(
    private readonly employeeIncidenceService: EmployeeIncidenceService,
  ) { }

  @ApiOperation({ summary: 'Reporte de Tiempo compensatorio y repagos' })
  @Views('tiempo_compensatorio_repago')
  @Post()
  reportCompensatoryTime(
    @Body() report: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    if (report.access == 'true') {
      return true;
    } else {
      return this.employeeIncidenceService.reportCompensatoryTime(report, user);
    }
  }

  @ApiOperation({ summary: 'Reporte de Empleados en planta' })
  @Views('empleado_en_planta')
  @Get('plant-employee')
  async reportPlantEmployee(@Res() res: Response, @Query() currData: any) {
    /* res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=empleados_en_planta.pdf',
    }); */

    try {
      const { pdf, data } = await this.employeeIncidenceService.reportPlantEmployee(
        currData,
      );
      /* pdf.pipe(res);

      // Cuando el PDF termine de enviarse, enviar el JSON
      pdf.on('end', () => {
        res.json({
          success: true,
          message: 'Reporte generado exitosamente',
          data,
        });
      }); */

      const chunks: Buffer[] = [];
      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', () => {
        const pdfBase64 = Buffer.concat(chunks as Uint8Array[]).toString('base64');

        // Enviar el JSON con el PDF en base64
        res.json({
          success: true,
          message: 'Reporte generado exitosamente',
          pdf: pdfBase64,
          data,
        });
      });
      pdf.resume(); // Resume the stream to ensure it finishes processing
    } catch (error) {
      console.error(error);
    }
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reporte Horario Flexible')
@Controller('report/flex-time')
export class ReportFlexTimeController {
  constructor(
    private readonly employeeIncidenceService: EmployeeIncidenceService,
  ) { }

  @ApiOperation({ summary: 'Reporte de Tiempo compensatorio y repagos' })
  @Views('horario_flexible')
  @Get()
  reportCompensatoryTime(
    @Query() report: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    if (report.access == 'true') {
      return true;
    } else {
      return this.employeeIncidenceService.reportFlexTimeV2(report, user);
    }
  }

  @ApiOperation({ summary: 'Reporte de Tiempo compensatorio y repagos' })
  @Views('horario_flexible')
  @Get('v3')
  reportCompensatoryTimev3(
    @Query() report: ReportEmployeeIncidenceDto,
    @CurrentUser() user: any,
  ) {
    if (report.access == 'true') {
      return true;
    } else {
      return this.employeeIncidenceService.reportFlexTimeV3(report, user);
    }
  }
}
