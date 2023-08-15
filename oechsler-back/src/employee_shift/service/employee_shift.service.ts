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
    
    createEmployeeShiftDto.employeeId.forEach(async (element, i) => {
      
      
      const employee = await this.employeesService.findOne(element);
     
      let contSemana = 0;
      let contPeriodicidad = 0;
      let totalSerie = 0;
      for (let index = new Date(createEmployeeShiftDto.start_date); index <= new Date(createEmployeeShiftDto.end_date); index= new Date(index.setDate(index.getDate() + 1))) {
        //SI NO SE SELECCIONO UN PATRON DE TURNOS REALIZA LO SIGUENTE
        let start_date = new Date(new Date().setDate(index.getDate()));
        
        let end_date = new Date(new Date().setDate(index.getDate()));
        
        if(createEmployeeShiftDto.shiftId != 0){
          const shift = await this.shiftService.findOne(createEmployeeShiftDto.shiftId);
          console.log("shift");
          //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
          const employeeShiftExist = await this.employeeShiftRepository.findOne({
            relations: {
              employee: true,
              shift: true,
              pattern: true
            },
            where: {
              employee: {
                id: employee.emp.id
              },
              start_date: format(index, 'yyyy-MM-dd') as any
            }
          });
          console.log("buscamos registros");
          console.log("employeeShiftExist", employeeShiftExist);
          if(!employeeShiftExist){
            const employeeShift = this.employeeShiftRepository.create({
              employee: employee.emp,
              shift: shift.shift,
              start_date: format(index, 'yyyy-MM-dd') as any,
              end_date: format(index, 'yyyy-MM-dd') as any,
              pattern: null
            });
            console.log("si no existen los crea");
            console.log("employeeShift", employeeShift);
            await this.employeeShiftRepository.save(employeeShift);
          }else{
            employeeShiftExist.shift = shift.shift;
            await this.employeeShiftRepository.save(employeeShiftExist);
          }
          
        }else if(createEmployeeShiftDto.patternId != 0){
          
          //SI SE SELECCIONO UN PATRON DE TURNOS REALIZA LO SIGUENTE
          const pattern = await this.patternService.findOne(createEmployeeShiftDto.patternId);
         
          let diaLetra = "";
          let serie_shifts = pattern.pattern.serie_shifts.split(",");
          let periodicity = pattern.pattern.periodicity;
          totalSerie = serie_shifts.length;
          
          const shift = await this.shiftService.findOne(parseInt(serie_shifts[contSemana]));
          let dias: any = [];
          dias = shift.shift.day; //dias del turno
         
          switch (index.getDay()) {
            case 0:
              diaLetra = "D";
              break;
            case 1:
              diaLetra = "L";
              break;
            case 2:
              diaLetra = "M";
              break;
            case 3:
              diaLetra = "X";
              break;
            case 4:
              diaLetra = "J";
              break;
            case 5:
              diaLetra = "V";
              break;
            case 6:
              diaLetra = "S";
              break;
          }
          
          let existeDia = dias.find((element, i) => {
            if(element == diaLetra){
              return true;
            }
          });
          // SI EXISTE EL DIA SELECCIONADO EN LOS DIAS DEL TURNO
         
            //EL CONTADOR DE PERIDICIDAD ES MENOR A LA PERIODICIDAD DEL PATRON DE TURNOS
            if(contPeriodicidad < periodicity){
              console.log("periodicidad menor");
              //VERIFICA SI EXISTE UN TURNO PARA EL EMPLEADO EN ESA FECHA
              //SI NO EXISTE REGISTRO LO CREA
              if(existeDia){
                const employeeShiftExist = await this.employeeShiftRepository.findOne({
                  relations: {
                    employee: true,
                    shift: true,
                    pattern: true
                  },
                  where: {
                    employee: {
                      id: employee.emp.id
                    },
                    start_date: format(index, 'yyyy-MM-dd') as any
                  }
                });
              
                if(!employeeShiftExist){
                  const employeeShift = this.employeeShiftRepository.create({
                    employee: employee.emp,
                    shift: shift.shift,
                    start_date: format(index, 'yyyy-MM-dd') as any,
                    end_date: format(index, 'yyyy-MM-dd') as any,
                    pattern: pattern.pattern
                  });
                  
                  await this.employeeShiftRepository.save(employeeShift);
                }else{
                  employeeShiftExist.shift = shift.shift;
                  employeeShiftExist.pattern = pattern.pattern;
                  await this.employeeShiftRepository.save(employeeShiftExist);
                }
              }
              
            }else{
              
              //SI EL CONTADOR DE PERIODICIDAD ES MAYOR A LA PERIODICIDAD DEL PATRON DE TURNOS
              //REINICIA EL CONTADOR DE PERIODICIDAD
              //AUMENTA EL CONTADOR DE SEMANA
              contPeriodicidad = 0;
              contSemana++;
              //SI EL CONTADOR DE SEMANA ES MENOR AL TOTAL DE SERIES DEL PATRON DE TURNOS
              if(contSemana < totalSerie){
                const shift = await this.shiftService.findOne(parseInt(serie_shifts[contSemana]));
              }else{
                
                //SI EL CONTADOR DE SEMANA IGUAL O MAYOR AL TOTAL DE SERIES DEL PATRON DE TURNOS
                //REINICIA EL CONTADOR DE SEMANA
                contSemana = 0;
                const shift = await this.shiftService.findOne(parseInt(serie_shifts[contSemana]));
              }
              if(existeDia){

                const employeeShiftExist = await this.employeeShiftRepository.findOne({
                  relations: {
                    employee: true,
                    shift: true,
                    pattern: true
                  },
                  where: {
                    employee: {
                      id: employee.emp.id
                    },
                    start_date: format(index, 'yyyy-MM-dd') as any
                  }
                });
                
                if(!employeeShiftExist){
                  const employeeShift = this.employeeShiftRepository.create({
                    employee: employee.emp,
                    shift: shift.shift,
                    start_date: format(index, 'yyyy-MM-dd') as any,
                    end_date: format(index, 'yyyy-MM-dd') as any,
                    pattern: pattern.pattern
                  });
                  
                  await this.employeeShiftRepository.save(employeeShift);
                }else{
                  employeeShiftExist.shift = shift.shift;
                  employeeShiftExist.pattern = pattern.pattern;
                  await this.employeeShiftRepository.save(employeeShiftExist);
                }
              }
              
            }
          
          
          if(index.getDay() == 6 && shift.shift.name == "Turno 1"){
            contPeriodicidad++;
          }
          if(index.getDay() == 6 && shift.shift.name == "Turno 2"){
            contPeriodicidad++;
          }
          if(index.getDay() == 5 && shift.shift.name == "Turno 3"){
            contPeriodicidad++;
          }
          if(index.getDay() == 5 && shift.shift.name == "Mixto"){
            contPeriodicidad++;
          }

        }
        
      }
      
    });

    return;
    
  }

  async findAll() {
    const total = await this.employeeShiftRepository.count();
    const employeeShifts = await this.employeeShiftRepository.find({
      relations: {
        employee: true,
        shift: true,
        pattern: true
      }
    });

    if (!employeeShifts) {
      throw new NotFoundException(`EmployeeShifts not found`);
    }

    return { total, employeeShifts };
  }

  async findOne(id: number) {
    const employeeShift = await this.employeeShiftRepository.findOne(
      {
        relations: {
          employee: true,
          shift: true,
          pattern: true
        },
        where: {
          id: id
        }
      
      });
    if (!employeeShift) {
      throw new NotFoundException(`EmployeeShift #${id} not found`);
    }
    return employeeShift;
    
  }

  async findMore(data: any, ids: any) {
    
    const from = format(new Date(data.start), 'yyyy-MM-dd');
    const to = format(new Date(data.end), 'yyyy-MM-dd'); 
    
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
      let textColor = '#fff';
      if(employeeShift.shift.color == '#faf20f'){
        textColor = '#000';
      }
      return {
        id: employeeShift.id,
        resourceId: employeeShift.employee.id,
        title: employeeShift.shift.name,
        start: employeeShift.start_date,
        end: employeeShift.end_date,
        backgroundColor: employeeShift.shift.color,
        borderColor: employeeShift.shift.color,
        textColor: textColor
      }
    });
    
    return { resource, events };
  }

  async findEmployeeDeptLeader(idLeader: number, idDept: number, idUser: number) {
    const orgs = await this.organigramaService.findEmployeeByLeader(idLeader, idUser);
    
    const employeesTest = await this.employeeShiftRepository.find({
      relations: {
        employee: {
          department: true
        }
      },
      where: {
        employee : {
          id: In(orgs.idsEmployees),
          department: {
            id: idDept
          }
        }
        /* employee: {
          department: {
            id: idDept
          }
        } */
      }
    });
    let ids = [];
    employeesTest.forEach((employee: any) => {
      ids.push(employee.employee.id);
    });
    
    const employees = await this.employeesService.findMore(ids);
    return employees;
  }


  async update(id: number, updateEmployeeShiftDto: UpdateEmployeeShiftDto) {
    return `This action updates a #${id} employeeShift`;
  }

  async remove(id: number) {
    const employeeShift = await this.employeeShiftRepository.findOne({
      where: {
        id: id
      }
    });

    if (!employeeShift) {
      throw new NotFoundException(`EmployeeShift #${id} not found`);
    }
    
    return await this.employeeShiftRepository.remove(employeeShift);
  }
}
