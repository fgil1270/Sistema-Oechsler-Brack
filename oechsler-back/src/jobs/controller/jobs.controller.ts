import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Res
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { JobsService } from '../service/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Puestos')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Crear Puesto' })
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Listar Puestos' })
  @Views('puestos')
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar Puesto' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener Competencias del Puesto' })
  @Get(':id/competence')
  getCompetencies(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.getCompetencies(id);
  }

  @ApiOperation({ summary: 'Obtiene el documento pdf del puesto' })
  @Get(':id/files')
  async downloadFile(@Res() res: Response, @Param('id') id: number, @Query() query: any) {
    /* res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=objetivos.pdf',
          
      }); */

    try {
      const filePath = await this.jobsService.findFilesByJob(id);
      /* res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filePath.fileName}`); */
      res.set(
        'Content-Disposition',
        `attachment; filename="${filePath.fileName}"`,
      );
      res.download(filePath.path, filePath.fileName);
    } catch (error) {
      console.error(error);
    }
  }

  @ApiOperation({ summary: 'Editar Puesto' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: CreateJobDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  

  @ApiOperation({ summary: 'Eliminar Puesto' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}
