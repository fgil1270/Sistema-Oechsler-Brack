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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { VacationsProfileService } from '../service/vacations-profile.service';
import { CreateVacationsProfileDto } from '../dto/create-vacations-profile.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Perfiles de vacaciones')
@Controller('vacations-profile')
export class VacationsProfileController {
  constructor(
    private readonly vacationsProfileService: VacationsProfileService,
  ) {}

  @ApiOperation({ summary: 'Crear perfil de vacaciones' })
  @Post()
  create(@Body() createVacationsProfileDto: CreateVacationsProfileDto) {
    return this.vacationsProfileService.create(createVacationsProfileDto);
  }

  @ApiOperation({ summary: 'Listar perfiles de vacaciones' })
  @Get()
  findAll() {
    return this.vacationsProfileService.findAll();
  }

  @ApiOperation({ summary: 'Buscar perfil de vacaciones' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacationsProfileService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar perfil de vacaciones' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVacationsProfileDto: CreateVacationsProfileDto,
  ) {
    return this.vacationsProfileService.update(id, updateVacationsProfileDto);
  }

  @ApiOperation({ summary: 'Eliminar perfil de vacaciones' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vacationsProfileService.remove(id);
  }
}
