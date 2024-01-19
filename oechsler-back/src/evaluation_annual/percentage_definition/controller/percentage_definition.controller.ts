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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { PercentageDefinitionService } from '../service/percentage_definition.service';
import { CreatePercentageDefinitionDto } from '../dto/create_percentage_definition.dto';

@ApiTags('Definicion de Porcentaje')
@Controller('percentage-definition')
export class PercentageDefinitionController {
    constructor(
        private percentageDfinitionService: PercentageDefinitionService
    ) {}
    
    @ApiOperation({ summary: 'Crea una definicion de porcentaje' })
    @Post()
    async create(@Body() currData: CreatePercentageDefinitionDto){
        return this.percentageDfinitionService.create(currData);
    }
 }
