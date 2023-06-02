import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { User } from "./entity/user.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    index(): Promise<User[]> {
      return this.usersService.findAll();
    } 

    @Post('create')
    async create(@Body() userData: User): Promise<any> {
        return this.usersService.create(userData);
    }

    @Put(':id/update')
    async update(@Param('name') name, @Body() userData: User): Promise<any> {
        userData.name = String(name);
        console.log('Update Name' + userData.name);
        return this.usersService.update(userData);
    }

    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.usersService.delete(id);
    }

    /*
    

    @Get()
    findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
    }
    */
}
