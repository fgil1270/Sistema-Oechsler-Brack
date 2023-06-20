import { 
  Controller, 
  Get, 
  Query, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode,
  HttpException, 
  ParseIntPipe,
  UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { User } from "../entity/user.entity";
import { UsersService } from "../service/users.service";
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import passport from 'passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @ApiOperation({ summary: 'Crear Usuario' })
    @Post('create')
    async create(@Body() userData: CreateUserDto) {
      return this.usersService.create(userData);
    }

    @ApiOperation({ summary: 'Obtener lista de usuarios' })
    @Get()
    index() {
      try {
        return this.usersService.findAll();
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } 

    /*@ApiOperation({ summary: 'Obtener lista de usuarios' })
    @Get()
    getUsers(
      @Query('limit') limit = 100,
      @Query('offset') offset = 0,
      @Query('brand') brand: string,
    ) {
      return {
        message: `users limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
      }
    }*/

    @ApiOperation({ summary: 'Buscar Usuario' })
    @HttpCode(HttpStatus.ACCEPTED)
    @Get(':userId')
    getOne(@Param('userId', ParseIntPipe) userId: number){
      return this.usersService.findOne(userId)
    }

    @ApiOperation({ summary: 'Buscar por Nombre de Usuario' })
    @Post('/name/:name')
    getName(@Param('name') name: string){
      return this.usersService.findByName(name)
    }

    @ApiOperation({ summary: 'Editar Usuario' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() userData: UpdateUserDto){
      return this.usersService.update(id, userData);
    }

    @ApiOperation({ summary: 'Eliminar Usuario' })
    @Delete(':id')
    async delete(@Param('id') id: number){
      return this.usersService.delete(id);
    }

   
}
