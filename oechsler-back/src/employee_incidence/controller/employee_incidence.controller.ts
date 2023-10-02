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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { EmployeeIncidenceService } from '../service/employee_incidence.service';
import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Double } from 'typeorm';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Incidencias de empleados')
@Controller('employee-incidence')
export class EmployeeIncidenceController {
  constructor(private readonly employeeIncidenceService: EmployeeIncidenceService) {}

  @ApiOperation({ summary: 'Crear incidencias de empleados'})
  @Post()
  create(@Body() createEmployeeIncidenceDto: CreateEmployeeIncidenceDto, @CurrentUser() user: any) {
    return this.employeeIncidenceService.create(createEmployeeIncidenceDto, user);
  }

  @ApiOperation({ summary: 'Listar incidencias de empleados'})
  @Views('asignar_incidencia')
  @Get()
  findAll() {
    return this.employeeIncidenceService.findAll();
  }

  @ApiOperation({ summary: 'Buscar incidencia de empleado'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeIncidenceService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar incidencia por status y aprobacion double' })
  @Get(':status/:approval')
  findIncidencesByStatusDouble(@Param('status') status: string, @Param('approval') approvalDouble: boolean){
    return this.employeeIncidenceService.findIncidencesByStatusDouble(status, approvalDouble);
  }
  
  @ApiOperation({ summary: 'Buscar incidencia por status' })
  @Get('incidences/status/:status')
  findIncidencesByStatus(@Param('status') status: string){
    return this.employeeIncidenceService.findIncidencesByStatus(status);
  }

  //buscar incidencias de empleados por ids de empleados
  //y por rango de fechas
  @ApiOperation({ summary: 'Listar todas las incidencias por ids de empleados'})
  @Get('incidences/:ids/:start/:end')
  findAllIncidencesByIdsEmployee(@Param() data: any) {
    return this.employeeIncidenceService.findAllIncidencesByIdsEmployee(data);
  }

  //buscar incidencias del empleado por dia 
  @ApiOperation({ summary: 'Listar todas las incidencias que corresponden al día de ese empleado'})
  @Get('incidences/date/:ids/:start/:end')
  findAllIncidencesDay(@Param() data: any) {
    return this.employeeIncidenceService.findAllIncidencesDay(data);
  }

  @ApiOperation({ summary: 'Actualizar incidencia de empleado'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto, @CurrentUser() user: any) {
    return this.employeeIncidenceService.update(id, updateEmployeeIncidenceDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeIncidenceService.remove(id);
  }
}
