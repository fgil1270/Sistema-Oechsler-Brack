import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Query,
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { OrganigramaService } from '../service/organigrama.service';
import { CreateOrganigramaDto, OrganigramaGerarquia } from '../dto/create-organigrama.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

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
  findAll(@CurrentUser() user: any) {
    return this.organigramaService.findAll(user);
  }

  @ApiOperation({ summary: 'Buscar organigrama'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organigramaService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar posibles lideres del empleado'})
  @Get('/leaders/:id')
  findLiders(@Param('id', ParseIntPipe) id: number) {
    return this.organigramaService.findLeader(id);
  }

  @ApiOperation({ summary: 'Buscar gerarquia organigrama'})
  @Get('/leaders/gerarquia/organigrama')
  findGerarquia(@Query() gerarquia: OrganigramaGerarquia, @CurrentUser() user: any) {
    return this.organigramaService.findJerarquia(gerarquia, user);
  }

  @ApiOperation({ summary: 'Buscar lider del empleado'})
  @Get('/leaders/gerarquia/organigrama/:idEmployee')
  findlider(@Param('idEmployee', ParseIntPipe) id: number) {
    return this.organigramaService.leaders(id);
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
