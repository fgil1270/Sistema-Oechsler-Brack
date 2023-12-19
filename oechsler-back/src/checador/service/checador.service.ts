/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, Repository, Between, Double, Decimal128 } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateChecadaDto, UpdateChecadaDto } from '../dto/create-checada.dto';
import { Checador } from '../entities/checador.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';

@Injectable()
export class ChecadorService {
    constructor(
        @InjectRepository(Checador) private checadorRepository: Repository<Checador>,
        private readonly employeesService: EmployeesService,
        private readonly employeeShiftService: EmployeeShiftService,
        @Inject(forwardRef(() => EmployeeIncidenceService)) private employeeIncidenceService: EmployeeIncidenceService,
        private readonly incidenceCatalogueService: IncidenceCatologueService
    ){}

    async create(createChecadaDto: CreateChecadaDto){

        const date = format(new Date(createChecadaDto.startDate), 'yyyy-MM-dd');

        const employee = await this.employeesService.findOne(createChecadaDto.empleadoId);
        if(!employee){
            throw new NotFoundException(`Empleado no encontrado`);
        }

        const userCreate = await this.employeesService.findOne(createChecadaDto.createdBy);
        
        if(!userCreate){
            throw new NotFoundException(`Usuario no encontrado`);
        }
       
        const checada = await this.checadorRepository.create(
            {
                date: new Date(createChecadaDto.startDate + ' ' + createChecadaDto.startTime),
                employee: employee.emp,
                createdBy: userCreate.emp,
                numRegistroChecador: createChecadaDto.numRegistroChecador,
            }
        );
        
        //se valida que exista un comentario
        if(createChecadaDto.comment != ''){
            checada.comment = createChecadaDto.comment;
        }
        if(createChecadaDto.status != ''){
            checada.status = createChecadaDto.status;

        }

        const checadaSave = await this.checadorRepository.save(checada);

        return checada;     

              
    }

    async findAll(createChecadaDto: CreateChecadaDto){

    }

    //buscar registros de entrada y salida por ids de empleado y rango de fechas
    async findbyDate(id: any, start: any, end: any, hrEntrada: any, hrSalida: any){
        
        const checador = await this.checadorRepository.find( {
            where: { 
                employee: {
                    id: id,
                    employeeShift: {
                        start_date: format(new Date(start), 'yyyy-MM-dd') as any,
                    }
                },
                date: Between(format(new Date(start), `yyyy-MM-dd ${hrEntrada}`) as any, format(new Date(end), `yyyy-MM-dd ${hrSalida}`) as any)
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
        
        return checador;
    }

    


    async reportNomipaq(data: any){
        
        let tipoNomina = data.tipoEmpleado;
        const employees = await this.employeesService.findByNomina(tipoNomina);
        
        const from = format(new Date(data.startDate), 'yyyy-MM-dd 00:00:00');
        const to = format(new Date(data.endDate), 'yyyy-MM-dd 23:59:59'); 
        
        let registros = [];
        let diasGenerados = [];

        //se genera un arreglo con los dias entre el rango de fechas
        for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
            
            diasGenerados.push(
                format(x, 'yyyy-MM-dd')
            );
            
        }
        
        //se recorre el arreglo de empleados
        for (const iterator of employees.emps) {
            let eventDays = [];
            let totalHrsRequeridas = 0;
            let totalHrsTrabajadas = 0;
            let totalHrsTrabajadasyExtra = 0;
            let total
            let totalHrsExtra = 0;
            
            let i = 0;

            //se recorre el arreglo de dias generados
            for (var index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
                let dataDate = {
                    start: index,
                    end: index
                }
                
               
                const employeeShif = await this.employeeShiftService.findMore(dataDate, `${iterator.id}`);
                

                if(employeeShif.events.length == 0){
                    continue;
                }
                
                let hrEntrada = '00:00:00'; 
                let hrSalida = '23:59:00';
                let diaSiguente = new Date(index);
                let startTimeShift = moment(new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`), 'HH:mm');
                let endTimeShift = moment(new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`), 'HH:mm');
               
                if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T3') {
                    hrEntrada = '20:00:00';
                    hrSalida = '08:59:00';
                    diaSiguente.setDate(diaSiguente.getDate() + 1);
                    //let nextDay = format(diaSiguente, 'yyyy-MM-dd');
                    
                    //startTimeShift = moment(employeeShif.events[0]?.startTimeshift, 'HH:mm');
                    endTimeShift = moment(new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`), 'HH:mm').add(1, 'day');
                }

                //se obtiene la hora de inicio y fin del turno
                
                let diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
                totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;
                
                //se obtienen los registros del dia
                const registrosChecador = await this.checadorRepository.find({
                    where: { 
                        employee: {
                            id: iterator.id,
                            employeeShift: {
                                start_date: format(index, 'yyyy-MM-dd') as any,
                            }
                        },
                        date: Between(format(index, `yyyy-MM-dd ${hrEntrada}`) as any, format(diaSiguente, `yyyy-MM-dd ${hrSalida}`) as any)
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
                
                
                let firstDate = moment(new Date(registrosChecador[0]?.date));
                let secondDate = moment(new Date(registrosChecador[registrosChecador.length-1]?.date));
                
                let diffDate = secondDate.diff(firstDate, 'hours', true); 
                
                let calculoHrsExtra = 0;

                //se obtienen las incidencias del dia
                const incidencias = await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
                    start: format(index, 'yyyy-MM-dd 00:00:00') as any,
                    end: format(index, 'yyyy-MM-dd 23:59:00') as any,
                    ids: `${iterator.id}`
                });

                let incidenciaVac = false;
                let incidenciaPermiso = false;
                let incidenciaTiemExtra = false;
                let incidenciaFalta = false;
                let hrExtraDoble = 0;
                let hrExtraTripe = 0;
                let incidenceExtra = [];
                let mediaHoraExtra = 0.06;
                let sumaMediaHrExtra = 0;
                let hrsExtraIncidencias: any;
                
                const incidenceHrExtra = await this.incidenceCatalogueService.findName('Tiempo extra');
                const faltaInjustificada = await this.incidenceCatalogueService.findName('Falta injustificada');
                for (let index = 0; index < incidencias.length; index++) {
                    if(incidencias[index].code == 'Vac'){
                        incidenciaVac = true;
                    }
                    //validar que exista tiempo extra
                    if(incidencias[index].code == 'TE'){
                        incidenciaTiemExtra = true;
                        hrsExtraIncidencias = incidencias[index].total_hour;
                    }

                    
                }
                
                //si existe incidencia de vacaciones se toma como hrs trabajadas
                if(incidenciaVac){
                    diffDate = diffTimeShift;
                }
                
                //falta injustificada
                if(registrosChecador.length == 0 && incidencias.length == 0){
                    incidenciaFalta = true;
                    incidenceExtra.push(`1` + faltaInjustificada.code_band);

                }
                
                //tiempo extra para el turno 3
                if(diffDate >= diffTimeShift && employeeShif.events[0]?.nameShift == 'T3' && incidencias.length <= 0){
                    incidenceExtra.push(`${mediaHoraExtra}` + incidenceHrExtra.code_band + '2');
                    sumaMediaHrExtra += mediaHoraExtra;
                    totalHrsExtra +=  sumaMediaHrExtra;
                    
                }

                //se calcula las horas trabajadas y hrs extra
                calculoHrsExtra += (diffDate - diffTimeShift) <= 0 ?  0: (diffDate - diffTimeShift);
               
                //se valida si calculo de horas extra es mayor a 0 y si existe incidencia de tiempo extra
                if(calculoHrsExtra >= 0 && incidenciaTiemExtra){

                    //se valida si el calculo de horas extra es mayor a las horas extra de las incidencias
                    if(calculoHrsExtra > hrsExtraIncidencias){
                        totalHrsExtra = hrsExtraIncidencias+totalHrsExtra;
                        calculoHrsExtra = hrsExtraIncidencias;
                    }

                    //se valida si las hrs extra dobles y triples
                    if(calculoHrsExtra > 3){
                        hrExtraTripe = calculoHrsExtra - 3;
                        hrExtraDoble = 3;
                    }else{
                        hrExtraDoble = calculoHrsExtra;
                    }

                    if(hrExtraTripe > 0){
                        incidenceExtra.push(`${moment.utc(hrExtraDoble*60*60*1000).format('H.mm')}` + incidenceHrExtra.code_band + '2');
                        incidenceExtra.push(`${moment.utc(hrExtraTripe*60*60*1000).format('H.mm')}` + incidenceHrExtra.code_band + '3');
                    }else{
                        incidenceExtra.push(`${moment.utc(hrExtraDoble*60*60*1000).format('H.mm')}` + incidenceHrExtra.code_band + '2');
                    }

                    
                    
                }
                
                
                totalHrsTrabajadas += diffDate >= 0? diffDate : 0;

                eventDays.push({
                    date: format(index, 'yyyy-MM-dd'),
                    incidencia: {extra: incidenceExtra, incidencias: incidencias},
                    employeeShift: employeeShif.events[0]?.nameShift,
                });

                i++;
                
                
                 
            }

            totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;
            totalHrsTrabajadasyExtra = totalHrsTrabajadas + totalHrsExtra
            
            registros.push({
                idEmpleado: iterator.id,
                numeroNomina: iterator.employee_number,
                nombre: iterator.name+' '+iterator.paternal_surname+' '+iterator.maternal_surname,
                tipo_nomina: iterator.payRoll.name,
                perfile: iterator.employeeProfile.name,
                date: eventDays,
                horasEsperadas: totalHrsRequeridas.toFixed(2),
                horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                horasTrabajadasyExtra: totalHrsTrabajadasyExtra.toFixed(2),
                horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('H.mm'),
                //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
            });
            
            registros.concat(eventDays);
            
        }

        return {
            registros,
            diasGenerados};


    }

    async update(data: UpdateChecadaDto, id: number){
        const checada = await this.checadorRepository.findOne({
            where: {
                id: id,
            }
        });

        if(!checada){
            throw new NotFoundException(`Registro de Entrada o Salida no encontrado`);
        }
        const createdBy = await this.employeesService.findOne(data.createdBy);

        if(data.startDate != ''){
            checada.date = new Date(data.startDate + ' ' + data.startTime);
        }
        
        checada.comment = data.comment != '' ? data.comment : null;
        checada.status = data.status; 
        checada.createdBy = createdBy.emp;

        return await this.checadorRepository.save(checada);
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
