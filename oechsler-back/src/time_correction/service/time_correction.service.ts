import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as moment from 'moment';

import { TimeCorrection } from '../entities/time_correction.entity';
import { CreateTimeCorrectionDto } from '../dto/create-time-correction.dto';
import { EmployeeIncidence } from '../../employee_incidence/entities/employee_incidence.entity';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { ChecadorService } from '../../checador/service/checador.service';
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { CalendarService } from '../../calendar/service/calendar.service';

import { read } from 'xlsx';

@Injectable()
export class TimeCorrectionService {
  constructor(
    @InjectRepository(TimeCorrection)
    private timeCorrectionRepository: Repository<TimeCorrection>,
    @InjectRepository(EmployeeIncidence)
    private employeeIncidenceRepository: Repository<EmployeeIncidence>,
    private readonly employeeIncidenceService: EmployeeIncidenceService,
    private readonly employeeShiftService: EmployeeShiftService,
    private readonly employeesService: EmployeesService,
    private readonly checadorService: ChecadorService,
    private readonly incidenceCatalogueService: IncidenceCatologueService,
    private readonly organigramaService: OrganigramaService,
    private readonly calendarService: CalendarService,
  ) {}

  async create(data: CreateTimeCorrectionDto) {
    const emp = await this.employeesService.findOne(data.id_employee);
    const createdBy = await this.employeesService.findOne(data.created_by);

    const correction = await this.timeCorrectionRepository.findOne({
      relations: {
        employee: true,
        created_by: true,
      },
      where: {
        date: format(new Date(data.date), 'yyyy-MM-dd') as any,
        employee: {
          id: emp.emp.id,
        },
      },
    });

    if (correction) {
      throw new NotFoundException(`Ya existe una corrección para esta fecha`);
    }
    const createCorrection = await this.timeCorrectionRepository.create({
      date: data.date,
      approved: data.approved,
      comment: data.comment,
      employee: emp.emp,
      created_by: createdBy.emp,
    });

    return await this.timeCorrectionRepository.save(createCorrection);
  }

  //reporte correccion de tiempo
  async find(data: any, user: any) {
    const tipoNomina = data.tipoEmpleado;
    const isAdmin = user.roles.some(
      (role) => role.name === 'Admin' || role.name === 'RH',
    );

    const isJefeTurno = user.roles.some(
      (role) => role.name === 'Jefe de turno',
    );

    let organigrama = await this.organigramaService.findJerarquia(
      {
        type: data.type,
        startDate: '',
        endDate: '',
      },
      user,
    );

    //si es distinto a admin se filtra el organigrama y se quita al usuario logueado
    if (!isAdmin) {
      organigrama = organigrama.filter((item) => item.id != user.idEmployee);
    }

    //return organigrama;

    let query = `SELECT * FROM employee AS e
        INNER JOIN organigrama AS o ON e.id = o.employeeId
        WHERE o.leaderId = ${user.idEmployee}`;

    //si es administrador
    if (isAdmin) {
      query = `
            SELECT * FROM employee
            `;
    }

    //si es jefe de turno
    if (isJefeTurno) {
      query = `
            SELECT * FROM employee AS e
            INNER JOIN job AS j ON e.jobId = j.id
            WHERE j.shift_leader = 1 
            UNION
            SELECT * FROM employee AS e
            INNER JOIN organigrama AS o ON e.id = o.employeeId
            WHERE o.leaderId = ${user.idEmployee}
            `;
    }

    //const employees = await this.employeesService.findByNomina(tipoNomina);
    const registros = [];
    const diasGenerados = [];
    let empleados = [];
    // Perform a union operation using a raw query

    const results = await this.timeCorrectionRepository.query(query);

    // Combine the results into a single array
    empleados = [...empleados, ...results];

    const from = format(new Date(data.fecha_inicio), 'yyyy-MM-dd 00:00:00');
    const to = format(new Date(data.fecha_fin), 'yyyy-MM-dd 23:59:59');

    //se genera un arreglo con los dias entre el rango de fechas
    for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
      diasGenerados.push(format(x, 'yyyy-MM-dd'));
    }

    //se recorre el arreglo de empleados
    //employees.emps
    let i = 0;
    for (const iterator of organigrama) {
      const eventDays = [];
      let totalHrsRequeridas = 0;
      let totalHrsTrabajadas = 0;
      const totalHrsExtra = 0;

      //se recorre el arreglo de dias generados
      for ( let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
        const dataDate = {
          start: index,
          end: index,
        };

        const searchTimeCorrection =
          await this.timeCorrectionRepository.findOne({
            where: {
              date: format(index, 'yyyy-MM-dd') as any,
              employee: {
                id: iterator.id,
              },
            },
        });

        
        //se verifica si el dia es festivo
        const dayCalendar = await this.calendarService.findByDate(index as any);

        if (dayCalendar) {
          if (dayCalendar.holiday) {
            continue;
          }
        }

        if (searchTimeCorrection) {
          continue;
        }

        const nowDate = new Date(index);
        const employeeShif = await this.employeeShiftService.findMore(
          dataDate,
          [iterator.id],
        );

        //se obtienen las incidencias del dia
        //si existe alguna de las siguientes no mostrara en el reporte
        const incidencias = await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
          start: format(index, 'yyyy-MM-dd 00:00:00') as any,
          end: format(index, 'yyyy-MM-dd 23:59:00') as any,
          status: ['Autorizada'],
          ids: [`${iterator.id}`],
          code_band: ['VAC', 'PSTP', 'PETP', 'PSTL', 'PCS', 'PETL', 'PSS', 'HDS', 'CAST', 'FINJ', 'HE', 'INC', 
            'DFT', 'VacM', 'Sind', 'PRTC', 'DOM', 'VACA', 'HO', 'HET'
          ],
        });
        
        if (employeeShif.events.length == 0) {
          continue;
        }

        if (incidencias.length > 0) {
          
          continue;
        }

        const turnoActual = employeeShif.events[0]?.nameShift;
        let hrEntrada = '00:00:00';
        let hrSalida = '23:59:00';
        let diaAnterior;
        let diaSiguente;

        const dataDateAnterior = {
          start: new Date(nowDate.setDate(nowDate.getDate() - 1)),
          end: new Date(nowDate.setDate(nowDate.getDate() - 1)),
        };
        const dataDateSiguiente = {
          start: new Date(nowDate.setDate(nowDate.getDate() + 1)),
          end: new Date(nowDate.setDate(nowDate.getDate() + 1)),
        };

        const employeeShifAnterior = await this.employeeShiftService.findMore(
          dataDateAnterior,
          `${iterator.id}`,
        );
        const employeeShifSiguiente = await this.employeeShiftService.findMore(
          dataDateSiguiente,
          `${iterator.id}`,
        );
        const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
        const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;

        //turno actual es igual al turno del dia anterior
        if (turnoActual == turnoAnterior) {
          //turno actual es igual al turno del dia siguiente
          if (turnoActual == turnoSiguiente) {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T2':
                hrEntrada = '05:00:00'; //dia Actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '15:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T4':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T12-2':
                hrEntrada = '09:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
            }
          } else {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '15:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T2':
                hrEntrada = '05:00:00'; //dia Actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T4':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '15:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
            }
          }
        } else {
          switch (turnoActual) {
            case 'T1':
              hrEntrada = '03:00:00'; //dia anterior
              hrSalida = '16:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T2':
              hrEntrada = '11:00:00'; //dia Actual
              hrSalida = '23:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T3':
              hrEntrada = '20:00:00'; //dia actual
              hrSalida = '08:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
              break;
            case 'MIX':
              hrEntrada = '03:00:00'; //dia actual
              hrSalida = '22:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'TI':
              hrEntrada = '02:00:00'; //dia actual
              hrSalida = '23:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T4':
              hrEntrada = '03:00:00'; //dia anterior
              hrSalida = '16:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
            case 'T12-2':
              hrEntrada = '14:00:00'; //dia anterior
              hrSalida = '08:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
              break;
          }
        }

        const registrosChecadorNuevo = await this.checadorService.findbyDate(
          iterator.id,
          diaAnterior,
          diaSiguente,
          hrEntrada,
          hrSalida,
        );
        
        

        //se verifica si el dia anterior para el turno 1 es el mismo turno
        //se toman los horarios de entra del segundo Turno pero si son distintos
        //se toma el horario del primer turno

        //diaSiguente = new Date(index);

        /*  if(iterator.id == 1907){
                    
                    let diaUno =moment(new Date('2023-10-09 21:30:00'), 'HH:mm:ss');
                    let diaUnoFin =moment(new Date('2023-10-10 06:59:59'), 'HH:mm:ss');
                    let diaDos =moment('2023-10-09T00:00:00', 'HH:mm:ss');
                    let diaDosFin =moment('2023-10-09T06:00:00', 'HH:mm:ss');
                   
                } */

        /*  if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T3') {
                    hrEntrada = '20:00:00';
                    hrSalida = '08:59:00';
                    diaSiguente.setDate(diaSiguente.getDate() + 1);
                    //let nextDay = format(diaSiguente, 'yyyy-MM-dd');
                    
                    //startTimeShift = moment(employeeShif.events[0]?.startTimeshift, 'HH:mm');
                    endTimeShift = moment(new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`), 'HH:mm').add(1, 'day');
                } */

        //se obtiene la hora de inicio y fin del turno
        let startTimeShift;
        let endTimeShift;
        if (turnoActual != 'T3') {
          startTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
            ),
            'HH:mm',
          );
          endTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`,
            ),
            'HH:mm',
          );
        } else {
          startTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
            ),
            'HH:mm',
          );
          endTimeShift = moment(
            new Date(
              `${format(diaSiguente, 'yyyy-MM-dd')} ${
                employeeShif.events[0]?.endTimeshift
              }`,
            ),
            'HH:mm',
          );
        }

        const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
        totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;

        //se obtienen los registros del dia
        //const registrosChecador = await this.checadorService.findbyDate(iterator.id, diaAnterior, diaSiguente, hrEntrada, hrSalida);

        const firstDate = moment(new Date(registrosChecadorNuevo[0]?.date));
        const secondDate = moment(new Date(registrosChecadorNuevo[registrosChecadorNuevo.length - 1]?.date));
        let diffDate = secondDate.diff(firstDate, 'hours', true);
        let calculoHrsExtra = 0;
        const incidenciaVac = false;

        const hours = Math.floor(diffDate);
        const minutes = (diffDate - hours) * 60;

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes); 


        //si el total de horas registradas es menor al total de horas por dia -3
        //o el total de horas registradas es mayor al total de horas por dia +3
        //muestra los datos
        if (diffDate >= diffTimeShift - 3 && diffDate <= diffTimeShift + 3) {
          continue;
        }

        const horas_realizadas = date.toTimeString().split(' ')[0].split(':');

        registros.push({
          id: i,
          id_empleado: iterator.id,
          employee_number: iterator.employee_number,
          nombre: iterator.name + ' ' + iterator.paternal_surname + ' ' + iterator.maternal_surname,
          date: format(index, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }),
          turno: employeeShif.events[0]?.nameShift,
          hora_inicio: startTimeShift.format('HH:mm'),
          hora_fin: endTimeShift.format('HH:mm'),
          hora_inicio_reloj: firstDate.format('HH:mm'),
          hora_fin_reloj: secondDate.format('HH:mm'),
          horas_esperadas: moment(diffTimeShift, 'HH:mm').format('HH:mm'),
          horas_realizadas:
            diffDate >= 0 ? horas_realizadas[0] + ':' + horas_realizadas[1] : 0,
          suma_hrs: diffTimeShift + 2,
          comments: '',
          checadas: registrosChecadorNuevo,

          /* horasEsperadas: totalHrsRequeridas.toFixed(2),
                    horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                    convertir: moment.utc(totalHrsTrabajadas*168*24*60*60*1000).format('HH:mm'),
                    horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('H.mm'), */
          //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
        });

        //si existe incidencia de vacaciones se toma como hrs trabajadas
        if (incidenciaVac) {
          diffDate = diffTimeShift;
        }

        //se calcula las horas trabajadas y hrs extra
        calculoHrsExtra +=
          diffDate - diffTimeShift <= 0 ? 0 : diffDate - diffTimeShift;

        totalHrsTrabajadas += diffDate >= 0 ? diffDate : 0;

        /* eventDays.push({
                    date: format(index, 'yyyy-MM-dd'),
                    incidencia: {extra: incidenceExtra, incidencias: incidencias},
                    employeeShift: employeeShif.events[0]?.nameShift,
                }); */

        i++;
      }

      totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;

      /* registros.push({
                idEmpleado: iterator.id,
                numeroNomina: iterator.employee_number,
                nombre: iterator.name+' '+iterator.paternal_surname+' '+iterator.maternal_surname,
                tipo_nomina: iterator.payRoll.name,
                perfile: iterator.employeeProfile.name,
                date: eventDays,
                horasEsperadas: totalHrsRequeridas.toFixed(2),
                horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                convertir: moment.utc(totalHrsTrabajadas*168*24*60*60*1000).format('HH:mm'),
                horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('H.mm'),
                //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
            });
            
            registros.concat(eventDays); */
    }

    return {
      registros,
      diasGenerados,
    };
  }

  //Buscar checadas
  async findByEmployee(data: any, user: any) {

    //const employees = await this.employeesService.findByNomina(tipoNomina);
    const employees = await this.employeesService.findMore(
      data.employees.split(','),
    );
    const registros = [];
    const diasGenerados = [];
    const empleados = [];

    // Perform a union operation using a raw query

    /*  const results = await this.timeCorrectionRepository.query(query);

        // Combine the results into a single array
        empleados = [...empleados, ...results]; */

    const from = format(new Date(data.start), 'yyyy-MM-dd 00:00:00');
    const to = format(new Date(data.end), 'yyyy-MM-dd 23:59:59');

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
      let totalHrsTrabajadas = 0;
      const totalHrsExtra = 0;

      let i = 0;

      //se recorre el arreglo de dias generados
      for (
        let index = new Date(from);
        index <= new Date(to);
        index = new Date(index.setDate(index.getDate() + 1))
      ) {
        const dataDate = {
          start: index,
          end: index,
        };

        const nowDate = new Date(index);
        const employeeShif = await this.employeeShiftService.findMore(
          dataDate,
          [iterator.id],
        );

        //se obtienen las incidencias del dia
        const incidencias =
          await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
            start: format(index, 'yyyy-MM-dd 00:00:00') as any,
            end: format(index, 'yyyy-MM-dd 23:59:00') as any,
            ids: `${iterator.id}`,
            status: ['Autorizada'],
          });

        if (employeeShif.events.length == 0) {
          continue;
        }

        if (incidencias.length > 0) {
          //continue;
        }

        const turnoActual = employeeShif.events[0]?.nameShift;
        let hrEntrada = '00:00:00';
        let hrSalida = '23:59:00';
        let diaAnterior;
        let diaSiguente;

        const dataDateAnterior = {
          start: new Date(nowDate.setDate(nowDate.getDate() - 1)),
          end: new Date(nowDate.setDate(nowDate.getDate() - 1)),
        };
        const dataDateSiguiente = {
          start: new Date(nowDate.setDate(nowDate.getDate() + 1)),
          end: new Date(nowDate.setDate(nowDate.getDate() + 1)),
        };

        const employeeShifAnterior = await this.employeeShiftService.findMore(
          dataDateAnterior,
          `${iterator.id}`,
        );
        const employeeShifSiguiente = await this.employeeShiftService.findMore(
          dataDateSiguiente,
          `${iterator.id}`,
        );
        const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
        const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;

        //turno actual es igual al turno del dia anterior
        if (turnoActual == turnoAnterior) {
          //turno actual es igual al turno del dia siguiente
          if (turnoActual == turnoSiguiente) {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T2':
                hrEntrada = '05:00:00'; //dia Actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '15:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T4':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
                break;
            }
          } else {
            switch (turnoActual) {
              case 'T1':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '15:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T2':
                hrEntrada = '05:00:00'; //dia Actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T3':
                hrEntrada = '13:00:00'; //dia actual
                hrSalida = '07:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
                break;
              case 'MIX':
                hrEntrada = '03:00:00'; //dia actual
                hrSalida = '22:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'TI':
                hrEntrada = '02:00:00'; //dia actual
                hrSalida = '23:00:00'; //dia siguiente
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T4':
                hrEntrada = '21:00:00'; //dia anterior
                hrSalida = '15:00:00'; //dia actual
                diaAnterior = new Date(nowDate.setDate(nowDate.getDate() - 1));
                diaSiguente = new Date(index);
                break;
              case 'T12-1':
                hrEntrada = '03:00:00'; //dia anterior
                hrSalida = '22:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(index);
                break;
              case 'T12-2':
                hrEntrada = '12:00:00'; //dia anterior
                hrSalida = '08:00:00'; //dia actual
                diaAnterior = new Date(index);
                diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
                break;
            }
          }
        } else {
          switch (turnoActual) {
            case 'T1':
              hrEntrada = '03:00:00'; //dia anterior
              hrSalida = '16:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T2':
              hrEntrada = '11:00:00'; //dia Actual
              hrSalida = '23:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T3':
              hrEntrada = '20:00:00'; //dia actual
              hrSalida = '08:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(nowDate.setDate(nowDate.getDate() + 1));
              break;
            case 'MIX':
              hrEntrada = '03:00:00'; //dia actual
              hrSalida = '22:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'TI':
              hrEntrada = '02:00:00'; //dia actual
              hrSalida = '23:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T4':
              hrEntrada = '03:00:00'; //dia anterior
              hrSalida = '16:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T12-1':
              hrEntrada = '03:00:00'; //dia anterior
              hrSalida = '22:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
              break;
            case 'T12-2':
              hrEntrada = '12:00:00'; //dia anterior
              hrSalida = '08:00:00'; //dia actual
              diaAnterior = new Date(index);
              diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
              break;
          }
        }


        //se obtienen las checadas del turno
        const registrosChecadorNuevo = await this.checadorService.findbyDate(
          iterator.id,
          diaAnterior,
          diaSiguente,
          hrEntrada,
          hrSalida,
        );

        //se obtiene todas las checadas del dia
        const registrosToday = await this.checadorService.findbyDate(
          iterator.id,
          new Date(index),
          new Date(index),
          '00:00:00',
          '23:59:59',
        );
        //se verifica si el dia anterior para el turno 1 es el mismo turno
        //se toman los horarios de entra del segundo Turno pero si son distintos
        //se toma el horario del primer turno

        //diaSiguente = new Date(index);

        /*  if(iterator.id == 1907){
                    
                    let diaUno =moment(new Date('2023-10-09 21:30:00'), 'HH:mm:ss');
                    let diaUnoFin =moment(new Date('2023-10-10 06:59:59'), 'HH:mm:ss');
                    let diaDos =moment('2023-10-09T00:00:00', 'HH:mm:ss');
                    let diaDosFin =moment('2023-10-09T06:00:00', 'HH:mm:ss');
                    
                    
                } */

        /*  if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T3') {
                    hrEntrada = '20:00:00';
                    hrSalida = '08:59:00';
                    diaSiguente.setDate(diaSiguente.getDate() + 1);
                    //let nextDay = format(diaSiguente, 'yyyy-MM-dd');
                    
                    //startTimeShift = moment(employeeShif.events[0]?.startTimeshift, 'HH:mm');
                    endTimeShift = moment(new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`), 'HH:mm').add(1, 'day');
                } */

        //se obtiene la hora de inicio y fin del turno
        let startTimeShift;
        let endTimeShift;
        if (turnoActual != 'T3') {
          startTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
            ),
            'HH:mm',
          );
          endTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`,
            ),
            'HH:mm',
          );
        } else {
          startTimeShift = moment(
            new Date(
              `${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`,
            ),
            'HH:mm',
          );
          endTimeShift = moment(
            new Date(
              `${format(diaSiguente, 'yyyy-MM-dd')} ${
                employeeShif.events[0]?.endTimeshift
              }`,
            ),
            'HH:mm',
          );
        }

        const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
        totalHrsRequeridas += diffTimeShift >= 0 ? diffTimeShift : 0;

        const firstDate = moment(new Date(registrosChecadorNuevo[0]?.date));
        const secondDate = moment(
          new Date(
            registrosChecadorNuevo[registrosChecadorNuevo.length - 1]?.date,
          ),
        );
        let diffDate = secondDate.diff(firstDate, 'hours', true);
        let calculoHrsExtra = 0;
        const incidenciaVac = false;

        /* if(diffDate >= (diffTimeShift - 2) && diffDate <= (diffTimeShift + 2) ){
                    
                    continue;
                } */

        registros.push({
          id: iterator.id,
          employee_number: iterator.employee_number,
          nombre:
            iterator.name +
            ' ' +
            iterator.paternal_surname +
            ' ' +
            iterator.maternal_surname,
          date: format(index, 'yyyy-MM-dd'),
          turno: employeeShif.events[0]?.nameShift,
          hora_inicio: startTimeShift.format('HH:mm'),
          hora_fin: endTimeShift.format('HH:mm'),
          hora_inicio_reloj: firstDate.format('HH:mm'),
          hora_fin_reloj: secondDate.format('HH:mm'),
          horas_esperadas: moment(diffTimeShift, 'HH:mm').format('HH:mm'),
          horas_realizadas:
            diffDate >= 0 ? moment(diffDate, 'HH:mm').format('HH:mm') : 0,
          suma_hrs: diffTimeShift + 2,
          comments: '',
          checadas: turnoActual != 'T3' ? registrosToday : registrosChecadorNuevo,

          /* horasEsperadas: totalHrsRequeridas.toFixed(2),
                    horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                    convertir: moment.utc(totalHrsTrabajadas*168*24*60*60*1000).format('HH:mm'),
                    horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('H.mm'), */
          //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
        });

        //si existe incidencia de vacaciones se toma como hrs trabajadas
        if (incidenciaVac) {
          diffDate = diffTimeShift;
        }

        //se calcula las horas trabajadas y hrs extra
        calculoHrsExtra +=
          diffDate - diffTimeShift <= 0 ? 0 : diffDate - diffTimeShift;

        totalHrsTrabajadas += diffDate >= 0 ? diffDate : 0;

        /* eventDays.push({
                    date: format(index, 'yyyy-MM-dd'),
                    incidencia: {extra: incidenceExtra, incidencias: incidencias},
                    employeeShift: employeeShif.events[0]?.nameShift,
                }); */

        i++;
      }

      totalHrsTrabajadas = totalHrsTrabajadas - totalHrsExtra;

      /* registros.push({
                idEmpleado: iterator.id,
                numeroNomina: iterator.employee_number,
                nombre: iterator.name+' '+iterator.paternal_surname+' '+iterator.maternal_surname,
                tipo_nomina: iterator.payRoll.name,
                perfile: iterator.employeeProfile.name,
                date: eventDays,
                horasEsperadas: totalHrsRequeridas.toFixed(2),
                horasTrabajadas: totalHrsTrabajadas.toFixed(2), //total hrs trabajadas
                convertir: moment.utc(totalHrsTrabajadas*168*24*60*60*1000).format('HH:mm'),
                horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('H.mm'),
                //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
            });
            
            registros.concat(eventDays); */
    }

    return {
      registros,
      diasGenerados,
    };
  }

  async update() {}

  async delete() {}
}
