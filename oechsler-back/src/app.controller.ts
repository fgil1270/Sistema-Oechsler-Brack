import { Controller, Get, Request, Post, UseGuards, SetMetadata, Inject } from '@nestjs/common';
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApikeyGuard } from "./auth/guards/apikey.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "./auth/decorators/public.decorator";

@ApiTags('Pruebas')
@UseGuards(ApikeyGuard)
@Controller()
export class AppController {
  
  constructor(
    @Inject('API_KEY') private apiKey: string,
    private appService: AppService,
    private configService: ConfigService,
  ) {}

  
  @Get()
  getHello() {
    
    return this.appService.getHello();
  }
  
  @ApiOperation({ summary: 'Prueba test'})
  @Get('test')
  test() {
    return 'test';
  }
  
  @ApiOperation({ summary: 'Prueba nuevo'})
  @Get('nuevo')
  //@Public()
  new() {
    return 'nuevo test';
  }
  
}