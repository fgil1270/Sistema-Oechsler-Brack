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
} from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { format } from 'date-fns';

import { CreateProductionMachineEmployeeDto } from '../dto/production_machine_employee.dto';
import { ProductionMachineEmployee } from '../entities/production_machine_employee.entity';
import { EmployeeShiftService } from '../../employee_shift/service/employee_shift.service';
import { ProductionMachineService } from './production_machine.service';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class ProductionMachineEmployeeService {
  constructor(
    @InjectRepository(ProductionMachineEmployee)
    private productionMachineEmployeeRepository: Repository<ProductionMachineEmployee>,
    @InjectDataSource() private dataSource: DataSource,
    private employeeShiftService: EmployeeShiftService,
    private productionMachineService: ProductionMachineService,
    private employeesService: EmployeesService,
  ) { }

  //crear asignacion maquina de produccion - empleado
  async create(createProductionMachineEmployeeDto: CreateProductionMachineEmployeeDto) {

    let arrayProductionMachineEmployees = [];
    //se obtiene los turnos de los empleados para el rango de fechas
    let shifts = await this.employeeShiftService.findMore(
      {
        start: createProductionMachineEmployeeDto.start_date,
        end: createProductionMachineEmployeeDto.end_date,
      },
      createProductionMachineEmployeeDto.employeeIds,
    );

    //se mapean los turnos para crear las asignaciones de maquina de produccion - empleado
    for (let l = 0; l < shifts.events.length; l++) {
      const element = shifts.events[l];

      //se obtiene la maquina de produccion
      let productionMachine = await this.productionMachineService.findOne(createProductionMachineEmployeeDto.productionMachineId);
      //se obtiene el empleado
      let employee = await this.employeesService.findOne(element.employeeId);


      let productionMachineEmployee = await this.productionMachineEmployeeRepository.create({
        date: format(new Date(element.start), 'yyyy-MM-dd') as any,
      });

      productionMachineEmployee.productionMachine = productionMachine;
      productionMachineEmployee.employee = employee.emp;

      arrayProductionMachineEmployees.push(productionMachineEmployee);
    }

    console.log(arrayProductionMachineEmployees);
    return;

    let saveProductionMachineEmployees = await this.productionMachineEmployeeRepository.save(arrayProductionMachineEmployees);


    return saveProductionMachineEmployees;
  }

  findAll() {
    return `This action returns all production-machine-employees`;
  }

  findOne(id: number) {
    return `This action returns a #id production-machine-employee`;
  }

  /* update(id: number, updateProductionMachineEmployeeDto: UpdateProductionMachineEmployeeDto) {
    return `This action updates a #id production-machine-employee`;
  } */

  remove(id: number) {
    return `This action removes a #id production-machine-employee`;
  }
}
