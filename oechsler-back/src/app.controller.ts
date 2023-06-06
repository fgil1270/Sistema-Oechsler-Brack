import { Controller, Get, Request, Post, UseGuards, SetMetadata, Inject } from '@nestjs/common';
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ApikeyGuard } from "./auth/guards/apikey.guard";
import { Public } from "./auth/decorators/public.decorator";


@Controller()
export class AppController {
  
  constructor(
    @Inject('API_KEY') private apiKey: string,
    private appService: AppService,
    private configService: ConfigService,
  ) {}

  
  @Get('hello')
  getHello() {
    
    return `hello test ${this.configService.get('API_KEY')}`;
  }
  @UseGuards(ApikeyGuard)
  @Get('test')
  test() {
    return 'test';
  }


  @Get('nuevo')
  @Public()
  new() {
    return 'nuevo test';
  }
  
}