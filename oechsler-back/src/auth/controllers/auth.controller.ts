import { Controller, Param, Post, Get, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { AuthService } from "../services/auth.service";

@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService) {}

    @ApiOperation({ summary: 'Autenticacion'})
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('login')
    async login(@Body() data: any){
        const user = await this.authService.validateUser(data.name, data.password);
        //this.authService.generateJWT(req);
        return {
            message: "logueado",
            user
        }
    }

    @ApiOperation({ summary: 'Logout'})
    @HttpCode(HttpStatus.ACCEPTED)
    @Get('logout')
    async logout(@Body() data: any){
        //this.authService.generateJWT(req);
        return {
            message: "logueado",
            data
        }
    }
}
