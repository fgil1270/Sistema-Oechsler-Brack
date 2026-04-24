import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Views } from '../../auth/decorators/views.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CreateJobDescriptionDto } from '../dto/create_job_description.dto';
import { JobDescriptionService } from '../service/job-description.service';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Job Description')
@Controller('job-description')
export class JobDescriptionController {
  constructor(private readonly jobDescriptionService: JobDescriptionService) { }

  @ApiOperation({ summary: 'Crear una descripcion de puesto' })
  @Post()
  create(@Body() createJobDescriptionDto: CreateJobDescriptionDto, @CurrentUser() user: any) {
    return this.jobDescriptionService.create(createJobDescriptionDto, user);
  }

  @Get()
  findAll() {
    //return this.jobDescriptionService.findAll();
  }

  // Endpoint para obtener descripciones de puestos para autorización
  @Get('authorization')
  findDescriptionsForAuthorization(@CurrentUser() user: any) {

    return this.jobDescriptionService.findDescriptionsForAuthorization(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('ID recibido:', id); // Agrega este log para verificar el ID
    //return this.jobDescriptionService.findOne(+id);
  }

  @Get('employee/authorization')
  getEmployeesForAuthorization() {
    return this.jobDescriptionService.getEmployeesForAuthorization();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDescriptionDto: any) {
    return this.jobDescriptionService.update(+id, updateJobDescriptionDto);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.jobDescriptionService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.jobDescriptionService.remove(+id);
  }
}
