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
    UploadedFile
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { LogAdjustmentVacationService } from '../service/log_adjustment_vacation.service';
import { CreateLogAdjustmentVacationDto, UpdateLogAdjustmentVacationDto } from '../dto/create_adjustment_vacation.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";
import { User } from "../../users/entities/user.entity";

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Ajuste de vacaciones')
@Controller('log_adjustment_vacation')
export class LogAdjustmentVacationController {
  constructor(private readonly logAdjustmentVacationService: LogAdjustmentVacationService) {}

    @ApiOperation({ summary: 'Crear ajuste de vacaciones'})
    @Post()
    create(@Body() createLogAdjustmentVacationDto: CreateLogAdjustmentVacationDto, @CurrentUser() user: User) {
        return this.logAdjustmentVacationService.create(createLogAdjustmentVacationDto, user);
    }

    @ApiOperation({ summary: 'Listar ajustes de vacaciones'})
    @Get()
    findAll() {
        return this.logAdjustmentVacationService.findAll();
    }

    @ApiOperation({ summary: 'Listar ajustes de vacaciones por id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.logAdjustmentVacationService.findOne(id);
    }

    @ApiOperation({ summary: 'Listar ajustes de vacaciones por X parametro'})
    @Get('/search/adjustmentVacation')
    findby(@Query() data: any) {
        return this.logAdjustmentVacationService.findby(data);
    }


    @ApiOperation({ summary: 'Actualizar ajuste de vacaciones'})
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLogAdjustmentVacationDto: CreateLogAdjustmentVacationDto) {
        return this.logAdjustmentVacationService.update(id, updateLogAdjustmentVacationDto);
    }

    @ApiOperation({ summary: 'Eliminar ajuste de vacaciones'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.logAdjustmentVacationService.remove(id);
    }
}
