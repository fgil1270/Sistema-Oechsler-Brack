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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  ) {}

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

  @ApiOperation({ summary: 'Buscar incidencia de empleado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeIncidenceService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar incidencia por status y aprobacion double' })
  @Get(':status/:approval')
  findIncidencesByStatusDouble(
    @Param('status') status: string,
    @Param('approval') approvalDouble: boolean,
  ) {
    return this.employeeIncidenceService.findIncidencesByStatusDouble(
      status,
      approvalDouble,
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
      code: data.code ? data.code : null,
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
  @Views('autorizar_incidencia')
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
    return this.employeeIncidenceService.update(
      id,
      updateEmployeeIncidenceDto,
      user,
    );
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
  ) {}

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
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reporte Horario Flexible')
@Controller('report/flex-time')
export class ReportFlexTimeController {
  constructor(
    private readonly employeeIncidenceService: EmployeeIncidenceService,
  ) {}

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
}
