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

import { ShiftService } from '../service/shift.service';
import { CreateShiftDto, UpdateShiftDto } from '../dto/create-shift.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Turnos')
@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @ApiOperation({ summary: 'Crear turno'})
  @Post()
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @ApiOperation({ summary: 'Listar turnos'})
  @Views('turnos')
  @Get()
  findAll() {
    return this.shiftService.findAll();
  }

  @ApiOperation({ summary: 'Buscar turno'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar turno'})
  @Put(':id')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftService.update(+id, updateShiftDto);
  }

  @ApiOperation({ summary: 'Eliminar turno'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftService.remove(+id);
  }
}
