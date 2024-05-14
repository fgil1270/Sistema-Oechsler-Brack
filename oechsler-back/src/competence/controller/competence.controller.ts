/*
https://docs.nestjs.com/controllers#controllers
*/
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

import { CompetenceService } from '../service/competence.service';
import { CompetenceDto } from '../dto/create_competence.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Competencias/Habilidades')
@Controller('competence')
export class CompetenceController {
  constructor(private readonly competenceService: CompetenceService) {}

  @ApiOperation({ summary: 'Listar Competencias' })
  @Get()
  findAll() {
    return this.competenceService.findAll();
  }
}
