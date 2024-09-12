/*
https://docs.nestjs.com/providers#services
*/
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { EnabledCreateIncidenceDto } from '../dto/enabled-create-incidence.dto';
import { EnabledCreateIncidence } from '../entities/enabled-create-incidence.entity';
import { EmployeesService } from 'src/employees/service/employees.service';
import e from 'express';
import { find } from 'rxjs';

@Injectable()
export class EnabledCreateIncidenceService { 
    constructor(
        @InjectRepository(EnabledCreateIncidence) private enabledCreateIncidenceRepository: Repository<EnabledCreateIncidence>,
        private employeeService: EmployeesService,
    ) {}
    
    async create(enabledCreateIncidenceDto: EnabledCreateIncidenceDto, user: any) {
        const status = {
            code: 200,
            message: 'OK',
            error: false,
            data: {},
            status: 'success',
          };
        
        const employee = await this.employeeService.findOne(user.idEmployee);

        if (!employee) {
            status.error = true;
            status.code = 404;
            status.message = 'Empleado no encontrado';
            return {status};
            
        }
        const findEnabledCreateIncidence = await this.enabledCreateIncidenceRepository.find();


        if(enabledCreateIncidenceDto.enabled == true){
            if(findEnabledCreateIncidence.length <= 0){
                const enabledCreateIncidence = this.enabledCreateIncidenceRepository.create(enabledCreateIncidenceDto);
                enabledCreateIncidence.employee = employee.emp;

                await this.enabledCreateIncidenceRepository.save(enabledCreateIncidence);

                status.data = enabledCreateIncidence;
                status.message = 'Habilitar incidencia creado';
            }else{
                findEnabledCreateIncidence[0].enabled = enabledCreateIncidenceDto.enabled;
                findEnabledCreateIncidence[0].employee = employee.emp;
                findEnabledCreateIncidence[0].date = new Date(enabledCreateIncidenceDto.date);
                status.data = findEnabledCreateIncidence[0];
                status.message = 'Habilitar incidencia actualizado';

                await this.enabledCreateIncidenceRepository.save(findEnabledCreateIncidence[0]);
            }
        }else{

            if(findEnabledCreateIncidence.length > 0){

                findEnabledCreateIncidence[0].enabled = enabledCreateIncidenceDto.enabled;
                findEnabledCreateIncidence[0].employee = employee.emp;
                findEnabledCreateIncidence[0].date = new Date(enabledCreateIncidenceDto.date);
                status.data = findEnabledCreateIncidence[0];
                status.message = 'Habilitar incidencia actualizado';

                await this.enabledCreateIncidenceRepository.save(findEnabledCreateIncidence[0]);
            }
        }
        return {
            status
        };

    }

    async findAll() {
        return await this.enabledCreateIncidenceRepository.find();
    }

    async findByDate(date: string) {
        return await this.enabledCreateIncidenceRepository.findOne({
            where: {
                date: date as any,
            }
        });
    }

}
