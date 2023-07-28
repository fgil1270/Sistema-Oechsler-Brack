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

import { PatternService } from '../service/pattern.service';
import { CreatePatternDto, UpdatePatternDto } from '../dto/create-pattern.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Patrones')
@Controller('pattern')
export class PatternController {
  constructor(private readonly patternService: PatternService) {}

  @ApiOperation({ summary: 'Crear patrón de turnos'})
  @Post()
  create(@Body() createPatternDto: CreatePatternDto) {
    return this.patternService.create(createPatternDto);
  }

  @ApiOperation({ summary: 'Listar patrones de turnos'})
  @Views('patrones_turno')
  @Get()
  findAll() {
    return this.patternService.findAll();
  }

  @ApiOperation({ summary: 'Buscar patrón de turnos'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patternService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar patrón de turnos'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePatternDto: UpdatePatternDto) {
    return this.patternService.update(id, updatePatternDto);
  }

  @ApiOperation({ summary: 'Eliminar patrón de turnos'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patternService.remove(id);
  }
}
