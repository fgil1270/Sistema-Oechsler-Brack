import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';

import { CreateEmployeeShiftDto, UpdateEmployeeShiftDto } from '../dto/create-employee_shift.dto';
import { EmployeeShift } from "../entities/employee_shift.entity";
import { EmployeesService } from '../../employees/service/employees.service';
import { ShiftService } from '../../shift/service/shift.service';
import { PatternService } from '../../pattern/service/pattern.service';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';

@Injectable()
export class EmployeeShiftService {
  constructor(
    @InjectRepository(EmployeeShift) private employeeShiftRepository: Repository<EmployeeShift>,
    private readonly employeesService: EmployeesService,
    private readonly shiftService: ShiftService,
    private readonly patternService: PatternService,
    private readonly organigramaService: OrganigramaService
  ) {}

  async create(createEmployeeShiftDto: CreateEmployeeShiftDto) {
    const employee = await this.employeesService.findOne(createEmployeeShiftDto.employeeId);
    const shift = await this.shiftService.findOne(createEmployeeShiftDto.shiftId);
    const from = format(new Date(createEmployeeShiftDto.start_date), 'yyyy-MM-dd');
    console.log(from);
    let pattern: any = {} ;
    let employeeShiftExist: any = {} ;
    if( createEmployeeShiftDto.patternId == 0 ){
      employeeShiftExist = await this.employeeShiftRepository.findOne({
        relations: {
          employee: true,
          shift: true,
          pattern: true
        },
        where: {
          employee: {
            id: employee.emp.id
          },
          shift: {
            id: shift.shift.id
          },
          //start_date: MoreThanOrEqual(from)
        }
      });
      
    }else{
      pattern = await this.patternService.findOne(createEmployeeShiftDto.patternId);
      employeeShiftExist = await this.employeeShiftRepository.findOne({
        relations: {
          employee: true,
          shift: true,
          pattern: true
        },
        where: {
          employee: {
            id: employee.emp.id
          },
          shift: {
            id: shift.shift.id
          },
          pattern: {
            id: pattern.pattern.id
          },
          //start_date: MoreThanOrEqual(from)
        }
      });
    }


    if ( employeeShiftExist?.id ) {
      throw new BadRequestException(`El empleado ya tiene un turno`);
    }
    const employeeShift = this.employeeShiftRepository.create(createEmployeeShiftDto);
    employeeShift.employee = employee.emp;
    employeeShift.shift = shift.shift;
    employeeShift.pattern = pattern.pattern? pattern.pattern : null;
   
    console.log(employeeShift);
    return await this.employeeShiftRepository.save(employeeShift);
  }

  async findAll() {
    return `This action returns all employeeShift`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employeeShift`;
  }

  async findMore(data: any, ids: any) {
    
    const from = format(new Date(data.start), 'yyyy-MM-dd');
    const to = format(new Date(data.end), 'yyyy-MM-dd'); 
    //const from = new Date(data.start).getFullYear()+'-'+(new Date(data.start).getMonth()+1)+'-'+new Date(data.start).getDate(); 
    //const to = new Date(data.end).getFullYear()+'-'+(new Date(data.end).getMonth()+1)+'-'+new Date(data.end).getDate();
    
    const employees = await this.employeesService.findMore(ids.split(','));
    
    const resource = employees.emps.map((employee: any) => {
      return { 
        id: employee.id, 
        title: "#"+ employee.employee_number + " " + employee.name + ' ' + employee.paternal_surname + ' ' + employee.maternal_surname 
      }
    });
    
    const employeeShifts = await this.employeeShiftRepository.find({
      relations: {
        employee: true,
        shift: true,
        pattern: true
      },
      where: {
        employee: {
          id: In(ids.split(','))
        },
        //start_date: MoreThanOrEqual(new Date(data.start)),
        start_date: MoreThanOrEqual(from as any),
        end_date: LessThanOrEqual(to as any),
      }
    });
    
    const events = employeeShifts.map((employeeShift: any) => {
      return {
        id: employeeShift.id,
        resourceId: employeeShift.employee.id,
        title: employeeShift.shift.name,
        start: employeeShift.start_date,
        end: employeeShift.end_date,
        backgroundColor: employeeShift.shift.color,
        borderColor: employeeShift.shift.color,
        textColor: '#fff'
      }
    });
    
    return { resource, events };
  }

  async findEmployeeDeptLeader(idLeader: number, idDept: number) {
    const orgs = await this.organigramaService.findEmployeeByLeader(idLeader);
    const employees = await this.employeesService.findMore(orgs.idsEmployees);
    
    return employees;
  }


  async update(id: number, updateEmployeeShiftDto: UpdateEmployeeShiftDto) {
    return `This action updates a #${id} employeeShift`;
  }

  async remove(id: number) {
    return `This action removes a #${id} employeeShift`;
  }
}
