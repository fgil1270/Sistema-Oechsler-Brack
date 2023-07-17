import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param,
  Delete, 
  UseGuards,
  ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { DepartmentsService } from '../service/departments.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Departamentos')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @ApiOperation({ summary: 'Crear departamento'})
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @ApiOperation({ summary: 'Listar departamentos'})
  @Views('departamentos')
  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar Departamento'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar departamento'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @ApiOperation({ summary: 'Eliminar departamento'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove(id);
  }
}
