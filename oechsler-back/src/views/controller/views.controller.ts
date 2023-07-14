import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode,
  ParseIntPipe,
  UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { ViewsService } from '../service/views.service';
import { CreateViewDto } from '../dto/create-view.dto';
import { Views } from 'src/auth/decorators/views.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Vistas')
@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @ApiOperation({ summary: 'Crear vista'})
  @Post()
  create(@Body() createViewDto: CreateViewDto) {
    console.log("crear vista")
    return this.viewsService.create(createViewDto);
  }

  @ApiOperation({ summary: 'Listar vistas'})
  @Get()
  @Views('Vistas', 'Roles-permisos')
  findAll() {
    return this.viewsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener lista de vistas eliminadas' })
    @Get('/deleted')
    getDeletedUsers() {
      return this.viewsService.findAllDeleted();
    }

  @ApiOperation({ summary: 'Buscar vista'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Editar vista'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateViewDto: CreateViewDto) {
    return this.viewsService.update(id, updateViewDto);
  }

  @ApiOperation({ summary: 'Editar permisos'})
  @Put('/permission/:id')
  addRole(@Param('id', ParseIntPipe) id: number, @Body() updateViewDto: any) {
    return this.viewsService.addRole(id, updateViewDto);
  }

  @ApiOperation({ summary: 'Eliminar vista'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.viewsService.remove(id);
  }

  @ApiOperation({ summary: 'Restaurar vista'})
    @Put('restore/:id')
    restore(@Param('id', ParseIntPipe) id: number){
      return this.viewsService.restore(id);
    }
}
