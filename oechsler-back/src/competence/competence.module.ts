import { CompetenceController } from './controller/competence.controller';
import { CompetenceService } from './service/competence.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        CompetenceController,],
    providers: [
        CompetenceService,],
})
export class CompetenceModule { }
