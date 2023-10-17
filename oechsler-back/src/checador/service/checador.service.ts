/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, Repository, Between } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateChecadaDto } from '../dto/create-checada.dto';
import { Checador } from '../entities/checador.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';

@Injectable()
export class ChecadorService {
    constructor(
        @InjectRepository(Checador) private checadorRepository: Repository<Checador>,
        private readonly employeesService: EmployeesService,
        private readonly employeeShiftService: EmployeeShiftService,
        private readonly employeeIncidenceService: EmployeeIncidenceService,
    ){}

    async create(createChecadaDto: CreateChecadaDto){

    }

    async findAll(createChecadaDto: CreateChecadaDto){

    }

    async reportNomipaq(data: any){

        const employees = await this.employeesService.findAll();
        console.log(data);
        const from = format(new Date(data.startDate), 'yyyy-MM-dd 00:00:00');
        const to = format(new Date(data.endDate), 'yyyy-MM-dd 23:59:59'); 
        console.log(from);
        console.log(to);
        let registros = [];
        let diasGenerados = [];

        for (let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
            
            diasGenerados.push(
                format(index, 'yyyy-MM-dd')
            );
            
        }
        
        for (const iterator of employees.emps) {
            let eventDays = [];
            let totalHrsRequeridas = 0;
            let totalHrsTrabajadas = 0;
            let totalHrsExtra = 0;
            for (let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
                let dataDate = {
                    start: index,
                    end: index
                }
                let i = 0;
                const employeeShif = await this.employeeShiftService.findMore(dataDate, `${iterator.id}`);
                //console.log('turno de empleado: ', employeeShif.events);
                //if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T1') {

                    //se obtiene la hora de inicio y fin del turno
                    let startTimeShift = moment(employeeShif.events[0]?.startTimeshift, 'HH:mm');
                    let endTimeShift = moment(employeeShif.events[0]?.endTimeshift, 'HH:mm');
                    let diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
                    totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;
                    //se obtienen los registros del dia
                    let registrosChecador = await this.checadorRepository.find({
                        where: { 
                            employee: {
                                id: iterator.id,
                                employeeShift: {
                                    start_date: format(index, 'yyyy-MM-dd') as any,
                                }
                            },
                            date: Between(format(index, 'yyyy-MM-dd 00:00:00') as any, format(index, 'yyyy-MM-dd 23:59:00') as any)
                        },
                        relations: {
                            employee: {
                                employeeShift: {
                                    shift: true
                                },
                                employeeProfile: true,
                            },
                        },
                        order: {
                            date: 'ASC'
                        } 
                    });
                    const incidencias = await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
                        start: format(index, 'yyyy-MM-dd 00:00:00') as any,
                        end: format(index, 'yyyy-MM-dd 23:59:00') as any,
                        ids: `${iterator.id}`
                    });

                    let firstDate = moment(registrosChecador[0]?.date);
                    let secondDate = moment(registrosChecador[registrosChecador.length-1]?.date);
                    let diffDate = secondDate.diff(firstDate, 'hours', true); 
                    let calculoHrsExtra = 0;
                    
                    eventDays.push({
                        date: format(index, 'yyyy-MM-dd'),
                        incidencia: incidencias,
                        employeeShift: employeeShif.events[0]?.nameShift,
                    });
                    
                    //se calcula las horas trabajadas y hrs extra
                    calculoHrsExtra = (diffDate - diffTimeShift) <= 0 ?  0: (diffDate - diffTimeShift);
                    totalHrsTrabajadas += diffDate;
                    totalHrsExtra += calculoHrsExtra >= 0 ? calculoHrsExtra : 0;

                //}
                
                 
            }
            
            registros.push({
                idEmpleado: iterator.id,
                nombre: iterator.name+' '+iterator.paternal_surname+' '+iterator.maternal_surname,
                tipo_nomina: iterator.payRoll.name,
                perfile: iterator.employeeProfile.name,
                date: eventDays,
                horasEsperadas: totalHrsRequeridas.toFixed(2),
                horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                convertir: moment.utc(totalHrsTrabajadas*168*24*60*60*1000).format('HH:mm'),
                horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
            });
            
            registros.concat(eventDays);
            
        }

        //console.log(registros);
        return {
            registros,
            diasGenerados};


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
            throw new NotFoundException(`Registro de Entrada o Salida no encontrado`);
        }

        return await this.checadorRepository.remove(checada);
    }
}
