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
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';

import { CourseService } from '../service/course.service';
import { CourseDto } from '../dto/create_course.dto';
import { Course } from '../entities/course.entity';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';


@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Cursos')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create a new course' })
  @Post()
  create(@Body() createCourseDto: CourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @ApiOperation({ summary: 'Subir archivo del curso' })
  @Post('/upload/:id')
  //CODIGO PARA SUBIR ARCHIVOS
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const courseId = req.params.id;
          const path = `./documents/catalogos/cursos/${courseId}`;

          // Verificar si el directorio existe, si no, crearlo
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }

          cb(null, path);
        }, 
        filename: (req, file, cb) => {
          const filename: string = file.originalname.split('.')[0];
          const extension: string = file.originalname.split('.')[1];
          const fecha: Date = new Date();
          cb(
            null,
            `${filename} ${fecha.getFullYear()}${
              fecha.getMonth() + 1
            }${fecha.getDate()}${fecha.getMinutes()}${fecha.getSeconds()}.${extension}`,
          );
        },
      }),
    }),
  )
  //@UseInterceptors(FileInterceptor('file'))
  uploadFile(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.courseService.uploadCourseFile(id, file);
    /* return this.employeesService.readExcel(file).catch((err) => {
      
      return {
        status: HttpStatus.BAD_REQUEST,
        message: err.message
      }
    }); */
  }

  @ApiOperation({ summary: 'Obtener todos los cursos' })
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: 'Acceso a la vista de cursos' })
  @Get('/acceso')
  @Views('cursos')
  findOne() {
    return this.courseService.findAll();
  }

  
  @ApiOperation({ summary: 'Obtener objetivos de entrenamiento' })
  @Get('/trainin-goal')
  getTraininGoalAll() {
    return this.courseService.getTraininGoalAll();
  }

  @ApiOperation({ summary: 'Obtener curso por id' })
  @Get(':id')
  findCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id); 
  }

  @ApiOperation({ summary: 'Obtiene el documento pdf de la clasificacion de archivos' })
  @Get('file/:id')
  async downloadFile(@Res() res: Response, @Param('id') id: number) {
    /* res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=objetivos.pdf',
          
      }); */

    try {
      const filePath = await this.courseService.getFilePath(id);
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

  @ApiOperation({ summary: 'Actualizar Curso' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: CourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Eliminar Curso' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.delete(id);
  }
}
