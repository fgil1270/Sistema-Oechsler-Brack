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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { RequestCourse } from '../entities/request_course.entity';
import { RequestCourseService } from '../service/request_course.service';
import { RequestCourseDto } from '../dto/create_request_course.dto';
import { RoleGuard } from "../../auth/guards/role.guard";
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Solicitud de curso')
@Controller('request_course')
export class RequestCourseController {

  constructor(
    private service: RequestCourseService
  ) { }

  @ApiOperation({ summary: 'Crear solicitud de curso'})
  @Post()
  async create(
    @Body() currData: RequestCourseDto,
    @CurrentUser() user: any){
    return this.service.create(currData, user);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de curso'})
  @Get()
  async findAll(@CurrentUser() user: any){
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Actualizar solicitud de curso'})
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RequestCourse
  ){
    return this.service.update(id, data);
  }

}
