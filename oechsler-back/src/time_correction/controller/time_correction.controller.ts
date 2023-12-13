import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query,
  Put, 
  Param, 
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { TimeCorrectionService } from '../service/time_correction.service';
import { CreateTimeCorrectionDto, UpdateTimeCorrectionDto } from '../dto/create-time-correction.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Correcion de tiempos')
@Controller('time-correction')
export class TimeCorrectionController {
  constructor(private readonly timeCorrectionService: TimeCorrectionService) { }

  @ApiOperation({ summary: 'Crear correción de tiempo'}) 
  @Post()
  create(@Body() createCorrectionTime: CreateTimeCorrectionDto){
    return this.timeCorrectionService.create(createCorrectionTime);
  } 

  @ApiOperation({ summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq' })
  @Views('correccion_tiempo')
  @Get()
  reportNomipaq(@Query() data:any, @CurrentUser() user: any){
    console.log(data);
    return this.timeCorrectionService.find(data, user);
  }

  @ApiOperation({ summary: 'Acceso a la vista de Nomipaq y reporte de Nomipaq' })
  @Get('checadas')
  getChecadas(@Query() data:any, @CurrentUser() user: any){
    return this.timeCorrectionService.findByEmployee(data, user);
  }

}
