import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from "../entities/employee.entity";
import { JobsService } from '../../jobs/service/jobs.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { VacationsProfileService } from '../../vacations-profile/service/vacations-profile.service';
import { EmployeeProfilesService } from '../../employee-profiles/service/employee-profiles.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    private jobsService: JobsService,
    private departmentsService: DepartmentsService,
    private payrollsService: PayrollsService,
    private vacationsProfileService: VacationsProfileService,
    private employeeProfilesService: EmployeeProfilesService
  ){}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const empExist = await this.employeeRepository.findOne({
      where: {
        employee_number: createEmployeeDto.employee_number
      }
    });
    
    if (empExist?.id) {
      throw new BadRequestException(`El Empleado ya existe`);
    }
    //SE BUSCA EL JOB
    const job = await this.jobsService.findOne(createEmployeeDto.jobId);
    const department = await this.departmentsService.findOne(createEmployeeDto.departmentId);
    const payRoll = await this.payrollsService.findOne(createEmployeeDto.payRollId);
    const vacationProfile = await this.vacationsProfileService.findOne(createEmployeeDto.vacationProfileId);
    const employeeProfile = await this.employeeProfilesService.findOne(createEmployeeDto.employeeProfileId);

    const emp = this.employeeRepository.create(createEmployeeDto);
    //asigna los valores a al empleado
    emp.job = job;
    emp.department = department.dept;
    emp.payRoll = payRoll.payroll;
    emp.vacationProfile = vacationProfile.vacationsProfile;
    emp.employeeProfile = employeeProfile.emp;

    
    return await this.employeeRepository.save(emp);
  }

  async findAll() {
    const total = await this.employeeRepository.count();
    const emps = await this.employeeRepository.find({
      relations: ['department', 'job', 'payRoll', 'vacationProfile', 'employeeProfile']
    });
    
    if (!emps) {
      throw new NotFoundException(`Employees not found`);
    }
    return {
      total: total,
      emps: emps
    };
  }

  async findOne(id: number) {
    const emp = await this.employeeRepository.findOne({
      where: {
        id: id
      },
      relations: ['department', 'job', 'payRoll', 'vacationProfile', 'employeeProfile']
    });
    if (!emp) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return {
      emp
    };
  }

  async update(id: number, updateEmployeeDto: CreateEmployeeDto) {
    const emp = await this.employeeRepository.findOneBy({id});
    if (!emp?.id) {
      throw new NotFoundException(`Employee #${id} not found`);
    }

    const empExist = await this.employeeRepository.findOne({
      where: {
        employee_number: updateEmployeeDto.employee_number
      }
    });
    if (empExist?.id) {
      throw new BadRequestException(`El Empleado ya existe`);
    }
    
    this.employeeRepository.merge(emp, updateEmployeeDto);
    return await this.employeeRepository.update(id, emp);
  }

  async remove(id: number) {
    const emp = await this.employeeRepository.findOne({
      where: {
        id: id
      }
    });
    if (!emp) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return await this.employeeRepository.softDelete(id);
  }
}
