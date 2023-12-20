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
    Req,
    Query
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

import { ChecadorService } from '../service/checador.service';
import { CreateChecadaDto, UpdateChecadaDto } from '../dto/create-checada.dto';

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

    @ApiOperation({ summary: 'buscar registros de entrada y salida por ids de empleado y rango de fechas' })
    @Get()
    findbyDate(@Query() data: UpdateChecadaDto){
        return this.checadorService.findbyDate(data.empleadoId, data.startDate, data.endDate, data.startTime, data.endTime);
    }

    @ApiOperation({ summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq' })
    @Views('nomipaq')
    @Get('nomipaq')
    findView(){
        return true;
    }

    @ApiOperation({ summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq' })
    @Views('nomipaq')
    @Get('nomipaq/report')
    reportNomipaq(@Query() data:any){
        return this.checadorService.reportNomipaq(data);
    }

    @ApiOperation({ summary: 'Actualizar Checada' })
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateChecadaDto){
        return this.checadorService.update(data, id);
    }

    
}
