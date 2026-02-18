import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  In,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  DataSource,
  Equal,
  IsNull,
} from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { format } from 'date-fns';

import { CreateProductionMachineEmployeeDto, SearchProductionMachineEmployeeDto } from '../dto/production_machine_employee.dto';
import { ProductionMachineEmployee } from '../entities/production_machine_employee.entity';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { ProductionMachineService } from './production_machine.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { CalendarService } from '../../calendar/service/calendar.service';

@Injectable()
export class ProductionMachineEmployeeService {
  constructor(
    @InjectRepository(ProductionMachineEmployee)
    private productionMachineEmployeeRepository: Repository<ProductionMachineEmployee>,
    @InjectDataSource() private dataSource: DataSource,
    private employeeShiftService: EmployeeShiftService,
    private productionMachineService: ProductionMachineService,
    private employeesService: EmployeesService,
    private calendarService: CalendarService,
  ) { }

  //crear asignacion maquina de produccion - empleado
  async create(createProductionMachineEmployeeDto: CreateProductionMachineEmployeeDto) {

    let arrayProductionMachineEmployees = [];

    try {
      //se obtiene los turnos de los empleados para el rango de fechas
      let shifts = await this.employeeShiftService.findMore(
        {
          start: createProductionMachineEmployeeDto.start_date,
          end: createProductionMachineEmployeeDto.end_date,
        },
        createProductionMachineEmployeeDto.employeeIds,
      );

      //se obtiene la maquina de produccion
      let productionMachine = await this.productionMachineService.findOne(createProductionMachineEmployeeDto.productionMachineId);

      //se mapean los turnos para crear las asignaciones de maquina de produccion - empleado
      for (let l = 0; l < shifts.events.length; l++) {
        const element = shifts.events[l];


        //se obtiene el empleado
        let employee = await this.employeesService.findOne(element.employeeId);

        //se obtiene las incidencias para el empleado en la fecha del turno
        //VAC,INC, DFT, VacM, VACA, PSSE, PSS, PCS, 
        let incidence = await this.dataSource.manager.createQueryBuilder("employee_incidence", "ei")
          .innerJoinAndSelect("ei.dateEmployeeIncidence", "dei", "dei.employeeIncidenceId = ei.id")
          .innerJoinAndSelect("ei.incidenceCatologue", "ic", "ic.id = ei.incidenceCatologueId")
          .where("ei.employeeId = :employeeId", { employeeId: element.employeeId })
          .andWhere("dei.date = :date", { date: format(new Date(element.start), 'yyyy-MM-dd') })
          .andWhere("ic.code_band IN (:...codes)", { codes: ['VAC', 'INC', 'DFT', 'VacM', 'VACA', 'PSSE', 'PSS', 'PCS'] })
          .getRawOne();


        //si existe una incidencia, no se crea la asignacion
        //continua con el siguiente dia
        if (incidence) {
          continue;
        }

        //revisa si el empleado ya tiene una asignacion para la maquina de produccion en la fecha
        //y que el registro no este soft deleted
        //si ya existe la actualiza con la nueva maquina de produccion
        let existingAssignment = await this.productionMachineEmployeeRepository.findOne({
          where: {
            employee: { id: element.employeeId },
            //productionMachine: { id: createProductionMachineEmployeeDto.productionMachineId },
            date: format(new Date(element.start), 'yyyy-MM-dd') as any,
            deleted_at: IsNull(),
          },
        });

        if (existingAssignment) {
          existingAssignment.productionMachine = productionMachine;
          let updatedAssignment = await this.productionMachineEmployeeRepository.save(existingAssignment);
          continue;
        }

        let productionMachineEmployee = await this.productionMachineEmployeeRepository.create({
          date: format(new Date(element.start), 'yyyy-MM-dd') as any,
        });

        productionMachineEmployee.productionMachine = productionMachine;
        productionMachineEmployee.employee = employee.emp;

        arrayProductionMachineEmployees.push(productionMachineEmployee);
      }


      let saveProductionMachineEmployees = await this.productionMachineEmployeeRepository.save(arrayProductionMachineEmployees);


      return saveProductionMachineEmployees;
    } catch (error) {
      throw new BadRequestException('Error al crear la asignación máquina de producción - empleado');
    }


  }

  async findAll(searchProductionMachineEmployeeDto: SearchProductionMachineEmployeeDto): Promise<any[]> {
    try {
      const result = [];

      // Validar que se proporcionen employeeIds y rango de fechas
      if (!searchProductionMachineEmployeeDto.employeeIds ||
        !searchProductionMachineEmployeeDto.start_date ||
        !searchProductionMachineEmployeeDto.end_date) {
        throw new BadRequestException('Se requieren employeeIds, start_date y end_date');
      }

      // Construir filtros para asignaciones existentes
      const filters = {};
      filters['employee'] = { id: In(searchProductionMachineEmployeeDto.employeeIds) };
      filters['date'] = Between(
        searchProductionMachineEmployeeDto.start_date,
        searchProductionMachineEmployeeDto.end_date
      );

      if (searchProductionMachineEmployeeDto.productionMachineId) {
        filters['productionMachine'] = { id: searchProductionMachineEmployeeDto.productionMachineId };
      }

      // Obtener asignaciones existentes
      const assignments = await this.productionMachineEmployeeRepository.find({
        where: filters,
        relations: ['productionMachine', 'employee'],
      });

      // Obtener turnos de los empleados en el rango de fechas
      const shifts = await this.employeeShiftService.findMore(
        {
          start: searchProductionMachineEmployeeDto.start_date,
          end: searchProductionMachineEmployeeDto.end_date,
        },
        searchProductionMachineEmployeeDto.employeeIds,
      );

      // Procesar cada empleado y cada día del rango
      for (const employeeId of searchProductionMachineEmployeeDto.employeeIds) {
        const employee = await this.employeesService.findOne(employeeId);

        // Generar todas las fechas entre start_date y end_date
        const startDate = new Date(searchProductionMachineEmployeeDto.start_date);
        const endDate = new Date(searchProductionMachineEmployeeDto.end_date);

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          let arrayIncidences = [];
          const currentDate = format(new Date(date), 'yyyy-MM-dd');

          //VERIFICA SI EL DIA ES FERIADO
          const dayHoliday = await this.calendarService.findByDate(
            format(date, 'yyyy-MM-dd'),
          );

          // Buscar asignación de máquina para este empleado en esta fecha
          const assignment = assignments.find(
            a => a.employee.id === employeeId &&
              format(new Date(a.date), 'yyyy-MM-dd') === currentDate
          );

          // Buscar turno para esta fecha
          const shift = shifts.events.find(
            s => s.employeeId === employeeId &&
              format(new Date(s.start), 'yyyy-MM-dd') === currentDate
          );

          // Buscar incidencia para esta fecha
          const incidence = await this.dataSource.manager
            .createQueryBuilder("employee_incidence", "ei")
            .innerJoinAndSelect("ei.dateEmployeeIncidence", "dei", "dei.employeeIncidenceId = ei.id")
            .innerJoinAndSelect("ei.incidenceCatologue", "ic", "ic.id = ei.incidenceCatologueId")
            .where("ei.employeeId = :employeeId", { employeeId })
            .andWhere("dei.date = :date", { date: currentDate })
            .andWhere("ic.code_band IN (:...codes)", {
              codes: ['VAC', 'INC', 'DFT', 'VacM', 'VACA', 'PSSE', 'PSS', 'PCS']
            })
            .getOne();

          if (incidence) {
            arrayIncidences.push({
              id: incidence.id,
              code: incidence.incidenceCatologue?.code_band,
              description: incidence.descripcion,
            });
          }

          if (dayHoliday) {
            arrayIncidences.push({
              id: dayHoliday.id,
              code: 'FERIADO',
              description: dayHoliday.description,
            });
          }

          // Construir objeto de resultado unificado
          result.push({
            id: assignment?.id || null,
            employee: employee.emp,
            date: currentDate,
            productionMachine: assignment?.productionMachine || null,
            shift: shift ? {
              id: shift.id,
              start: shift.start,
              end: shift.end,
              title: shift.title,
            } : null,
            incidence: arrayIncidences.length > 0 ? arrayIncidences : null,
          });
        }
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error en los filtros de búsqueda');
    }
  }

  findOne(id: number) {
    return `This action returns a #id production-machine-employee`;
  }

  /* update(id: number, updateProductionMachineEmployeeDto: UpdateProductionMachineEmployeeDto) {
    return `This action updates a #id production-machine-employee`;
  } */

  //Quitar asignacion maquina de produccion - empleado
  async remove(id: number): Promise<void> {
    try {
      // Verificar que el registro existe
      const machineEmployee = await this.productionMachineEmployeeRepository.findOne({
        where: { id },
      });

      if (!machineEmployee) {
        throw new NotFoundException(
          `Asignación máquina de producción - empleado con ID ${id} no encontrada`,
        );
      }

      // Eliminar el registro
      await this.productionMachineEmployeeRepository.softDelete(id);
    } catch (error) {
      // Si es una excepción de NestJS, propagar
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Si es otro tipo de error, lanzar BadRequestException
      throw new BadRequestException(
        `Error al eliminar la asignación máquina de producción - empleado `,
      );
    }
  }
}
