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

import { SupplierService } from '../service/supplier.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Teacher } from '../entities/teacher.entity';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Proveedor')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @ApiOperation({ summary: 'Listar todos los proveedores' })
  @Get()
  findAll() {
    return this.supplierService.findSuplierAll();
  }

  @ApiOperation({ summary: 'Obtener acceso a proveedores' })
  @Views('proveedores')
  @Get('access')
  getAccess() {
    return true;
  }

  @ApiOperation({ summary: 'Obtener proveedor por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findSupplierOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar proveedor por ID' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.updateSupplier(+id, updateSupplierDto);
  }

  @ApiOperation({ summary: 'Eliminar proveedor por ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.removeSupplier(+id);
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Instructores')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly supplierService: SupplierService) { }

  @ApiOperation({ summary: 'Listar instructores' })
  @Get()
  findAll(@Query() query: Partial<Teacher>) {
    return this.supplierService.findTeacherAll(query);
  }

  @ApiOperation({ summary: 'Crear instructor' })
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.supplierService.createTeacher(createTeacherDto);
  }

  @ApiOperation({ summary: 'Buscar instructor por ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findTeacherById(id);
  }

  @ApiOperation({ summary: 'Actualizar instructor' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: CreateTeacherDto,
  ) {
    return this.supplierService.updateTeacher(id, updateTeacherDto);
  }

}
