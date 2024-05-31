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
import { RequestCourseDto, RequestCourseAssignmentDto, UpdateRequestCourseDto, UpdateAssignmentCourseDto } from '../dto/create_request_course.dto';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Views } from '../../auth/decorators/views.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Solicitud de curso')
@Controller('request_course')
export class RequestCourseController {
  constructor(private requestCourseService: RequestCourseService) {}

  @ApiOperation({ summary: 'Crear solicitud de curso' })
  @Post()
  async create(@Body() currData: RequestCourseDto, @CurrentUser() user: any) {
    return this.requestCourseService.create(currData, user);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso' })
  @Get()
  async findAll(
    @Query() query: Partial<RequestCourse>,
    @CurrentUser() user: any,
  ) {
    return this.requestCourseService.findAll(query, user);
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
    return this.requestCourseService.findRequestCourseById(id);
  }

  @ApiOperation({
    summary: 'Realizar busqueda por algun campo de solicitud de curso',
  })
  @Get('/find/by')
  async findRequestCourseBy(@Query() query: Partial<RequestCourseDto>) {
    return this.requestCourseService.findRequestCourseBy(query);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso por empleado' })
  @Get('find/by/:status')
  async findRequestCourseByEmployee(
    @Param('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.requestCourseService.findRequestCourseApprove(status, user);
  }

  @ApiOperation({ summary: 'Actualizar solicitud de curso' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRequestCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.requestCourseService.update(id, data, user);
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Solicitud de curso')
@Controller('assignment_course')
export class AssignmentCourseController {
  constructor(private requestCourseService: RequestCourseService) {}

  @ApiOperation({ summary: 'Crear asignacion de curso' })
  @Post()
  async createAssignment(@Body() currData: RequestCourseAssignmentDto, @CurrentUser() user: any) {
    return this.requestCourseService.createAssignmentCourse(currData);
  }

  @ApiOperation({ summary: 'Buscar Asignación de curso por algun parametro' })
  @Get()
  async getAssignmentBy(@Query() currData: UpdateAssignmentCourseDto, @CurrentUser() user: any) {
    
    return this.requestCourseService.getAssignmentBy(currData);
  }

  @ApiOperation({ summary: 'Acceso a la vista asignación y seguimiento de cursos' })
  @Views('asignar_curso')
  @Get('access')
  async getAccessAssignmentCourse(@CurrentUser() user: any) {
    
    return true
  }


}
