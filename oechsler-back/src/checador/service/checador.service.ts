/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';

import { CreateChecadaDto } from '../dto/create-checada.dto';
import { Checador } from '../entities/checador.entity';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class ChecadorService {
    constructor(
        @InjectRepository(Checador) private checadorRepository: Repository<Checador>,
        private readonly employeesService: EmployeesService
    ){}

    async create(createChecadaDto: CreateChecadaDto){

    }

    async findAll(createChecadaDto: CreateChecadaDto){

    }

    async update(id: CreateChecadaDto){

    }

    async remove(id: number){
        const checada = await this.checadorRepository.findOne({
            where: {
                id: id
            }
        })

        if(!checada){
            throw new NotFoundException(`Registro de Entrada o Salidad no encontrado`);
        }

        return await this.checadorRepository.remove(checada);
    }
}
