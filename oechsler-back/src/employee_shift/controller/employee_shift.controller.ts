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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { EmployeeShiftService } from '../service/employee_shift.service';
import { CreateEmployeeShiftDto, UpdateEmployeeShiftDto } from '../dto/create-employee_shift.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Turnos del empleados')
@Controller('employee-shift')
export class EmployeeShiftController {
  constructor(private readonly employeeShiftService: EmployeeShiftService) {}

  @ApiOperation({ summary: 'Crear turno de empleado'})
  @Post()
  create(@Body() createEmployeeShiftDto: CreateEmployeeShiftDto) {
    console.log(createEmployeeShiftDto);
    return this.employeeShiftService.create(createEmployeeShiftDto);
  }

  @ApiOperation({ summary: 'Listar turnos de empleados'})
  @Views('asignar_turno')
  @Get()
  findAll() {
    return this.employeeShiftService.findAll();
  }

  @ApiOperation({ summary: 'Buscar turno de empleado'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeShiftService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar turno de empleados seleccionados'})
  @Get('/shift-emps/:ids/:start/:end')
  findMore(@Param() data: any, @Param('ids') ids: any) {
    return this.employeeShiftService.findMore(data, ids);
  }

  @ApiOperation({ summary: 'Buscar empleados por departamento y leader'})
  @Get('/shift-emps/:idLeader/:idDept')
  findEmployeeDeptLeader(@Param('idLeader', ParseIntPipe) idLeader: number, @Param('idDept', ParseIntPipe) idDept: number) {
    return this.employeeShiftService.findEmployeeDeptLeader(idLeader, idDept);
  }

  @ApiOperation({ summary: 'Actualizar turno de empleado'})
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeShiftDto: UpdateEmployeeShiftDto) {
    return this.employeeShiftService.update(id, updateEmployeeShiftDto);
  }

  @ApiOperation({ summary: 'Eliminar turno de empleado'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeShiftService.remove(id);
  }
}
