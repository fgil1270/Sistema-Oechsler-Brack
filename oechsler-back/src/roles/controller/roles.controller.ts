import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesService } from '../service/roles.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/create-role.dto';
import { Views } from 'src/auth/decorators/views.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Crear role' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Obtener lista de roles' })
  @Get()
  @Views('roles')
  @UseGuards(RoleGuard)
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener lista de usuarios eliminados' })
  @Get('/deleted')
  getDeletedUsers() {
    return this.rolesService.findAllDeleted();
  }

  @ApiOperation({ summary: 'Bustacar role por id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Editar role' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Eliminar role' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }

  @ApiOperation({ summary: 'Restaurar role' })
  @Put('restore/:id')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.restore(id);
  }
}
