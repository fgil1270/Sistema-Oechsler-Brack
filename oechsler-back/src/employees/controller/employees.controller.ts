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
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

import { EmployeesService } from '../service/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";
import { HttpStatus } from '@nestjs/common';



@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Empleados')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({ summary: 'Crear empleado'})
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiOperation({ summary: 'Listar empleados'})
  @Views('empleados')
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @ApiOperation({ summary: 'Cargar archivo de empleados'})
  @Post('/upload')
  //CODIGO PARA SUBIR ARCHIVOS
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './documents/temp/emp',
      filename: (req, file, cb) => {
        const filename: string = file.originalname.split('.')[0];
        const extension: string = file.originalname.split('.')[1];
        const fecha: Date = new Date();
        cb(null, `${filename} ${fecha.getFullYear()}${fecha.getMonth()+1}${fecha.getDate()}${fecha.getMinutes()}${fecha.getSeconds()}.${extension}`);
      }
    })
  }))
  //@UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File ) {
    return this.employeesService.readExcel(file);
    /* return this.employeesService.readExcel(file).catch((err) => {
      console.log(err);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: err.message
      }
    }); */
  }

  @ApiOperation({ summary: 'Buscar empleado'})
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar empleado'})
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @ApiOperation({ summary: 'Eliminar empleado'})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}
