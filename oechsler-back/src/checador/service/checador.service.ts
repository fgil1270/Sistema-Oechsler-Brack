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
  In
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { format, subDays, addDays } from 'date-fns';
import * as moment from 'moment';

import { CreateChecadaDto, UpdateChecadaDto, FindChecadaDto, NomipaqDto } from '../dto/create-checada.dto';
import { Checador } from '../entities/checador.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { EmployeeIncidenceService } from '../../employee_incidence/service/employee_incidence.service';
import { IncidenceCatologueService } from '../../incidence_catologue/service/incidence_catologue.service';
import { CalendarService } from '../../calendar/service/calendar.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { TimeCorrectionService } from '../../time_correction/service/time_correction.service';

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
    private readonly organigramaService: OrganigramaService,
    @Inject(forwardRef(() => TimeCorrectionService))
    private timeCorrectionService: TimeCorrectionService,
  ) { }

  async create(createChecadaDto: CreateChecadaDto, user: any) {
    const userLogin = await this.employeesService.findOne(user.idEmployee);

    const date = format(new Date(createChecadaDto.startDate), 'yyyy-MM-dd');

    const employee = await this.employeesService.findOne(
      createChecadaDto.empleadoId,
    );
    if (!employee) {
      throw new NotFoundException(`Empleado no encontrado`);
    }

    if (userLogin.emp.id == employee.emp.id) {
      createChecadaDto.status = 'Pendiente';

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

  async findAll(createChecadaDto: CreateChecadaDto) { }

  //buscar registros de entrada y salida por ids de empleado y rango de fechas
  async findbyDate(id: any, start: any, end: any, hrEntrada: any, hrSalida: any) {

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
        recordDevice: true,
      },
      order: {
        date: 'ASC',
      },
    });

    return checador;
  }

  //buscar registros de entrada y salida y rango de fechas
  async findbyDateOrganigrama(data: FindChecadaDto, user: any) {

    //se obtienen los empleados por organigrama

    const organigrama = await this.organigramaService.findJerarquia(
      {
        type: data.type,
      },
      user
    );
    let arrayIdsEmployee = [];
    arrayIdsEmployee = organigrama.map((item) => item.id);

    //se obtienen las checadas por rango de fechas y ids de empleados
    let checador;
    if (arrayIdsEmployee.length == 0) return checador;
    try {
      checador = await this.checadorRepository.find({
        where: {
          employee: {
            id: In([arrayIdsEmployee]),
            /* employeeShift: {
              start_date: format(new Date(data.startDate), 'yyyy-MM-dd') as any,
            }, */
          },
          date: Between(
            format(new Date(data.startDate), `yyyy-MM-dd ${data.hrEntrada}`) as any,
            format(new Date(data.endDate), `yyyy-MM-dd ${data.hrSalida}`) as any,
          ),
          numRegistroChecador: data.numRegistroChecador.valueOf(),
          status: In(data.status)
        },
        relations: {
          employee: {
            employeeShift: {
              shift: true,
            },
            employeeProfile: true,
          },
          createdBy: true
        },
        order: {
          date: 'ASC',
        },
      });
    } catch (error) {
      return
    }


    return checador;
  }

  //reporte Nomipaq
  async reportNomipaq(data: NomipaqDto, user: any) {
    const tipoNomina = data.tipoEmpleado;
    const tipoJerarquia = data.tipoJerarquia;
    const employees = await this.employeesService.findByNomina(tipoNomina);
    //se obtienen los empleados por organigrama
    const organigrama = await this.organigramaService.findJerarquia(
      {
        type: tipoJerarquia,
        needUser: true
      },
      user,
    );

    //se filtran los empleados por tipo de nomina
    const employeeNomina = tipoNomina == 'Todas' ? organigrama : organigrama.filter((emp) => emp.payRoll.name == tipoNomina);

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
    for (const iterator of employeeNomina) {
      const eventDays = [];
      let totalHrsRequeridas = 0;
      let totalMinRequeridos = 0;
      let totalHrsTrabajadas = 0;
      let totalMinTrabajados = 0;
      let totalHrsTrabajadasyExtra = 0;
      let total;
      let totalHrsExtra = 0;
      let isIncidenceIncapacidad: boolean = false;

      let totalPagarComida = 0;

      //let i = 0;

      //se recorre el arreglo de dias generados para Nomipaq
      for (let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
        //dia actual a evaluar
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
        let commentIncidence = [];
        const mediaHoraExtra = 0.06;
        let sumaMediaHrExtra = 0;
        let hrsExtraIncidencias = '';
        let isTxtCompensatorio = false;
        let horasRealesTurno = 0;
        let minutosRealesTurno = 0;
        let employeeShifAnterior: any;
        let employeeShifSiguiente: any;
        let sinTurno = '';
        let existeDFT = false;

        //se obtienen los turnos del empleado
        const employeeShif = await this.employeeShiftService.findMore(
          dataDate,
          [iterator.id],
        );
        //const incidenceIncapacidad = await this.incidenceCatalogueService.findByCodeBand('INC');

        //dia anterior
        const dataDateAnterior = {
          start: new Date(new Date(index).setDate(new Date(index).getDate() - 1)),
          end: new Date(new Date(index).setDate(new Date(index).getDate() - 1)),
        };
        //dia siguiente
        const dataDateSiguiente = {
          start: new Date(new Date(index).setDate(new Date(index).getDate() + 1)),
          end: new Date(new Date(index).setDate(new Date(index).getDate() + 1)),
        };

        employeeShifAnterior = await this.employeeShiftService.findMore(
          dataDateAnterior,
          [Number(iterator.id)],
        );
        employeeShifSiguiente = await this.employeeShiftService.findMore(
          dataDateSiguiente,
          [Number(iterator.id)],
        );


        //se verifica si el dia seleccionado es festivo
        const dayCalendar = await this.calendarService.findByDate(format(index, 'yyyy-MM-dd'));


        //si en la fecha el empleado no tiene turno se continua con el siguiente dia
        if (employeeShif.events.length == 0) {
          //si es de lunes a viernes
          if (Number(new Date((format(index, 'yyyy-MM-dd'))).getDay()) != 0 && Number(new Date((format(index, 'yyyy-MM-dd'))).getDay()) != 6) {
            //si es viernes
            if (Number(new Date((format(index, 'yyyy-MM-dd'))).getDay()) == 5) {
              if (employeeShifAnterior?.events[0]?.nameShift == 'T12-1' || employeeShifAnterior?.events[0]?.nameShift == 'T12-2') {
                sinTurno = '';
              } else {
                //si el empleado no tiene turno se pone S/N
                sinTurno = 'S/N'
              }
            } else {
              //si es dia festivo
              if (dayCalendar) {
                sinTurno = ''
              } else {
                sinTurno = 'S/N'
              }

            }

          } else {
            sinTurno = '';
          }

        } else {

          //se pone el nombre del turno

          sinTurno = employeeShif.events[0].nameShift;
          //se obtienen las incidencias del dia Autorizadas
          const incidenciasNormales =
            await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
              start: format(index, 'yyyy-MM-dd 00:00:00') as any,
              end: format(index, 'yyyy-MM-dd 23:59:00') as any,
              ids: [iterator.id],
              code_band: ['VAC', 'PCS', 'PSS', 'HDS', 'CAST', 'FINJ', 'INC', 'DFT', 'PRTC', 'DOM', 'VACA', 'HE', 'HET', 'TXT', 'PSSE'],
              status: ['Autorizada']
            });

          const iniciaTurno = new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.startTimeshift}`);
          const termianTurno = new Date(`${employeeShif.events[0]?.start} ${employeeShif.events[0]?.endTimeshift}`);

          //ajuste para turnos que terminan el dia siguiente
          if (employeeShif.events[0]?.nameShift == 'T3' || employeeShif.events[0]?.nameShift == 'TI3' || employeeShif.events[0]?.nameShift == 'T12-2') {
            termianTurno.setDate(termianTurno.getDate() + 1)
          }

          const startTimeShift = moment(iniciaTurno, 'HH:mm');
          let endTimeShift = moment(termianTurno, 'HH:mm');

          //se obtiene la hora de inicio y fin del turno
          const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
          let hourShift = endTimeShift.diff(startTimeShift, 'hours');
          let minShift = Number(endTimeShift.diff(startTimeShift, 'minutes')) % 60;


          //se valida de el turno es Turno Incidencia
          //o Turno Incidencia 1, 2, 3
          //se pone el total de horas del turno a 0
          //se calcula las horas trabajadas y hrs extra
          if (employeeShif.events[0]?.nameShift == 'TI' || employeeShif.events[0]?.nameShift == 'TI1' || employeeShif.events[0]?.nameShift == 'TI2' || employeeShif.events[0]?.nameShift == 'TI3') {
            hourShift = 0;
            minShift = 0;
            totalHrsRequeridas += hourShift;
            totalMinRequeridos += Number(minShift) % 60;
          } else {
            totalHrsRequeridas += hourShift;
            totalMinRequeridos += Number(minShift) % 60;
          }


          const incidenceHrExtra = await this.incidenceCatalogueService.findByCodeBand('HE');
          const faltaInjustificada = await this.incidenceCatalogueService.findByCodeBand('FINJ');




          //se obtienen las checadas del dia
          let diahoy = new Date(index);
          let hrEntrada = '00:00:00';
          let hrSalida = '23:59:00';

          let diaAnterior = new Date(index);
          let diaSiguente = new Date(index);
          const turnoActual = employeeShif.events[0]?.nameShift;

          const turnoAnterior = employeeShifAnterior.events[0]?.nameShift;
          const turnoSiguiente = employeeShifSiguiente.events[0]?.nameShift;

          //obtener el horario de entrada y salida
          //para consultar el checador
          ({ hrEntrada, hrSalida, diaAnterior, diaSiguente } = await this.entradaSalidaChecador(
            diahoy,
            turnoAnterior,
            turnoActual,
            turnoSiguiente
          ))


          //se recorre el arreglo de incidencias para verificar si existe un tiempo extra
          for (let index = 0; index < incidenciasNormales.length; index++) {
            if (incidenciasNormales[index].status == 'Pendiente') continue;
            if (incidenciasNormales[index].codeBand == 'HE' || incidenciasNormales[index].codeBand == 'HET' || incidenciasNormales[index].codeBand == 'TxT') {
              if (incidenciasNormales[index].type == 'Compensatorio') {
                isTxtCompensatorio = true;
                totalHrsTrabajadas += hourShift;
                totalMinTrabajados += Number(minShift) % 60;


              }

              //si es turno 1
              if (employeeShif.events[0]?.nameShift != '' && (employeeShif.events[0]?.nameShift == 'T1' || employeeShif.events[0]?.nameShift == 'TI1')) {


                if (incidenciasNormales[index].incidenceShift == 1) {
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
                  diaAnterior = new Date(index);
                } else if (incidenciasNormales[index].incidenceShift == 2) {
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';
                  diaAnterior = new Date(index);
                } else if (incidenciasNormales[index].incidenceShift == 3) {
                  hrEntrada = '18:00:00';
                  hrSalida = '06:59:00';
                  diahoy.setDate(diahoy.getDate() - 1);
                } else {

                }
              } else if (employeeShif.events[0]?.nameShift != '' && (employeeShif.events[0]?.nameShift == 'T2' || employeeShif.events[0]?.nameShift == 'TI2')) {

                if (incidenciasNormales[index].incidenceShift == 1) {
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';

                } else if (incidenciasNormales[index].incidenceShift == 2) {
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';

                } else if (incidenciasNormales[index].incidenceShift == 3) {
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente.setDate(diahoy.getDate() + 1);
                }
              } else if (employeeShif.events[0]?.nameShift != '' && (employeeShif.events[0]?.nameShift == 'T3' || employeeShif.events[0]?.nameShift == 'TI3')) {

                if (incidenciasNormales[index].incidenceShift == 1) {
                  hrEntrada = '20:00:00';
                  hrSalida = '14:59:00';
                  diaSiguente.setDate(diahoy.getDate() + 1);
                } else if (incidenciasNormales[index].incidenceShift == 2) {
                  hrEntrada = '13:00:00';
                  hrSalida = '06:59:00';
                  diaSiguente.setDate(diaSiguente.getDate() + 1);
                }
              } else if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'MIX') {

                hrEntrada = '00:30:00';
                hrSalida = '23:59:00';
              } else if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'TI') {

                hrEntrada = '00:30:00';
                hrSalida = '23:59:00';
              } else if (employeeShif.events[0]?.nameShift != '' && employeeShif.events[0]?.nameShift == 'T4') {
                if (incidenciasNormales[index].incidenceShift == 2) {
                  hrEntrada = '05:00:00';
                  hrSalida = '21:59:00';

                } else if (incidenciasNormales[index].incidenceShift == 3) {
                  hrEntrada = '18:00:00';
                  hrSalida = '06:59:00';
                  diahoy.setDate(diahoy.getDate() - 1);
                }
              }

            }
          }

          //se obtienen los registros del dia
          let registrosChecador = await this.checadorRepository.find({
            where: {
              employee: {
                id: iterator.id,
                employeeShift: {
                  start_date: format(index, 'yyyy-MM-dd') as any,
                },
              },
              date: Between(
                format(diaAnterior, `yyyy-MM-dd ${hrEntrada}`) as any,
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
              recordDevice: true,
            },
            order: {
              date: 'ASC',
            },
          });

          //filtra los registros
          //solo toma los registros de acceso personal
          registrosChecador = registrosChecador.filter((registro) => {
            if (registro.date <= new Date('2025-10-05 23:59:59')) {
              return true;
            } else {
              if ((
                registro.recordDevice &&
                registro.recordDevice.description &&
                registro.recordDevice.description == 'Acceso Personal'
              ) ||
                (
                  registro.numRegistroChecador == 0 || registro.numRegistroChecador == 1

                )
              ) {
                // Si el registro es de acceso personal o es un registro manual, se incluye
                return true;
              } else {
                return false;
              }
            }

          });

          //si existen checadas
          if (registrosChecador.length > 0) {
            isIncidenceIncapacidad = false;

            //existe incidencia HET, HE
            let existeIncidenciasHE = incidenciasNormales.some((incidencia) => (incidencia.codeBand == 'HET' || incidencia.codeBand == 'HE') && incidencia.status == 'Autorizada');
            //exite incidencia DFT
            existeDFT = incidenciasNormales.some((incidencia) => incidencia.codeBand == 'DFT' && incidencia.status == 'Autorizada');

          }

          //se recorre el arreglo de incidencias
          for (let index = 0; index < incidenciasNormales.length; index++) {
            if (incidenciasNormales[index].status == 'Pendiente') continue;
            const findIncidence = await this.employeeIncidenceService.findOne(incidenciasNormales[index].incidenceId);
            if (incidenciasNormales[index].codeBand == 'VAC' || incidenciasNormales[index].codeBand == 'VACA' || incidenciasNormales[index].codeBand == 'VacM') {
              incidenciaVac = true;
              totalHrsTrabajadas += hourShift;
              totalMinTrabajados += Number(minShift) % 60;

            }
            if (incidenciasNormales[index].codeBand != 'HE' && incidenciasNormales[index].codeBand != 'HET' && incidenciasNormales[index].codeBand != 'TxT') {
              if (incidenciasNormales[index].codeBand == 'INC') {
                isIncidenceIncapacidad = true;
              } else {
                isIncidenceIncapacidad = false;
              }

              //si es permiso con descuento de horas
              if (incidenciasNormales[index].codeBand == 'HDS') {
                incidenceExtra.push(`${moment.utc(incidenciasNormales[index].total_hour * 60 * 60 * 1000).format('H.mm')}` + incidenciasNormales[index].codeBand);
              } else {

                //si la incidencia es DFT y existen registros del checador
                //agrega la incidencia al reporte
                if (incidenciasNormales[index].codeBand == 'DFT') {
                  totalHrsTrabajadas += hourShift;
                  totalMinTrabajados += Number(minShift) % 60;


                } else {
                  incidenceExtra.push(`1` + incidenciasNormales[index].codeBand);
                }


              }
            }

            //validar que exista tiempo extra
            if (incidenciasNormales[index].codeBand == 'HE' || incidenciasNormales[index].codeBand == 'HET') {
              incidenciaTiemExtra = true;
              hrsExtraIncidencias += parseFloat(String(incidenciasNormales[index].total_hour));

            }


            if (incidenciasNormales[index].codeBand == 'PCS' || incidenciasNormales[index].codeBand == 'PSSE') {
              totalHrsTrabajadas += Number(moment((parseFloat(String(incidenciasNormales[index].total_hour)) / Number(findIncidence.dateEmployeeIncidence.length))).hours());
              totalMinTrabajados += Number(moment((parseFloat(String(incidenciasNormales[index].total_hour)) / Number(findIncidence.dateEmployeeIncidence.length))).minutes())
            }


          }


          //falta injustificada
          //si no existen checadas
          // && incidenciasNormales.length == 0
          //si el dia no es festivo
          //si existe turno
          if (registrosChecador.length == 0 && !dayCalendar && employeeShif.events.length > 0 && !isTxtCompensatorio) {
            incidenciaFalta = true;
            isIncidenceIncapacidad = false;
            //se verifica si no existe correccion de tiempo
            const timeCorrection = await this.timeCorrectionService.findTimeCorrection(
              format(index, 'yyyy-MM-dd'),
              iterator.id
            );


            if (format(index, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd')) {

              //si no existe incidencia
              if (incidenciasNormales.length == 0) {
                incidenceExtra.push(`1` + faltaInjustificada.code_band);
              }


              //si existe correccion de tiempo
              if (timeCorrection) {
                commentIncidence.push(timeCorrection.comment);
                incidenciasNormales.forEach((incidence) => {
                  if (incidence.status == 'Pendiente') {
                    commentIncidence.push('Incidencia pendiente de autorización');
                  }
                });

              }

            }
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
          let minIncidence = 0;
          let hrsIncidence = 0;
          let calculoHrsExtra = 0;
          let calculoMinExtra = 0;
          let horasExtraDia = 0;
          let minutosExtraDia = 0;

          if (dayCalendar) {
            if (dayCalendar.holiday) {

              totalHrsTrabajadas += hourShift;
            }
          }

          //tiempo extra para el turno 3
          //diffDate >= diffTimeShift 
          if (registrosChecador.length > 0 && employeeShif.events[0]?.nameShift == 'T3' && incidenciasNormales.length <= 0) {


            incidenceExtra.push(`${mediaHoraExtra}` + incidenceHrExtra.code_band + '2');

            sumaMediaHrExtra += Number(mediaHoraExtra);
            totalHrsExtra += sumaMediaHrExtra;


          }

          horasExtraDia = (horasDia - hourShift) <= 0 ? 0 : (horasDia - hourShift); //horas extra por dia
          minutosExtraDia = (minsDia - minShift) <= 0 ? 0 : (minsDia - minShift); //mins extra por dia

          horasRealesTurno += horasDia - horasExtraDia;
          minutosRealesTurno += minsDia - minutosExtraDia;


          calculoHrsExtra += horasExtraDia;

          //calculoMinExtra += minsDia - (Number(minShift) % 60);
          calculoMinExtra += minutosExtraDia;

          //se separa horas y minutos de la incidencia
          minIncidence = Number(moment.duration(hrsExtraIncidencias, 'hours').asHours());
          let objetHorasMinIncidencia = moment(Number(hrsExtraIncidencias).toFixed(2), 'HH.mm');
          let formatTime = objetHorasMinIncidencia.format('HH:mm');



          //se valida si calculo de horas extra es mayor a 0 y si existe incidencia de tiempo extra
          if (calculoHrsExtra >= 0 && incidenciaTiemExtra) {
            //se valida si el calculo de horas extra es mayor a las horas extra de las incidencias
            //si las mayor se le ponen las horas de la incidencia

            if (Number(moment().hours(calculoHrsExtra).minutes(calculoMinExtra).format('HH.mm')) > Number(hrsExtraIncidencias)) {



              //totalHrsExtra = Number(objetHorasMinIncidencia.hours()) + totalHrsExtra;
              calculoHrsExtra = Number(objetHorasMinIncidencia.hours());
              if (calculoMinExtra > objetHorasMinIncidencia.minutes()) {
                calculoMinExtra = objetHorasMinIncidencia.minutes();
              }
            }

            //se valida si las hrs extra dobles y triples
            if (calculoHrsExtra > 3) {

              //hrExtraTripe = Number(moment(calculoHrsExtra.toString(),"LT").hours()+'.'+moment(calculoHrsExtra.toString(),"LT").minutes()) - 3;
              hrExtraTripe = Number(moment().hours(calculoHrsExtra).minutes(calculoMinExtra).format('HH.mm')) - 3;
              hrExtraDoble = 3;
              totalHrsExtra += hrExtraTripe + hrExtraDoble;

            } else {
              //hrExtraDoble = Number(moment(calculoHrsExtra.toString(),"LT").hours()+'.'+calculoMinExtra);
              hrExtraDoble = Number(moment().hours(calculoHrsExtra).minutes(calculoMinExtra).format('HH.mm'));
              totalHrsExtra += hrExtraDoble;
            }

            if (hrExtraTripe > 0) {
              //incidenceExtra.push(`${hrExtraDoble}` + incidenceHrExtra.code_band + '2');
              //incidenceExtra.push(`${moment.utc(hrExtraTripe * 60 * 60 * 1000).format('H.mm')}` + incidenceHrExtra.code_band + '3');
              //incidenceExtra.push(`${moment(hrExtraTripe.toString(),"LT").format('h.mm')}` + incidenceHrExtra.code_band + '3');
              //incidenceExtra.push(`${moment(hrExtraDoble.toString(),"LT").format('h.mm')}` + incidenceHrExtra.code_band + '2');
              //incidenceExtra.push(`${moment(hrExtraTripe.toString(),"LT").format('h.mm')}` + incidenceHrExtra.code_band + '3');
              incidenceExtra.push(`${hrExtraDoble.toFixed(2)}` + incidenceHrExtra.code_band + '2');
              incidenceExtra.push(`${hrExtraTripe.toFixed(2)}` + incidenceHrExtra.code_band + '3');

            } else {

              incidenceExtra.push(`${hrExtraDoble}` + incidenceHrExtra.code_band + '2');
            }
          }


          //se realiza la suma de las horas trabajadas
          totalHrsTrabajadas += diffDate >= 0 ? Number(horasRealesTurno) : 0;
          totalMinTrabajados += diffDate >= 0 ? Number(minutosRealesTurno) : 0;

          //si existe incidencia DFT
          //se calcula el total de horas por dia trabajadas
          if (existeDFT && registrosChecador.length > 0) {

            //horas trabajadas del dia entre horas del turno
            //si es vamor mayor a 1 se pone 1
            //y si no se divide entre 1.666667 para obtener las DFT
            incidenceExtra.push(parseFloat(((diffDate / diffTimeShift > 1 ? 1 : (diffDate / diffTimeShift)) / 1.666667).toFixed(2)) + 'DFT');

          }

          //si el dia es domingo
          //y tiene registros del checador 
          //y la incidencia es DFT o tiene turno 4
          //se agrega 1DOM a las incidencias
          if (Number(new Date((format(index, 'yyyy-MM-dd'))).getDay()) == 0) {
            if (registrosChecador.length > 0) {

              if (incidenciasNormales.find(i => i.codeBand == 'DFT') || employeeShif.events[0].nameShift == 'T4') {
                incidenceExtra.push(`1DOM`);
              }

            }
          }






        }




        //se agrega el dia al arreglo de dias

        eventDays.push({
          date: format(index, 'yyyy-MM-dd'),
          incidencia: { extra: incidenceExtra },
          employeeShift: sinTurno,
          comment: commentIncidence
        });


        //i++;
      }

      //total a pagar comedor
      totalPagarComida = await this.findTotalComedor(iterator.id, data.startDateComedor, data.endDateComedor);

      totalHrsRequeridas += Math.floor(totalMinRequeridos / 60);
      totalHrsTrabajadas = totalHrsTrabajadas;
      totalMinTrabajados = totalMinTrabajados;
      totalHrsTrabajadasyExtra = totalHrsTrabajadas + totalHrsExtra;


      registros.push({
        idEmpleado: iterator.id,
        numeroNomina: iterator.employee_number,
        nombre: iterator.name + ' ' + iterator.paternal_surname + ' ' + iterator.maternal_surname,
        tipo_nomina: iterator.payRoll.name,
        perfile: iterator.employeeProfile.name,
        date: eventDays,
        horasEsperadas: totalHrsRequeridas + '.' + moment().minutes(totalMinRequeridos).format('mm'),
        horasTrabajadas: totalHrsTrabajadas + '.' + moment().minutes(totalMinTrabajados).format('mm'), //total hrs trabajadas
        horasTrabajadasyExtra: totalHrsTrabajadasyExtra.toFixed(2),
        horasExtra: totalHrsExtra.toFixed(2),
        totalPagarComida: totalPagarComida,
        //horasExtra: moment.utc(totalHrsExtra*60*60*1000).format('HH:mm')
      });


      registros.concat(eventDays);
    }

    return {
      registros,
      diasGenerados,
    };
  }

  //repote de nomipaq v2
  async reportNomipaqV2(data: NomipaqDto, user: any) {
    const tipoNomina = data.tipoEmpleado;
    const tipoJerarquia = data.tipoJerarquia;

    // ✅ 1. PRE-CARGAR DATOS GENERALES
    //fechas
    const from = format(new Date(data.startDate), 'yyyy-MM-dd 00:00:00');
    const to = format(new Date(data.endDate), 'yyyy-MM-dd 23:59:59');

    // Obtener organigrama (con empleados)
    const organigrama = await this.organigramaService.findJerarquia(
      {
        type: tipoJerarquia,
        needUser: true
      },
      user,
    );

    // Filtrar por tipo de nómina
    const employeeNomina = tipoNomina == 'Todas'
      ? organigrama
      : organigrama.filter((emp) => emp.payRoll.name == tipoNomina);

    if (employeeNomina.length === 0) {
      return { registros: [], diasGenerados: [] };
    }

    const arrayEmployeeIds: number[] = employeeNomina.map(emp => emp.id);

    // ✅ 2. GENERAR DÍAS DEL RANGO DE FECHAS
    const diasGenerados = [];
    for (let x = new Date(from); x <= new Date(to); x = new Date(x.setDate(x.getDate() + 1))) {
      diasGenerados.push(format(x, 'yyyy-MM-dd'));
    }

    // ✅ 3. PRE-CARGAR TODOS LOS TURNOS de los empleados (día anterior, actual, siguiente)
    const allEmployeeShifts = await this.employeeShiftService.findMore(
      {
        start: new Date(format(subDays(new Date(from), 1), 'yyyy-MM-dd')),
        end: new Date(format(addDays(new Date(to), 1), 'yyyy-MM-dd')),
      },
      arrayEmployeeIds,
    );

    // Mapa: employeeId_fecha -> turno
    const shiftsMap = new Map();
    allEmployeeShifts.events?.forEach(shift => {
      const key = `${shift.employeeId}_${format(new Date(shift.start), 'yyyy-MM-dd')}`;
      shiftsMap.set(key, shift);
    });

    // ✅ 4. PRE-CARGAR CALENDARIO (días festivos)
    const allCalendarDays = await this.calendarService.findRangeDate({
      start: format(new Date(from), 'yyyy-MM-dd'),
      end: format(new Date(to), 'yyyy-MM-dd')
    });
    const calendarMap = new Map(
      allCalendarDays?.map(day => [format(new Date(day.date), 'yyyy-MM-dd'), day])
    );

    // ✅ 5. PRE-CARGAR TODAS LAS INCIDENCIAS
    const allIncidences = await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
      start: format(new Date(from), 'yyyy-MM-dd 00:00:00') as any,
      end: format(new Date(to), 'yyyy-MM-dd 23:59:59') as any,
      ids: arrayEmployeeIds,
      code_band: ['VAC', 'PCS', 'PSS', 'HDS', 'CAST', 'FINJ', 'INC', 'DFT', 'PRTC', 'DOM', 'VACA', 'HE', 'HET', 'TXT', 'PSSE'],
      status: ['Autorizada']
    });

    // Mapa: employeeId_fecha -> incidencias[]
    const incidencesMap = new Map();
    allIncidences?.forEach(inc => {
      const key = `${inc.resourceId}_${format(new Date(inc.start), 'yyyy-MM-dd')}`;
      if (!incidencesMap.has(key)) {
        incidencesMap.set(key, []);
      }
      incidencesMap.get(key).push(inc);
    });

    // ✅ 6. PRE-CARGAR TODOS LOS REGISTROS DEL CHECADOR
    const allChecadorRecords = await this.checadorRepository.find({
      where: {
        employee: {
          id: In(arrayEmployeeIds),
        },
        date: Between(
          format(subDays(new Date(from), 1), 'yyyy-MM-dd 00:00:00') as any,
          format(addDays(new Date(to), 1), 'yyyy-MM-dd 23:59:59') as any,
        ),
      },
      relations: {
        employee: true,
        recordDevice: true,
      },
      order: {
        employee: { id: 'ASC' },
        date: 'ASC',
      },
    });

    // Mapa: employeeId_fecha -> registros[]
    const checadorMap = new Map();
    allChecadorRecords.forEach(record => {
      const date = format(new Date(record.date), 'yyyy-MM-dd');
      const key = `${record.employee.id}_${date}`;

      if (!checadorMap.has(key)) {
        checadorMap.set(key, []);
      }
      checadorMap.get(key).push(record);
    });

    // ✅ 7. PRE-CARGAR CORRECCIONES DE TIEMPO
    const allTimeCorrections = await this.timeCorrectionService.findTimeCorrectionRangeDate(
      format(new Date(from), 'yyyy-MM-dd'),
      format(new Date(to), 'yyyy-MM-dd'),
      arrayEmployeeIds
    );

    const timeCorrectionsMap = new Map(
      allTimeCorrections?.map(tc => [`${tc.employee.id}_${tc.date}`, tc])
    );

    // ✅ 8. PRE-CARGAR CATÁLOGOS DE INCIDENCIAS
    const incidenceHrExtra = await this.incidenceCatalogueService.findByCodeBand('HE');
    const faltaInjustificada = await this.incidenceCatalogueService.findByCodeBand('FINJ');

    const registros = [];

    for (const iterator of employeeNomina) {
      const eventDays = [];
      let totalHrsRequeridas = 0;
      let totalMinRequeridos = 0;
      let totalHrsTrabajadas = 0;
      let totalMinTrabajados = 0;
      let totalHrsExtra = 0;

      // ✅ PROCESAR CADA DÍA
      for (let index = new Date(from); index <= new Date(to); index = new Date(index.setDate(index.getDate() + 1))) {
        const diaConsulta = format(index, 'yyyy-MM-dd');
        const diaAnterior = format(subDays(index, 1), 'yyyy-MM-dd');
        const diaSiguiente = format(addDays(index, 1), 'yyyy-MM-dd');

        // ✅ Obtener turnos desde el mapa
        const turnoKey = `${iterator.id}_${diaConsulta}`;
        const turnoAnteriorKey = `${iterator.id}_${diaAnterior}`;
        const turnoSiguienteKey = `${iterator.id}_${diaSiguiente}`;

        const employeeShif = shiftsMap.get(turnoKey);
        const employeeShifAnterior = shiftsMap.get(turnoAnteriorKey);
        const employeeShifSiguiente = shiftsMap.get(turnoSiguienteKey);

        // ✅ Verificar día festivo desde el mapa
        const dayCalendar = calendarMap.get(diaConsulta);

        let sinTurno = '';
        const incidenceExtra = [];
        const commentIncidence = [];
        let hrExtraDoble = 0;
        let hrExtraTriple = 0;
        const mediaHoraExtra = 0.06;
        let sumaMediaHrExtra = 0;

        // ✅ SI NO HAY TURNO
        if (!employeeShif) {
          // Lógica de días sin turno
          if (Number(new Date(diaConsulta).getDay()) != 0 && Number(new Date(diaConsulta).getDay()) != 6) {
            if (Number(new Date(diaConsulta).getDay()) == 5) {
              if (employeeShifAnterior?.nameShift == 'T12-1' || employeeShifAnterior?.nameShift == 'T12-2') {
                sinTurno = '';
              } else {
                sinTurno = 'S/N';
              }
            } else {
              sinTurno = dayCalendar ? '' : 'S/N';
            }
          } else {
            sinTurno = '';
          }

          eventDays.push({
            date: diaConsulta,
            incidencia: { extra: [] },
            employeeShift: sinTurno,
            comment: []
          });
          continue;
        }

        // ✅ HAY TURNO - PROCESAR
        sinTurno = employeeShif.nameShift;

        // Calcular horas del turno
        const iniciaTurno = new Date(`${employeeShif.start} ${employeeShif.startTimeshift}`);
        const termianTurno = new Date(`${employeeShif.start} ${employeeShif.endTimeshift}`);

        if (['T3', 'TI3', 'T12-2'].includes(employeeShif.nameShift)) {
          termianTurno.setDate(termianTurno.getDate() + 1);
        }

        const startTimeShift = moment(iniciaTurno);
        const endTimeShift = moment(termianTurno);
        const diffTimeShift = endTimeShift.diff(startTimeShift, 'hours', true);
        let hourShift = endTimeShift.diff(startTimeShift, 'hours');
        let minShift = endTimeShift.diff(startTimeShift, 'minutes') % 60;

        // Sumar horas requeridas (excepto turnos TI)
        if (!['TI', 'TI1', 'TI2', 'TI3'].includes(employeeShif.nameShift)) {
          totalHrsRequeridas += hourShift;
          totalMinRequeridos += minShift;
        }

        // ✅ Obtener incidencias desde el mapa
        const incidenciasKey = `${iterator.id}_${diaConsulta}`;
        const incidenciasNormales = incidencesMap.get(incidenciasKey) || [];

        let incidenciaTiemExtra = false;
        let isTxtCompensatorio = false;
        let existeDFT = false;
        let hrsExtraIncidencias = 0;

        // Procesar incidencias
        for (const inc of incidenciasNormales) {
          if (inc.status !== 'Autorizada') continue;

          // VAC, VACA
          if (['VAC', 'VACA', 'VacM'].includes(inc.codeBand)) {
            totalHrsTrabajadas += hourShift;
            totalMinTrabajados += minShift;
          }

          // Tiempo extra compensatorio
          if (inc.codeBand === 'TxT' && inc.type === 'Compensatorio') {
            isTxtCompensatorio = true;
            totalHrsTrabajadas += hourShift;
            totalMinTrabajados += minShift;
          }

          // HE, HET
          if (['HE', 'HET'].includes(inc.codeBand)) {
            incidenciaTiemExtra = true;
            hrsExtraIncidencias += parseFloat(String(inc.total_hour));
          }

          // DFT
          if (inc.codeBand === 'DFT') {
            existeDFT = true;
            totalHrsTrabajadas += hourShift;
            totalMinTrabajados += minShift;
          }

          // Otras incidencias
          if (!['HE', 'HET', 'TxT'].includes(inc.codeBand)) {
            if (inc.codeBand === 'HDS') {
              incidenceExtra.push(`${moment.utc(inc.total_hour * 60 * 60 * 1000).format('H.mm')}${inc.codeBand}`);
            } else if (inc.codeBand !== 'INC') {
              incidenceExtra.push(`1${inc.codeBand}`);
            }
          }

          // PCS, PSSE
          if (['PCS', 'PSSE'].includes(inc.codeBand)) {
            const horasPorDia = parseFloat(inc.total_hour) / inc.dateEmployeeIncidence?.length || 1;
            totalHrsTrabajadas += Math.floor(horasPorDia);
            totalMinTrabajados += Math.round((horasPorDia % 1) * 60);
          }
        }

        // ✅ CALCULAR HORARIO PARA CHECADOR
        const turnoActual = employeeShif?.nameShift || '';
        const turnoAnterior = employeeShifAnterior?.nameShift || '';
        const turnoSiguiente = employeeShifSiguiente?.nameShift || '';

        let { hrEntrada, hrSalida, diaAnterior: diaAnt, diaSiguente: diaSig } =
          await this.entradaSalidaChecador(
            new Date(index),
            turnoAnterior,
            turnoActual,
            turnoSiguiente
          );

        // ✅ AJUSTAR HORARIO SI HAY TIEMPO EXTRA
        for (const inc of incidenciasNormales) {
          if (['HE', 'HET', 'TxT'].includes(inc.codeBand)) {
            if (['T1', 'TI1'].includes(turnoActual)) {
              if (inc.incidenceShift === 1 || inc.incidenceShift === 2) {
                hrEntrada = '05:00:00';
                hrSalida = '21:59:00';
              } else if (inc.incidenceShift === 3) {
                hrEntrada = '18:00:00';
                hrSalida = '06:59:00';
              }
            } else if (['T2', 'TI2'].includes(turnoActual)) {
              if (inc.incidenceShift === 1 || inc.incidenceShift === 2) {
                hrEntrada = '05:00:00';
                hrSalida = '21:59:00';
              } else if (inc.incidenceShift === 3) {
                hrEntrada = '13:00:00';
                hrSalida = '06:59:00';
              }
            } else if (['T3', 'TI3'].includes(turnoActual)) {
              if (inc.incidenceShift === 1) {
                hrEntrada = '20:00:00';
                hrSalida = '14:59:00';
              } else if (inc.incidenceShift === 2) {
                hrEntrada = '13:00:00';
                hrSalida = '06:59:00';
              }
            } else if (['MIX', 'TI'].includes(turnoActual)) {
              hrEntrada = '00:30:00';
              hrSalida = '23:59:00';
            }
          }
        }

        // ✅ Obtener registros del checador desde el mapa
        const checadorKey = `${iterator.id}_${diaConsulta}`;
        let registrosChecador = checadorMap.get(checadorKey) || [];

        // Filtrar registros
        registrosChecador = registrosChecador.filter((registro) => {
          if (registro.date <= new Date('2025-10-05 23:59:59')) {
            return true;
          }
          return (
            registro.recordDevice?.description === 'Acceso Personal' ||
            registro.numRegistroChecador === 0 ||
            registro.numRegistroChecador === 1
          );
        });

        // ✅ SI NO HAY REGISTROS Y NO ES COMPENSATORIO
        if (registrosChecador.length === 0 && !isTxtCompensatorio && !dayCalendar) {
          const timeCorrectionKey = `${iterator.id}_${diaConsulta}`;
          const timeCorrection = timeCorrectionsMap.get(timeCorrectionKey);

          if (diaConsulta <= format(new Date(), 'yyyy-MM-dd')) {
            if (incidenciasNormales.length === 0) {
              incidenceExtra.push(`1${faltaInjustificada.code_band}`);
            }

            if (timeCorrection) {
              commentIncidence.push(timeCorrection.comment);
            }
          }
        }

        // ✅ CALCULAR HORAS TRABAJADAS
        if (registrosChecador.length > 0) {
          const firstDate = moment(registrosChecador[0].date);
          const secondDate = moment(registrosChecador[registrosChecador.length - 1].date);

          const diffDatehour = secondDate.diff(firstDate, 'hours');
          const diffDatemin = secondDate.diff(firstDate, 'minutes');
          const diffDate = secondDate.diff(firstDate, 'hours', true);

          const horasDia = diffDatehour;
          const minsDia = diffDatemin % 60;

          const horasExtraDia = Math.max(0, horasDia - hourShift);
          const minutosExtraDia = Math.max(0, minsDia - minShift);

          totalHrsTrabajadas += horasDia - horasExtraDia;
          totalMinTrabajados += minsDia - minutosExtraDia;

          // ✅ CALCULAR TIEMPO EXTRA
          if (turnoActual === 'T3' && incidenciasNormales.length === 0) {
            incidenceExtra.push(`${mediaHoraExtra}${incidenceHrExtra.code_band}2`);
            sumaMediaHrExtra += mediaHoraExtra;
            totalHrsExtra += sumaMediaHrExtra;
          }

          if (incidenciaTiemExtra && horasExtraDia > 0) {
            let calculoHrsExtra = horasExtraDia;
            let calculoMinExtra = minutosExtraDia;

            if (calculoHrsExtra > 3) {
              hrExtraTriple = calculoHrsExtra - 3;
              hrExtraDoble = 3;
              totalHrsExtra += hrExtraTriple + hrExtraDoble;
              incidenceExtra.push(`${hrExtraDoble.toFixed(2)}${incidenceHrExtra.code_band}2`);
              incidenceExtra.push(`${hrExtraTriple.toFixed(2)}${incidenceHrExtra.code_band}3`);
            } else {
              hrExtraDoble = calculoHrsExtra + (calculoMinExtra / 60);
              totalHrsExtra += hrExtraDoble;
              incidenceExtra.push(`${hrExtraDoble.toFixed(2)}${incidenceHrExtra.code_band}2`);
            }
          }

          // DFT en domingo
          if (existeDFT && registrosChecador.length > 0) {
            const porcentajeTrabajado = Math.min(1, diffDate / diffTimeShift);
            incidenceExtra.push((porcentajeTrabajado / 1.666667).toFixed(2) + 'DFT');
          }

          // Domingo
          if (Number(new Date(diaConsulta).getDay()) === 0) {
            if (incidenciasNormales.some(i => i.codeBand === 'DFT') || turnoActual === 'T4') {
              incidenceExtra.push('1DOM');
            }
          }
        }

        // Día festivo
        if (dayCalendar?.holiday) {
          totalHrsTrabajadas += hourShift;
        }

        eventDays.push({
          date: diaConsulta,
          incidencia: { extra: incidenceExtra },
          employeeShift: sinTurno,
          comment: commentIncidence
        });
      }

      // ✅ CALCULAR TOTALES FINALES
      totalHrsRequeridas += Math.floor(totalMinRequeridos / 60);
      totalMinRequeridos = totalMinRequeridos % 60;

      totalHrsTrabajadas += Math.floor(totalMinTrabajados / 60);
      totalMinTrabajados = totalMinTrabajados % 60;

      // Calcular comedor
      const totalPagarComida = await this.findTotalComedor(
        iterator.id,
        data.startDateComedor,
        data.endDateComedor
      );

      registros.push({
        idEmpleado: iterator.id,
        numeroNomina: iterator.employee_number,
        nombre: `${iterator.name} ${iterator.paternal_surname} ${iterator.maternal_surname}`,
        tipo_nomina: iterator.payRoll.name,
        perfile: iterator.employeeProfile.name,
        date: eventDays,
        horasEsperadas: `${totalHrsRequeridas}.${moment().minutes(totalMinRequeridos).format('mm')}`,
        horasTrabajadas: `${totalHrsTrabajadas}.${moment().minutes(totalMinTrabajados).format('mm')}`,
        horasTrabajadasyExtra: (totalHrsTrabajadas + totalHrsExtra).toFixed(2),
        horasExtra: totalHrsExtra.toFixed(2),
        totalPagarComida: totalPagarComida,
      });

    }

    return {
      registros,
      diasGenerados,
    };



  }

  //definir hora de entrar y salida para el checador
  async entradaSalidaChecador(diaActual: Date, turnoAnterior: string, turnoActual: string, turnoSiguiente: string) {
    let index = new Date(diaActual);
    let hrEntrada = '';
    let hrSalida = '';
    let diaAnterior = new Date();
    let diaSiguente = new Date();

    //turno actual es igual al turno del dia anterior
    if (turnoActual == turnoAnterior) {
      //turno actual es igual al turno del dia siguiente
      if (turnoActual == turnoSiguiente) {
        switch (turnoActual) {
          case 'T1':
            hrEntrada = '22:00:00'; //dia anterior
            hrSalida = '22:00:00'; //dia actual
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
            diaSiguente = new Date(index);
            break;
          case 'T2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '07:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'T3':
            hrEntrada = '13:00:00'; //dia actual
            hrSalida = '15:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'MIX':
            hrEntrada = '00:01:00'; //dia actual
            hrSalida = '23:59:00'; //dia siguiente
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
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
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
          case 'TI1':
            hrEntrada = '21:00:00'; //dia anterior
            hrSalida = '22:00:00'; //dia actual
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
            diaSiguente = new Date(index);
            break;
          case 'TI2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '07:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TI3':
            hrEntrada = '13:00:00'; //dia actual
            hrSalida = '15:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TP2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
        }
      } else {
        switch (turnoActual) {
          case 'T1':
            hrEntrada = '21:00:00'; //dia anterior
            hrSalida = '15:00:00'; //dia actual
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
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
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'MIX':
            hrEntrada = '03:00:00'; //dia actual
            hrSalida = '22:30:00'; //dia siguiente
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
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
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
          case 'TI1':
            hrEntrada = '21:00:00'; //dia anterior
            hrSalida = '15:00:00'; //dia actual
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
            diaSiguente = new Date(index);
            break;
          case 'TI2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '22:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'TI3':
            hrEntrada = '13:00:00'; //dia actual
            hrSalida = '07:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TP2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
        }
      }
    } else {
      if (turnoActual == turnoSiguiente) {
        switch (turnoActual) {
          case 'T1':
            hrEntrada = '03:00:00'; //dia actual
            hrSalida = '22:00:00'; //dia actual
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'T2':
            hrEntrada = '07:00:00'; //dia Actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'T3':
            hrEntrada = '13:00:00'; //dia actual
            hrSalida = '15:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'MIX':
            if ((turnoAnterior == 'T3' || turnoAnterior == 'TI3') && (turnoActual == 'MIX' || turnoActual == 'T1')) {
              hrEntrada = '05:00:00'; //dia actual
              hrSalida = '23:00:00'; //dia siguiente
              diaAnterior = new Date(index);
              diaSiguente = new Date(index);
            } else {
              hrEntrada = '02:00:00'; //dia actual
              hrSalida = '23:00:00'; //dia siguiente
            }
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
            diaAnterior = new Date(new Date(index).setDate(new Date(index).getDate() - 1));
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
          case 'TI1':
            hrEntrada = '03:00:00'; //dia anterior
            hrSalida = '22:00:00'; //dia actual
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'TI2':
            hrEntrada = '07:00:00'; //dia Actual
            hrSalida = '22:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TI3':
            hrEntrada = '13:00:00'; //dia actual
            hrSalida = '15:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TP2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
        }
      } else {
        switch (turnoActual) {
          case 'T1':
            hrEntrada = '05:00:00'; //dia anterior
            hrSalida = '16:00:00'; //dia actual
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'T2':
            hrEntrada = '13:00:00'; //dia Actual
            hrSalida = '22:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'T3':
            hrEntrada = '21:00:00'; //dia actual
            hrSalida = '07:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
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
            hrEntrada = '06:00:00'; //dia anterior
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
          case 'TI1':
            hrEntrada = '05:00:00'; //dia anterior
            hrSalida = '16:00:00'; //dia actual
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'TI2':
            hrEntrada = '13:00:00'; //dia Actual
            hrSalida = '22:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
          case 'TI3':
            hrEntrada = '21:00:00'; //dia actual
            hrSalida = '07:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(new Date(index).setDate(new Date(index).getDate() + 1));
            break;
          case 'TP2':
            hrEntrada = '05:00:00'; //dia Actual
            hrSalida = '23:00:00'; //dia siguiente
            diaAnterior = new Date(index);
            diaSiguente = new Date(index);
            break;
        }
      }
    }

    return {
      hrEntrada,
      hrSalida,
      diaAnterior,
      diaSiguente
    }
  }

  //obtener el total de registros del comedor
  //por rango de fechas
  async findTotalComedor(idEmployee: number, startDateComedor: string, endDateComedor: string) {

    let totalPagarComida = 0;
    let precioComida = 22.63;

    //se recorre los dias
    for (let index = new Date(startDateComedor); index <= new Date(endDateComedor); index = new Date(index.setDate(index.getDate() + 1))) {

      //registros comedor
      const registrosComedor = await this.checadorRepository.find({
        where: {
          employee: {
            id: idEmployee,
          },
          date: Between(
            format(index, `yyyy-MM-dd 00:00:00`) as any,
            format(index, `yyyy-MM-dd 23:59:59`) as any,
          ),
        },
        order: {
          date: 'ASC',
        },
      });

      //total registros comedor
      let totalRegComedor = 0;
      totalRegComedor = registrosComedor.filter((checador: any) => checador.origin == 'Comedor').length;

      //obtener incidencias tiempo extra por turno(HET) y tiempo extra por horas(HE)
      const incidenciasNormales =
        await this.employeeIncidenceService.findAllIncidencesByIdsEmployee({
          start: format(index, 'yyyy-MM-dd 00:00:00') as any,
          end: format(index, 'yyyy-MM-dd 23:59:00') as any,
          ids: [idEmployee],
          code_band: ['HE', 'HET', 'DFT',],
          status: ['Autorizada']
        });
      let existeIncidenciasHE = false;
      let existeDFT = false;
      existeIncidenciasHE = incidenciasNormales.some((incidencia) => (incidencia.codeBand == 'HET' || incidencia.codeBand == 'HE') && incidencia.status == 'Autorizada');
      existeDFT = incidenciasNormales.some((incidencia) => incidencia.codeBand == 'DFT' && incidencia.status == 'Autorizada');

      if (existeIncidenciasHE) {
        //precio de la comida * el total de registros menos 1 por tener tiempo extra
        totalPagarComida += ((totalRegComedor == 0 ? 0 : totalRegComedor) - 1) * precioComida;
      } else {
        //si no existe DFT se multiplica precio de comida por total registros comedor
        if (!existeDFT) {
          totalPagarComida += totalRegComedor * precioComida;
        }

      }
    }

    return totalPagarComida;
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
