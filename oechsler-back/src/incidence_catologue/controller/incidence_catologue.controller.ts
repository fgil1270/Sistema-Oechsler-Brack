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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { IncidenceCatologueService } from '../service/incidence_catologue.service';
import { CreateIncidenceCatologueDto, UpdateIncidenceCatologueDto } from '../dto/create-incidence_catologue.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Catálogo de incidencias')
@Controller('incidence-catologue')
export class IncidenceCatologueController {
  constructor(private readonly incidenceCatologueService: IncidenceCatologueService) {}

  @ApiOperation({ summary: 'Crear incidencias'})
  @Post()
  create(@Body() createIncidenceCatologueDto: CreateIncidenceCatologueDto) {
    return this.incidenceCatologueService.create(createIncidenceCatologueDto);
  }

  @ApiOperation({ summary: 'Listar catálogo de incidencias'})
  @Views('catalogo_incidencias')
  @Get()
  findAll() {
    return this.incidenceCatologueService.findAll();
  }

  @ApiOperation({ summary: 'Buscar incidencia dentro del catálogo de incidencias'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.incidenceCatologueService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar catálogo de incidencias'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateIncidenceCatologueDto: UpdateIncidenceCatologueDto) {
    return this.incidenceCatologueService.update(id, updateIncidenceCatologueDto);
  }

  @ApiOperation({ summary: 'Eliminar incidencias del catálogo de incidencias'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incidenceCatologueService.remove(id);
  }
}
