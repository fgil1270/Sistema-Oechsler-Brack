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
    Query,
    UseGuards,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { EnabledCreateIncidenceService } from '../service/enabled-create-incidence.service';
import { EnabledCreateIncidenceDto } from '../dto/enabled-create-incidence.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Habilitar Crear incidencia')
@Controller('enabled-create-incidence')
export class EnabledCreateIncidenceController { 
    constructor(private readonly enabledCreateIncidenceService: EnabledCreateIncidenceService) {}
    status = {
        code: 200,
        message: 'OK',
        error: false,
        data: {},
        status: 'success',
    };

    @ApiOperation({ summary: 'Crear habilitar crear incidencia' })
    @Post()
    async create(@Body() enabledCreateIncidenceDto: EnabledCreateIncidenceDto, @CurrentUser() user: any) {
        let createEnabled = await this.enabledCreateIncidenceService.create(enabledCreateIncidenceDto, user);
        this.status.error = createEnabled.status.error;
    }

    @ApiOperation({ summary: 'Obtener habilitar crear incidencia' })
    @Get()
    async findAll() {
        return this.enabledCreateIncidenceService.findAll();
    }

}
