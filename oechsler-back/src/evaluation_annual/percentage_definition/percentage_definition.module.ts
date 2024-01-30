/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PercentageDefinitionController } from './controller/percentage_definition.controller';
import { PercentageDefinitionService } from './service/percentage_definition.service';
import { PercentageDefinition } from './entities/percentage_definition.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PercentageDefinition])
    ],
    providers: [
        PercentageDefinitionService
    ],
    controllers: [
        PercentageDefinitionController
    ],
    exports: [
        PercentageDefinitionService
    ]
})
export class PercentageDefinitionModule { }
