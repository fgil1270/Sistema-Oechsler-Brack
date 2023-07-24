import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { readFileSync } from "fs";
import { read, utils } from "xlsx";

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from "../entities/employee.entity";
import { JobsService } from '../../jobs/service/jobs.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { VacationsProfileService } from '../../vacations-profile/service/vacations-profile.service';
import { EmployeeProfilesService } from '../../employee-profiles/service/employee-profiles.service';
import { join } from 'path';
import { range } from 'rxjs';
import { table } from 'console';

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

  
  async readExcel(file) {
    //se obtiene el archivo
    const buf = readFileSync(join(process.cwd(), `./documents/temp/emp/${file.filename}`).toString());
    /* buf is a Buffer */
    const workbook = read(buf);
    //se genera el rango de lectura
    let range = utils.decode_range(workbook.Sheets['Todos']['!ref']);
    var row = {
      payRoll: {},
      department: {},
      vacationProfile: {},
      employeeProfile: {},
      job: {},
      worker: '',
      employee_number: 0,
      name: '',
      paternal_surname: '',
      maternal_surname: '',
      gender: '',
      birthdate: '',
      country: '',
      citizenship: '',
      state: '',
      city: '',
      location: '',
      rfc: '',
      curp: '',
      nss: '',
      work_term_date: '',
      email: '',
      phone: '',
      marital_status: '',
      visa: false,
      fm_two: false,
      travel: false,
      brigade_member: false,
      salary: 0,
      daily_salary: 0,
      date_employment: '',
      quote: 0,
      type_contract: '',
      worker_status: false
    };
    let listEmp = {};
    let column = 1;
    let createAllemployee = [];
    //se recorre el rango de lectura
    let total = range.e.r;
    let totalEdit = 0;
    let totalNew = 0;
    let totalError = 0;
    for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
      
      //for (let colNum = 0; colNum <= 1; colNum++) {
        var exNoEmployee = workbook.Sheets['Todos'][utils.encode_cell({r:rowNum, c:0 })];
        let name = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 6})];
        let paternal_surname = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 7})];
        let maternal_surname = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 8})];
        let puesto = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 2})];
        let departamento = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 3})];
        let nomina = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 4})];
        let tipeEmployee = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 5})];
        let profileEmployee = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 35})];
        let vacationProfile = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 36})];
        let gender = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 9})];
        let birthdate = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 10})];
        let country = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 11})];
        let citizenship = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 12})];
        let state = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 13})];
        let city = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 14})];
        let location = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 15})];
        let rfc = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 16})];
        let curp = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 17})];
        let nss = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 18})];
        let email = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 20})];
        let phone = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 21})];
        let marital_status = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 22})];
        let visa = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 23})];
        let fm_two = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 24})];
        let travel = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 25})];
        let brigade_member = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 26})];
        let salary = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 27})];
        let type_contract = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 28})];
        let daily_salary = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 29})];
        let date_employment = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 30})];
        let work_term_date = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 31})];
        let worker_status = workbook.Sheets['Todos'][utils.encode_cell({r: rowNum, c: 32})];

        let quote = 1;
        
        //SE VALIDA QUE NO EXISTAN CAMPOS VACIOS
        if (exNoEmployee === undefined || name === undefined || paternal_surname === undefined || maternal_surname === undefined ||
          puesto === undefined || departamento === undefined || nomina === undefined || tipeEmployee === undefined || profileEmployee === undefined ||
          vacationProfile === undefined || gender === undefined || birthdate === undefined || country === undefined || citizenship === undefined ||
          state === undefined || city === undefined || location === undefined || rfc === undefined || curp === undefined || nss === undefined ||
          email === undefined || phone === undefined || marital_status === undefined || visa === undefined || fm_two === undefined || travel === undefined ||
          brigade_member === undefined || salary === undefined || type_contract === undefined || daily_salary === undefined || date_employment === undefined ||
          work_term_date === undefined || worker_status === undefined ) {

          totalError++;
          continue;

        } else {
          //BUSCAMOS el puesto, departamento, nomina, tipo de empleado
          
          const tableJob = await this.jobsService.findName(puesto.w);
         
          //SI NO EXISTE EL PUESTO SE CREA
          let newJob = {};
          let newDepartment = {};
          if(!tableJob){
            const tableJobTotal = await this.jobsService.findAll();
            newJob = await this.jobsService.create({cv_code: (tableJobTotal.total+1).toString(), cv_name: puesto.w, shift_leader: false, plc: false});
          }
         
          const tableDepartment = await this.departmentsService.findName(departamento.w);
          //SI NO EXISTE EL DEPARTAMENTO SE CREA
          if (!tableDepartment) {
            const tableDepartmentTotal = await this.departmentsService.findAll();
            newDepartment = await this.departmentsService.create({cv_code: (tableDepartmentTotal.total+1).toString(), cv_description: departamento.w, cc: departamento.w.split(' ')[0]});
          }
          //BUSCAMOS LA NOMINA
          
          const tablePayRoll = await this.payrollsService.findName(nomina.w);
          if(!tablePayRoll){
            totalError++;
            continue;
          }
          
          //SE BUSCA EL PERFIL DE VACACIONES
          
          const tableVacationProfile = await this.vacationsProfileService.findName(vacationProfile.w);
          if(!tableVacationProfile){
            totalError++;
            continue;
          }
          //SE BUSCA EL PERFIL DE EMPLEADO
          
          const tableEmployeeProfile = await this.employeeProfilesService.findOne(profileEmployee.w);
          if(!tableEmployeeProfile){
            totalError++;
            continue;
          }
          

          //BUSCAMOS EL EMPLEADO
          const tableEmployee = await this.employeeRepository.findOne({
            where: {
              employee_number: exNoEmployee.w.trim()
            },
            relations: ['department', 'job', 'payRoll', 'vacationProfile', 'employeeProfile']
          });
          //SI EL EMPLEADO EXISTE SE EDITA Y SI NO SE CREA
          
          if (tableEmployee?.id) {
            
            try {
              
              row.payRoll = tablePayRoll? tablePayRoll.payroll : {};
              row.department = tableDepartment? tableDepartment.dept : {};
              row.vacationProfile = tableVacationProfile? tableVacationProfile.vacationsProfile : {};
              row.employeeProfile = tableEmployeeProfile? tableEmployeeProfile.emp : {};
              row.job = tableJob? tableJob.job: newJob;
              row.worker = tipeEmployee.w.toUpperCase();
              row.employee_number = exNoEmployee.w.trim();
              row.name = name.w.trim();
              row.paternal_surname = paternal_surname.w.trim();
              row.maternal_surname = maternal_surname.w.trim();
              row.gender = gender.w.trim();
              row.birthdate = new Date(birthdate.w.trim().replace('/', '-')).toISOString().split('T')[0];
              row.country = country.w.trim();
              row.citizenship = citizenship.w.trim();
              row.state = state.w.trim();
              row.city = city.w.trim();
              row.location = location.w.trim();
              row.rfc = rfc.w.trim();
              row.curp = curp.w.trim();
              row.nss = nss.w.toString().trim();
              row.email = email.w.trim();
              row.phone = phone.w.trim();
              row.marital_status = marital_status.w.trim();
              row.visa = visa.w.trim() === 'SI'? true : false;
              row.fm_two = fm_two.w.trim() === 'SI'? true : false;
              row.travel = travel.w.trim() === 'SI'? true : false;
              row.brigade_member = brigade_member.w.trim() === 'SI'? true : false;
              row.salary = salary.w.trim();
              row.daily_salary = daily_salary.w.trim();
              row.type_contract = type_contract.w.toString().trim();
              row.salary = salary.w.trim();
              row.date_employment = date_employment.w.trim();
              row.quote = quote;
              row.work_term_date = work_term_date.w.trim();
              row.worker_status = worker_status.w.trim() === 'A'? true : false;
              this.employeeRepository.update(tableEmployee.id, row);
              totalEdit++;
            } catch (error) {
              console.log(error);
              totalError++;
            }
            
          }else{
            //SE CREA EL EMPLEADO
            try {
              
              row.payRoll = tablePayRoll? tablePayRoll.payroll : {};
              row.department = tableDepartment? tableDepartment.dept : {};
              row.vacationProfile = tableVacationProfile? tableVacationProfile.vacationsProfile : {};
              row.employeeProfile = tableEmployeeProfile? tableEmployeeProfile.emp : {};
              row.job = tableJob? tableJob.job: newJob;
              row.worker = tipeEmployee.w.toUpperCase();
              row.employee_number = exNoEmployee.w.trim();
              row.name = name.w.trim();
              row.paternal_surname = paternal_surname.w.trim();
              row.maternal_surname = maternal_surname.w.trim();
              row.gender = gender.w.trim();
              row.birthdate = new Date(birthdate.w.trim().replace('/', '-')).toISOString().split('T')[0];
              row.country = country.w.trim();
              row.citizenship = citizenship.w.trim();
              row.state = state.w.trim();
              row.city = city.w.trim();
              row.location = location.w.trim();
              row.rfc = rfc.w.trim();
              row.curp = curp.w.trim();
              row.nss = nss.w.toString().trim();
              row.email = email.w.trim();
              row.phone = phone.w.trim();
              row.marital_status = marital_status.w.trim();
              row.visa = visa.w.trim() === 'SI'? true : false;
              row.fm_two = fm_two.w.trim() === 'SI'? true : false;
              row.travel = travel.w.trim() === 'SI'? true : false;
              row.brigade_member = brigade_member.w.trim() === 'SI'? true : false;
              row.salary = salary.w.trim();
              row.daily_salary = daily_salary.w.trim();
              row.type_contract = type_contract.w.toString().trim();
              row.salary = salary.w.trim();
              row.date_employment = date_employment.w.trim();
              row.quote = quote;
              row.work_term_date = work_term_date.w.trim();
              row.worker_status = worker_status.w.trim() === 'A'? true : false;
              const emp = this.employeeRepository.create(row);
              await this.employeeRepository.save(emp);
              //createAllemployee.push(row); 
              totalNew++;
              
            } catch (error) {
              console.log(error);
              totalError++;
            }
            
          }
          
        }
        
      //}
      
    }
    
    return { total: total, edit: totalEdit, new: totalNew, error: totalError };
    
  }
  
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
