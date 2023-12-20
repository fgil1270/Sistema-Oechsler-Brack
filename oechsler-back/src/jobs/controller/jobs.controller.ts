import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put,
  Param, 
  Delete,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';

import { JobsService } from '../service/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Puestos')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Crear Puesto'})
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Listar Puestos'})
  
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar Puesto'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @ApiOperation({ summary: 'Editar Puesto'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateJobDto: CreateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @ApiOperation({ summary: 'Eliminar Puesto'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}
