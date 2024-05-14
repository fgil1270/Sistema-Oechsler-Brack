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
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RequestCourse } from '../entities/request_course.entity';
import { RequestCourseService } from '../service/request_course.service';
import { RequestCourseDto } from '../dto/create_request_course.dto';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Views } from '../../auth/decorators/views.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Solicitud de curso')
@Controller('request_course')
export class RequestCourseController {
  constructor(private service: RequestCourseService) {}

  @ApiOperation({ summary: 'Crear solicitud de curso' })
  @Post()
  async create(@Body() currData: RequestCourseDto, @CurrentUser() user: any) {
    return this.service.create(currData, user);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso' })
  @Get()
  async findAll(
    @Query() query: Partial<RequestCourse>,
    @CurrentUser() user: any,
  ) {
    return this.service.findAll(query, user);
  }

  @ApiOperation({ summary: 'Acceso a solicitudes de curso' })
  @Views('solicitud_curso')
  @Get('/access')
  async access() {
    return true;
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso por id' })
  @Get(':id')
  async findRequestCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findRequestCourseById(id);
  }

  @ApiOperation({
    summary: 'Realizar busqueda por algun campo de solicitud de curso',
  })
  @Get('/find/by')
  async findRequestCourseBy(@Query() query: Partial<RequestCourse>) {
    return this.service.findRequestCourseBy(query);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso por empleado' })
  @Get('find/by/:status')
  async findRequestCourseByEmployee(
    @Param('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.service.findRequestCourseApprove(status, user);
  }

  @ApiOperation({ summary: 'Actualizar solicitud de curso' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<RequestCourse>,
  ) {
    return this.service.update(id, data);
  }
}
