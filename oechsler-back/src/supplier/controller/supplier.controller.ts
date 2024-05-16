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
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Teacher } from '../entities/teacher.entity';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Proveedor')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  findAll() {
    return this.supplierService.findSuplierAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findSupplierOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.updateSupplier(+id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.removeSupplier(+id);
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Instructores')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  findAll(@Query() query: Partial<Teacher>) {
    return this.supplierService.findTeacherAll(query);
  }

}
