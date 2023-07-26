import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { OrganigramaService } from '../service/organigrama.service';
import { CreateOrganigramaDto } from '../dto/create-organigrama.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Organigrama')
@Controller('organigrama')
export class OrganigramaController {
  constructor(private readonly organigramaService: OrganigramaService) {}

  @ApiOperation({ summary: 'Crear organigrama'})
  @Post()
  create(@Body() createOrganigramaDto: CreateOrganigramaDto) {
    return this.organigramaService.create(createOrganigramaDto);
  }

  @ApiOperation({ summary: 'Listar organigrama'})
  @Views('organigrama')
  @Get()
  findAll() {
    return this.organigramaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar organigrama'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organigramaService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar organigrama'})
  @Get('/leaders/:id')
  findLiders(@Param('id', ParseIntPipe) id: number) {
    return this.organigramaService.findLeader(id);
  }

  @ApiOperation({ summary: 'Actualizar organigrama'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrganigramaDto: CreateOrganigramaDto) {
    return this.organigramaService.update(id, updateOrganigramaDto);
  }

  @ApiOperation({ summary: 'Eliminar organigrama'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organigramaService.remove(id);
  }
}
