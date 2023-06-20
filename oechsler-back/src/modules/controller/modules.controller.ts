import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { ModulesService } from '../service/modules.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleViews } from "../entities/module.entity";

@ApiTags('Modulos')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Crear modulo'})
  @Post('create')
  async create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @ApiOperation({ summary: 'Obtener lista de modulos'})
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener modulo'})
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.modulesService.findOne(id);
  }

  @ApiOperation({ summary: 'Editar modulo'})
  @Put(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @ApiOperation({ summary: 'Eliminar modulo'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
}
