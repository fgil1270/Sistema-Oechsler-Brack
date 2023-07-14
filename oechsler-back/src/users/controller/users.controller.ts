import { 
  Controller, 
  Get,  
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode,
  ParseIntPipe,
  UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { UsersService } from "../service/users.service";
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Views } from 'src/auth/decorators/views.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @ApiOperation({ summary: 'Crear Usuario' })
    @Post()
    async create(@Body() userData: CreateUserDto) {
      return this.usersService.create(userData);
    }

    @ApiOperation({ summary: 'Obtener lista de usuarios' })
    @Get()
    @Views('Usuarios')
    getUsers() {
      return this.usersService.findAll();
    } 

    @ApiOperation({ summary: 'Obtener lista de usuarios eliminados' })
    @Get('/deleted')
    getDeletedUsers() {
      return this.usersService.findAllDeleted();
    } 

    @ApiOperation({ summary: 'Buscar Usuario' })
    @HttpCode(HttpStatus.ACCEPTED)
    @Get(':id')
    getOne(@Param('id', ParseIntPipe) userId: number){
      return this.usersService.findOne(userId)
    }

    @ApiOperation({ summary: 'Buscar por Nombre de Usuario' })
    @Get('/name')
    getName(@Body('name') name: string){
      return this.usersService.findByName(name)
    }

    @ApiOperation({ summary: 'Editar Usuario' })
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() userData: UpdateUserDto){
      return this.usersService.update(id, userData);
    }

    @ApiOperation({ summary: 'Editar contraseña'})
    @Put('password/:id')
    updatePassword(@Param('id') id: number, @Body('editPassword') password: string) {
      return this.usersService.updatePassword(id, password);
    }
    
    @ApiOperation({ summary: 'Restaurar usuario'})
    @Put('restore/:id')
    restore(@Param('id', ParseIntPipe) id: number){
      return this.usersService.restore(id);
    }

    @ApiOperation({ summary: 'Eliminar Usuario' })
    @Delete(':id')
    delete(@Param('id') id: number){
      return this.usersService.delete(id);
    }

   
}
