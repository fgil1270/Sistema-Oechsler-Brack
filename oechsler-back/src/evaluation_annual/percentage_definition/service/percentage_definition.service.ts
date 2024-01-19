/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreatePercentageDefinitionDto } from '../dto/create_percentage_definition.dto';
import { PercentageDefinition } from '../entities/percentage_definition.entity';

@Injectable()
export class PercentageDefinitionService {
    constructor(
        @InjectRepository(PercentageDefinition) private percentageDefinitionRepository: Repository<PercentageDefinition>
    ) {}

    async create(currData: CreatePercentageDefinitionDto){
        const percentaje = await this.percentageDefinitionRepository.create(currData);
        
        
        if(!await this.percentageDefinitionRepository.save(percentaje)){
            console.log("error");
            console.log(percentaje);
        }

        return;

    }
}
