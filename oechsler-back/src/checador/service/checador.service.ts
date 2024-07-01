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
import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  Between,
  Double,
  Decimal128,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateChecadaDto, UpdateChecadaDto } from '../dto/create-checada.dto';
import { Checador } from '../entities/checador.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { CalendarService } from '../../calendar/service/calendar.service';
import { hr, is } from 'date-fns/locale';

@Injectable()
export class ChecadorService {
  constructor(
    @InjectRepository(Checador)
    private checadorRepository: Repository<Checador>,
    private readonly employeesService: EmployeesService,
    private readonly employeeShiftService: EmployeeShiftService,
    @Inject(forwardRef(() => EmployeeIncidenceService))
    private employeeIncidenceService: EmployeeIncidenceService,
    private readonly incidenceCatalogueService: IncidenceCatologueService,
    private readonly calendarService: CalendarService,
  ) {}

  async create(createChecadaDto: CreateChecadaDto) {
    const date = format(new Date(createChecadaDto.startDate), 'yyyy-MM-dd');

    const employee = await this.employeesService.findOne(
      createChecadaDto.empleadoId,
    );
    if (!employee) {
      throw new NotFoundException(`Empleado no encontrado`);
    }

    const userCreate = await this.employeesService.findOne(
      createChecadaDto.createdBy,
    );

    if (!userCreate) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    const checada = await this.checadorRepository.create({
      date: new Date(
        createChecadaDto.startDate + ' ' + createChecadaDto.startTime,
      ),
      employee: employee.emp,
      createdBy: userCreate.emp,
      numRegistroChecador: createChecadaDto.numRegistroChecador,
    });

    //se valida que exista un comentario
    if (createChecadaDto.comment != '') {
      checada.comment = createChecadaDto.comment;
    }
    if (createChecadaDto.status != '') {
      checada.status = createChecadaDto.status;
    }

    const checadaSave = await this.checadorRepository.save(checada);

    return checada;
  }

  async findAll(createChecadaDto: CreateChecadaDto) {}

  //buscar registros de entrada y salida por ids de empleado y rango de fechas
  async findbyDate(
    id: any,
    start: any,
    end: any,
    hrEntrada: any,
    hrSalida: any,
  ) {
    const checador = await this.checadorRepository.find({
      where: {
        employee: {
          id: id,
          employeeShift: {
            start_date: format(new Date(start), 'yyyy-MM-dd') as any,
          },
        },
        date: Between(
          format(new Date(start), `yyyy-MM-dd ${hrEntrada}`) as any,
          format(new Date(end), `yyyy-MM-dd ${hrSalida}`) as any,
        ),
      },
      relations: {
        employee: {
          employeeShift: {
            shift: true,
          },
          employeeProfile: true,
        },
      },
      order: {
        date: 'ASC',
      },
    });

    return checador;
  }

  //reporte Nomipaq
  async reportNomipaq(data: any) {
    const tipoNomina = data.tipoEmpleado;
    const employees = await this.employeesService.findByNomina(tipoNomina);

    const from = format(new Date(data.startDate), 'yyyy-MM-dd 00:00:00');
    const to = format(new Date(data.endDate), 'yyyy-MM-dd 23:59:59');

    const registros = [];
    const diasGenerados = [];

    //se genera un arreglo con los dias entre el rango de fechas
    for (
      let x = new Date(from);
      x <= new Date(to);
      x = new Date(x.setDate(x.getDate() + 1))
    ) {
      diasGenerados.push(format(x, 'yyyy-MM-dd'));
    }

    //se recorre el arreglo de empleados
    for (const iterator of employees.emps) {
      const eventDays = [];
      let totalHrsRequeridas = 0;
      let totalMinRequeridos = 0;
      let totalHrsTrabajadas = 0;
      let totalMinTrabajados = 0;
      let totalHrsTrabajadasyExtra = 0;
      let total;
      let totalHrsExtra = 0;
      let isIncidenceIncapacidad = false;

      //let i = 0;

      //se recorre el arreglo de dias generados
      for (let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
        const dataDate = {
          start: index,
          end: index,
        };
        let incidenciaVac = false;
        let incidenciaPCS = false;
        const incidenciaPermiso = false;
        let incidenciaTiemExtra = false;
        let incidenciaFalta = false;
        let hrExtraDoble = 0;
        let hrExtraTripe = 0;
        const incidenceExtra = [];
        const mediaHoraExtra = 0.06;
        let sumaMediaHrExtra = 0;
        let hrsExtraIncidencias = 0;

        const employeeShif = await this.employeeShiftService.findMore(
          dataDate,
          [iterator.id],
        );
        const incidenceIncapacidad = await this.incidenceCatalogueService.findByCodeBand('INC');

        
        
        //si en la fecha el empleado no tiene turno se continua con el siguiente dia
        if (employeeShif.events.length == 0) {
          //si es incapacidad tambien se ponen los dias sin turno
          if(isIncidenceIncapacidad){
            incidenceExtra.push(`1` + incidenceIncapacidad.code_band);
          }
          
        }else{
          //se obtienen las incidencias del dia
          //y que no sean de tiempo extra
          const incidenciasNormales =
          await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
            start: format(index, 'yyyy-MM-dd 00:00:00') as any,
            end: format(index, 'yyyy-MM-dd 23:59:00') as any,
            ids: [iterator.id],
            code: ['VAC', 'PCS', 'PSS', 'HDS', 'CAST', 'FINJ', 'INC', 'DFT', 'PRTC', 'DOM', 'VACA', 'HE', 'HET', 'TXT'],
            status: ['Autorizada']
          });
          
          const iniciaTurno = new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`);
          const termianTurno = new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`);
          
          if(employeeShif.events[0]?.nameShift == 'T3'){
            termianTurno.setDate(termianTurno.getDate() + 1)
          }
          
          const startTimeShift = moment(iniciaTurno, 'HH:mm');
          let endTimeShift = moment(termianTurno, 'HH:mm');

          //se obtiene la hora de inicio y fin del turno
          const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
          const hourShift = endTimeShift.diff(startTimeShift, 'hours');
          const minShift = endTimeShift.diff(startTimeShift, 'minutes');
          totalHrsRequeridas += hourShift;
          totalMinRequeridos += Number(minShift) % 60;

          const incidenceHrExtra = await this.incidenceCatalogueService.findByCodeBand('HE');
          const faltaInjustificada = await this.incidenceCatalogueService.findByCodeBand('FINJ');
            

          //se recorre el arreglo de incidencias
          for (let index = 0; index < incidenciasNormales.length; index++) {
            const findIncidence = await this.employeeIncidenceService.findOne(incidenciasNormales[index].incidenceId);
            if (incidenciasNormales[index].codeBand == 'VAC' || incidenciasNormales[index].codeBand == 'VACA' || incidenciasNormales[index].codeBand == 'VacM') {
              incidenciaVac = true;
              totalHrsTrabajadas += hourShift;
              totalMinTrabajados += Number(minShift) % 60;
              
            }
            if(incidenciasNormales[index].codeBand != 'HE' && incidenciasNormales[index].codeBand != 'HET' && incidenciasNormales[index].codeBand != 'TxT'){
              if(incidenciasNormales[index].codeBand == 'INC'){
                isIncidenceIncapacidad = true;
              }else{  
                isIncidenceIncapacidad = false;
              }
              incidenceExtra.push(`1` + incidenciasNormales[index].codeBand);
            }
            //validar que exista tiempo extra
            if (incidenciasNormales[index].codeBand == 'HE' || incidenciasNormales[index].codeBand == 'HET') {
              incidenciaTiemExtra = true;
              hrsExtraIncidencias += Number(incidenciasNormales[index].total_hour);
            }

          
            if (incidenciasNormales[index].codeBand == 'PCS') {
                totalHrsTrabajadas += (Number(incidenciasNormales[index].total_hour) / Number(findIncidence.dateEmployeeIncidence.length));
                
            }
            

          }



          //se verifica si el dia seleccionado es festivo
          const dayCalendar = await this.calendarService.findByDate(index as any);

          if (dayCalendar) {
            if (dayCalendar.holiday) {
              const horasPerfile = iterator.employeeProfile.work_shift_hrs;
              totalHrsTrabajadas += horasPerfile;
            }
          }

          //se obtienen las checadas del dia
          let hrEntrada = '00:00:00';
          let hrSalida = '23:59:00';
          const x = new Date(index);
          let diahoy = new Date(index);
          let diaSiguente = new Date(index);
          

          //si el turno es 3 se suma un dia
          if(employeeShif.events[0]?.nameShift == 'T1'){
            hrEntrada= '05:00:00';
            hrSalida = '15:59:00';
          }else if(employeeShif.events[0]?.nameShift == 'T2'){
            hrEntrada= '13:00:00';
            hrSalida = '21:59:00';
          }else if(employeeShif.events[0]?.nameShift == 'T3'){
            hrEntrada= '20:00:00';
            hrSalida = '06:59:00';
            diaSiguente.setDate(diaSiguente.getDate() + 1);
          }else if(employeeShif.events[0]?.nameShift == 'T4'){
            hrEntrada= '05:00:00';
            hrSalida = '15:59:00';
          }

          //se recorre el arreglo de incidencias para verificar si existe un tiempo extra
          for (let index = 0; index < incidenciasNormales.length; index++) {
            
            if(incidenciasNormales[index].codeBand == 'HE' || incidenciasNormales[index].codeBand == 'HET' || incidenciasNormales[index].codeBand == 'TxT'){
              
              //si es turno 1
              if ( employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T1'){

                
                if(incidenciasNormales[index].shift == 2 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '19:59:00';

                }else if(incidenciasNormales[index].shift == 3){
                  hrEntrada = '18:00:00';
                  hrSalida = '06:59:00';
                  diahoy.setDate(diahoy.getDate() - 1);
                }
              }else if(employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T2'){
                
                if(incidenciasNormales[index].shift == 1 ){
                  hrEntrada = '05:00:00';
                  hrSalida = '19:59:00';

                }else if(incidenciasNormales[index].shift == 3){
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente.setDate(diahoy.getDate() + 1);
                }
              }else if(employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T3'){
                
                if(incidenciasNormales[index].shift == 1 ){
                  hrEntrada = '20:00:00';
                  hrSalida = '14:59:00';
                  diaSiguente.setDate(diahoy.getDate() + 1);
                }else if(incidenciasNormales[index].shift == 2){
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente.setDate(diaSiguente.getDate() + 1);
                }
              }
            }

            
          }

          //se obtienen los registros del dia
          const registrosChecador = await this.checadorRepository.find({
            where: {
              employee: {
                id: iterator.id,
                employeeShift: {
                  start_date: format(index, 'yyyy-MM-dd') as any,
                },
              },
              date: Between(
                format(diahoy, `yyyy-MM-dd ${hrEntrada}`) as any,
                format(diaSiguente, `yyyy-MM-dd ${hrSalida}`) as any,
              ),
            },
            relations: {
              employee: {
                employeeShift: {
                  shift: true,
                },
                employeeProfile: true,
              },
            },
            order: {
              date: 'ASC',
            },
          });
          
          //si existen checadas
          if(registrosChecador.length){
            isIncidenceIncapacidad = false;
          }
          //falta injustificada
          //si no existen checadas
          //si no existen incidencias
          //si el dia no es festivo
          //si existe turno
          if (registrosChecador.length == 0 && incidenciasNormales.length == 0 && !dayCalendar && employeeShif.events.length >0) {
            incidenciaFalta = true;
            isIncidenceIncapacidad = false;
            incidenceExtra.push(`1` + faltaInjustificada.code_band);
          }

          //se obtiene la diferencia de horas trabajadas
          //de la entra y salida del empleado
          const firstDate = moment(new Date(registrosChecador[0]?.date));
          const secondDate = moment(new Date(registrosChecador[registrosChecador.length - 1]?.date));
          let diffDate = secondDate.diff(firstDate, 'hours', true);

          let diffDatehour = secondDate.diff(firstDate, 'hours');
          let diffDatemin = secondDate.diff(firstDate, 'minutes');
          //se obtiene la diferencia en milisegundos
          let horasDia = Number(diffDatehour);
          let minsDia = Number(diffDatemin) % 60;
          let modMin = 0;
          let divMin = 0;
          

          let calculoHrsExtra = 0;
          let calculoMinExtra = 0;

          //tiempo extra para el turno 3
          //diffDate >= diffTimeShift 
          if (registrosChecador.length > 0 && employeeShif.events[0]?.nameShift == 'T3' && incidenciasNormales.length <= 0) {
            incidenceExtra.push(`${mediaHoraExtra}` + incidenceHrExtra.code_band + '2');
            sumaMediaHrExtra += Number(mediaHoraExtra);
            totalHrsExtra += sumaMediaHrExtra;
          }
          

          //se calcula las horas trabajadas y hrs extra
          calculoHrsExtra += diffDate - diffTimeShift <= 0 ? 0 : diffDate - diffTimeShift;
          let newHrExtra= 0;
          calculoMinExtra += minsDia - (Number(minShift) % 60);

          //se valida si calculo de horas extra es mayor a 0 y si existe incidencia de tiempo extra
          if (calculoHrsExtra >= 0 && incidenciaTiemExtra) {
            //se valida si el calculo de horas extra es mayor a las horas extra de las incidencias
            if (calculoHrsExtra > hrsExtraIncidencias) {
              totalHrsExtra = hrsExtraIncidencias + totalHrsExtra;
              calculoHrsExtra = hrsExtraIncidencias;
            }

            //se valida si las hrs extra dobles y triples
            if (calculoHrsExtra > 3) {
              hrExtraTripe = Number(moment(calculoHrsExtra.toString(),"LT").hours()+'.'+moment(calculoHrsExtra.toString(),"LT").minutes()) - 3;
              hrExtraDoble = 3;
              totalHrsExtra += hrExtraTripe + hrExtraDoble;
            } else {
              hrExtraDoble = Number(moment(calculoHrsExtra.toString(),"LT").hours()+'.'+moment(calculoHrsExtra.toString(),"LT").minutes());
              totalHrsExtra += hrExtraDoble;
            }

            if (hrExtraTripe > 0) {
              incidenceExtra.push(`${moment.utc(hrExtraDoble * 60 * 60 * 1000).format('H.mm')}` + incidenceHrExtra.code_band + '2');
              incidenceExtra.push(`${moment.utc(hrExtraTripe * 60 * 60 * 1000).format('H.mm')}` + incidenceHrExtra.code_band + '3');
            } else {
              incidenceExtra.push(`${moment(hrExtraDoble.toString(),"LT").hours()+'.'+moment(hrExtraDoble.toString(),"LT").minutes()}` + incidenceHrExtra.code_band + '2');
            }
          }

          //se realiza la suma de las horas trabajadas
          totalHrsTrabajadas += diffDate >= 0 ? diffDate : 0;

        }

        eventDays.push({
          date: format(index, 'yyyy-MM-dd'),
          incidencia: { extra: incidenceExtra},
          employeeShift: employeeShif.events[0]?.nameShift,
        });

        //i++;
      }

      totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;
      totalHrsTrabajadasyExtra = totalHrsTrabajadas + totalHrsExtra;

      registros.push({
        idEmpleado: iterator.id,
        numeroNomina: iterator.employee_number,
        nombre: iterator.name + ' ' + iterator.paternal_surname + ' ' + iterator.maternal_surname,
        tipo_nomina: iterator.payRoll.name,
        perfile: iterator.employeeProfile.name,
        date: eventDays,
        horasEsperadas: totalHrsRequeridas + '.' +moment().minutes(totalMinRequeridos).format('mm'),
        horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
        horasTrabajadasyExtra: totalHrsTrabajadasyExtra.toFixed(2),
        horasExtra: totalHrsExtra ,
        //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
      });
      

      registros.concat(eventDays);
    }

    return {
      registros,
      diasGenerados,
    };
  }

  async update(data: UpdateChecadaDto, id: number) {
    const checada = await this.checadorRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!checada) {
      throw new NotFoundException(`Registro de Entrada o Salida no encontrado`);
    }
    const createdBy = await this.employeesService.findOne(data.createdBy);

    if (data.startDate != '') {
      checada.date = new Date(data.startDate + ' ' + data.startTime);
    }

    checada.comment = data.comment != '' ? data.comment : null;
    checada.status = data.status;
    checada.createdBy = createdBy.emp;

    return await this.checadorRepository.save(checada);
  }

  async remove(id: number) {
    const checada = await this.checadorRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!checada) {
      throw new NotFoundException(`Registro de Entrada o Salida no encontrado`);
    }

    return await this.checadorRepository.remove(checada);
  }
}
