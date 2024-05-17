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

import { EmployeeProfilesService } from '../service/employee-profiles.service';
import { CreateEmployeeProfileDto } from '../dto/create-employee-profile.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Perfiles de Empleados')
@Controller('employee-profiles')
export class EmployeeProfilesController {
  constructor(
    private readonly employeeProfilesService: EmployeeProfilesService,
  ) {}

  @ApiOperation({ summary: 'Crear perfil de empleado' })
  @Post()
  create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
    return this.employeeProfilesService.create(createEmployeeProfileDto);
  }

  @ApiOperation({ summary: 'Listar perfiles de empleados' })
  @Get()
  findAll() {
    return this.employeeProfilesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar perfil de empleado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeProfilesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar perfil de empleado' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeProfileDto: CreateEmployeeProfileDto,
  ) {
    return this.employeeProfilesService.update(id, updateEmployeeProfileDto);
  }

  @ApiOperation({ summary: 'Eliminar perfil de empleado' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeProfilesService.remove(id);
  }
}
