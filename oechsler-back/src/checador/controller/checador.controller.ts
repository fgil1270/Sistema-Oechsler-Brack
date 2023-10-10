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
    ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

import { ChecadorService } from '../service/checador.service';
import { CreateChecadaDto } from '../dto/create-checada.dto';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Reloj Checador')
@Controller('checador')
export class ChecadorController { 
    constructor(private readonly checadorService: ChecadorService){}

    @ApiOperation({ summary: 'Crear registro de entrada o salida del empleado' })
    @Post()
    create(@Body() createChecadaDto: CreateChecadaDto){
        return this.checadorService.create(createChecadaDto);
    }

    
}
