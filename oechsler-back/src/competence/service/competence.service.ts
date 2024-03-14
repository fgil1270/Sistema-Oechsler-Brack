/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CompetenceDto } from '../dto/create_competence.dto';
import { Competence } from '../entities/competence.entity';

@Injectable()
export class CompetenceService {

    constructor(
        @InjectRepository(Competence) private competence: Repository<Competence>
    ){}

    async create(currData: CompetenceDto){

    }

    async findAll(){
        let competence = await this.competence.find({
            relations:{
                typeCompetence: true,
                typeElementCompetence: true
            }
        });

        return competence;
    }

    async findOne(id: number){
        let competence = await this.competence.findOne({
            where: {
                id: id
            },
            relations:{
                typeCompetence: true,
                typeElementCompetence: true,
                job: true,
                course: true
            }
        });


        return competence;

    }
}
