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
import { EmployeesService } from '../../employees/service/employees.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';

@Injectable()
export class EnabledCreateIncidenceService { 
    constructor(
        @InjectRepository(EnabledCreateIncidence) private enabledCreateIncidenceRepository: Repository<EnabledCreateIncidence>,
        private employeeService: EmployeesService,
        private payrollService: PayrollsService,
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
        const payroll = await this.payrollService.findName(enabledCreateIncidenceDto.type);

        if (!employee) {
            status.error = true;
            status.code = 404;
            status.message = 'Empleado no encontrado';
            return {status};
            
        }
        const findEnabledCreateIncidence = await this.enabledCreateIncidenceRepository.findOne({
            where: {
                payroll: {
                    id: payroll.payroll.id
                },
            }
        });
        
        if(enabledCreateIncidenceDto.enabled == true){
            if(!findEnabledCreateIncidence){
                const enabledCreateIncidence = this.enabledCreateIncidenceRepository.create(enabledCreateIncidenceDto);
                enabledCreateIncidence.employee = employee.emp;
                enabledCreateIncidence.payroll = payroll.payroll;

                await this.enabledCreateIncidenceRepository.save(enabledCreateIncidence);

                status.data = enabledCreateIncidence;
                status.message = 'Habilitar incidencia creado';
            }else{
                findEnabledCreateIncidence.enabled = enabledCreateIncidenceDto.enabled;
                findEnabledCreateIncidence.employee = employee.emp;
                findEnabledCreateIncidence.date = new Date(enabledCreateIncidenceDto.date);
                findEnabledCreateIncidence.payroll = payroll.payroll;
                status.data = findEnabledCreateIncidence;
                status.message = 'Habilitar incidencia actualizado';

                await this.enabledCreateIncidenceRepository.save(findEnabledCreateIncidence);
            }
        }else{

            if(findEnabledCreateIncidence){

                findEnabledCreateIncidence.enabled = enabledCreateIncidenceDto.enabled;
                findEnabledCreateIncidence.employee = employee.emp;
                findEnabledCreateIncidence.date = new Date(enabledCreateIncidenceDto.date);
                status.data = findEnabledCreateIncidence;
                status.message = 'Habilitar incidencia actualizado';

                await this.enabledCreateIncidenceRepository.save(findEnabledCreateIncidence);
            }
        }
        return {
            status
        };

    }

    async findAll() {
        return await this.enabledCreateIncidenceRepository.find({
            relations: ['payroll'],
        });
    }

    async findByDate(date: string) {
        return await this.enabledCreateIncidenceRepository.findOne({
            where: {
                date: date as any,
            }
        });
    }

    async findByPayroll(idPayRoll: number) {
        return await this.enabledCreateIncidenceRepository.findOne({
            where: {
                payroll: {
                    id: idPayRoll
                },
            }
        });
    }

}
