import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile, readFileSync, writeFile } from 'fs';
import { read, utils } from 'xlsx';
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { JobsService } from '../../jobs/service/jobs.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { VacationsProfileService } from '../../vacations-profile/service/vacations-profile.service';
import { EmployeeProfilesService } from '../../employee-profiles/service/employee-profiles.service';
import { join } from 'path';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { date } from 'joi';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jobsService: JobsService,
    private departmentsService: DepartmentsService,
    private payrollsService: PayrollsService,
    private vacationsProfileService: VacationsProfileService,
    private employeeProfilesService: EmployeeProfilesService,
    private organigramaService: OrganigramaService,
  ) {}

  async readExcel(file) {
    //LEER ARCHIVO TXT
    if (file.mimetype === 'text/plain') {
      //primera opción
      /*  var content =  readFileSync(`./documents/temp/emp/${file.filename}`, 'utf8');
      

      const objRead = JSON.parse(
        readFileSync(`./documents/temp/emp/${file.filename}`, {
          encoding: 'utf-8',
        }),
      );

      /* readFile(`./documents/temp/emp/${file.filename}`, function read(err, data) {
             if (err) {
                 throw err;
             }
             content = data;
             
         }); */

      //opcion 2
      /*  function readDemo1(file1) {
          return new Promise(function (resolve, reject) {
              fs.readFile(file1, 'utf8', function (err, dataDemo1) {
                  if (err)
                      reject(err);
                  else
                      resolve(dataDemo1);
              });
          });
      }
      async function copyFile() {
      
          try {
              let dataDemo1 = await readDemo1('url')
              dataDemo1 += '\n' +  await readDemo1('url')
      
              await writeDemo2(dataDemo1)
              
          } catch (error) {
              console.error(error);
          }
      }
      copyFile();
      
      function writeDemo2(dataDemo1) {
          return new Promise(function(resolve, reject) {
            fs.writeFile('text.txt', dataDemo1, 'utf8', function(err) {
              if (err)
                reject(err);
              else
                resolve("Promise Success!");
            });
          });
        } */

      return;
      //writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
      const bufTxt = readFileSync(
        join(process.cwd(), `./documents/temp/emp/${file.filename}`).toString(),
      );
      const archivoTxt = read(bufTxt);
      const rangeTxt = utils.decode_range(archivoTxt.Sheets['Sheet1']['!ref']);
      const rowTxt =
        archivoTxt.Sheets['Sheet1'][utils.encode_cell({ r: 0, c: 0 })];
    }

    //se obtiene el archivo
    const buf = readFileSync(
      join(process.cwd(), `./documents/temp/emp/${file.filename}`).toString(),
    );
    /* buf is a Buffer */
    const workbook = read(buf);
    //se genera el rango de lectura
    const range = utils.decode_range(workbook.Sheets['Todos']['!ref']);
    const row = {
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
      worker_status: false,
    };
    const listEmp = {};
    const column = 1;
    const createAllemployee = [];
    //se recorre el rango de lectura
    const total = range.e.r;
    let totalEdit = 0;
    let totalNew = 0;
    let totalError = 0;
    const errors = [];
    for (let rowNum = 1; rowNum < range.e.r; rowNum++) {
      //for (let colNum = 0; colNum <= 1; colNum++) {
      const exNoEmployee =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 0 })];
      const idJob =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 2 })];
      const name =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 7 })];
      const paternal_surname =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 8 })];
      const maternal_surname =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 9 })];
      const puesto =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 3 })];
      const departamento =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 4 })];
      const nomina =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 5 })];
      const tipeEmployee =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 6 })];
      const profileEmployee =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 36 })];
      const vacationProfile =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 37 })];
      const gender =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 10 })];
      const birthdate =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 11 })];
      const country =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 12 })];
      const citizenship =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 13 })];
      const state =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 14 })];
      const city =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 15 })];
      const location =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 16 })];
      const rfc =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 17 })];
      const curp =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 18 })];
      const nss =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 19 })];
      const email =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 21 })];
      const phone =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 22 })];
      const marital_status =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 23 })];
      const visa =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 24 })];
      const fm_two =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 25 })];
      const travel =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 26 })];
      const brigade_member =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 27 })];
      const salary =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 28 })];
      const type_contract =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 29 })];
      const daily_salary =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 30 })];
      const date_employment =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 31 })];
      const work_term_date =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 32 })];
      const worker_status =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 33 })];

      const quote = 1;

      //validar email
      //email === undefined ||

      //SE VALIDA QUE NO EXISTAN CAMPOS VACIOS
      if (exNoEmployee === undefined) {
        continue;
      }

      if (
        exNoEmployee === undefined ||
        idJob === undefined ||
        name === undefined ||
        paternal_surname === undefined ||
        maternal_surname === undefined ||
        puesto === undefined ||
        departamento === undefined ||
        nomina === undefined ||
        tipeEmployee === undefined ||
        profileEmployee === undefined ||
        vacationProfile === undefined ||
        gender === undefined ||
        birthdate === undefined ||
        country === undefined ||
        citizenship === undefined ||
        state === undefined ||
        city === undefined ||
        location === undefined ||
        rfc === undefined ||
        curp === undefined ||
        nss === undefined ||
        salary === undefined ||
        type_contract === undefined ||
        daily_salary === undefined ||
        date_employment === undefined ||
        worker_status === undefined
      ) {
        totalError++;
        errors.push({
          id: exNoEmployee.v ? exNoEmployee.v : exNoEmployee.v,
          error: 'valor vacio',
        });
        continue;
      } else {
        //BUSCAMOS el puesto, departamento, nomina, tipo de empleado

        const tableJob = await this.jobsService.findOne(idJob.w);

        //SI NO EXISTE EL PUESTO SE CREA
        const newJob = {};
        let newDepartment = {};
        if (!tableJob) {
          totalError++;
          errors.push({
            id: exNoEmployee.v,
            error: 'puesto',
          });
          continue;
        }

        const tableDepartment = await this.departmentsService.findName(
          departamento.w,
        );
        //SI NO EXISTE EL DEPARTAMENTO SE CREA
        if (!tableDepartment) {
          const tableDepartmentTotal = await this.departmentsService.findAll();
          newDepartment = await this.departmentsService.create({
            cv_code: (tableDepartmentTotal.total + 1).toString(),
            cv_description: departamento.w,
            cc: departamento.w.split(' ')[0],
          });
        }
        //BUSCAMOS LA NOMINA

        const tablePayRoll = await this.payrollsService.findName(nomina.w);
        if (!tablePayRoll) {
          totalError++;
          errors.push({
            id: exNoEmployee.v,
            error: 'nomina',
          });
          continue;
        }

        //SE BUSCA EL PERFIL DE VACACIONES

        const tableVacationProfile =
          await this.vacationsProfileService.findName(vacationProfile.w);
        if (!tableVacationProfile) {
          totalError++;
          errors.push({
            id: exNoEmployee.v,
            error: 'perfil de vacaciones',
          });
          continue;
        }
        //SE BUSCA EL PERFIL DE EMPLEADO

        const tableEmployeeProfile = await this.employeeProfilesService.findOne(
          profileEmployee.w,
        );
        if (!tableEmployeeProfile) {
          totalError++;
          errors.push({
            id: exNoEmployee.v,
            error: 'perfil de empleado',
          });
          continue;
        }

        //BUSCAMOS EL EMPLEADO
        const tableEmployee = await this.employeeRepository.findOne({
          where: {
            employee_number: exNoEmployee.w.trim(),
          },
          relations: [
            'department',
            'job',
            'payRoll',
            'vacationProfile',
            'employeeProfile',
          ],
        });
        //SI EL EMPLEADO EXISTE SE EDITA Y SI NO SE CREA

        if (tableEmployee?.id) {
          try {
            row.payRoll = tablePayRoll ? tablePayRoll.payroll : {};
            row.department = tableDepartment ? tableDepartment.dept : {};
            row.vacationProfile = tableVacationProfile
              ? tableVacationProfile.vacationsProfile
              : {};
            row.employeeProfile = tableEmployeeProfile
              ? tableEmployeeProfile.emp
              : {};
            row.job = tableJob ? tableJob : newJob;
            row.worker = tipeEmployee.w.toUpperCase();
            row.employee_number = exNoEmployee.w.trim();
            row.name = name.w.trim();
            row.paternal_surname = paternal_surname.w.trim();
            row.maternal_surname = maternal_surname.w.trim();
            row.gender = gender.w.trim();
            row.birthdate = new Date(birthdate.w.trim().replace('/', '-'))
              .toISOString()
              .split('T')[0];
            row.country = country.w.trim();
            row.citizenship = citizenship.w.trim();
            row.state = state.w.trim();
            row.city = city.w.trim();
            row.location = location.w.trim();
            row.rfc = rfc.w.trim();
            row.curp = curp.w.trim();
            row.nss = nss.w.toString().trim();
            row.email = email ? email.w.trim() : '';
            row.phone = phone ? phone.w.trim() : '';
            row.marital_status = marital_status ? marital_status.w.trim() : '';
            row.visa = visa.w.trim() === 'SI' ? true : false;
            row.fm_two = fm_two.w.trim() === 'SI' ? true : false;
            row.travel = travel.w.trim() === 'SI' ? true : false;
            row.brigade_member =
              brigade_member.w.trim() === 'SI' ? true : false;
            row.salary = salary.w.trim();
            row.daily_salary = daily_salary.w.trim();
            row.type_contract = type_contract.w.toString().trim();
            row.salary = salary.w.trim();
            row.date_employment = date_employment.w.trim();
            row.quote = quote;
            row.work_term_date =
              work_term_date != undefined ? work_term_date.w.trim() : null;
            row.worker_status = worker_status.w.trim() === 'A' ? true : false;
            this.employeeRepository.update(tableEmployee.id, row);
            totalEdit++;
          } catch (error) {
            totalError++;
            errors.push({
              id: exNoEmployee.v,
              error: 'edita: ' + error,
            });
          }
        } else {
          //SE CREA EL EMPLEADO
          try {
            row.payRoll = tablePayRoll ? tablePayRoll.payroll : {};
            row.department = tableDepartment ? tableDepartment.dept : {};
            row.vacationProfile = tableVacationProfile
              ? tableVacationProfile.vacationsProfile
              : {};
            row.employeeProfile = tableEmployeeProfile
              ? tableEmployeeProfile.emp
              : {};
            row.job = tableJob ? tableJob : newJob;
            row.worker = tipeEmployee.w.toUpperCase();
            row.employee_number = exNoEmployee.w.trim();
            row.name = name.w.trim();
            row.paternal_surname = paternal_surname.w.trim();
            row.maternal_surname = maternal_surname.w.trim();
            row.gender = gender.w.trim();
            row.birthdate = new Date(birthdate.w.trim().replace('/', '-'))
              .toISOString()
              .split('T')[0];
            row.country = country.w.trim();
            row.citizenship = citizenship.w.trim();
            row.state = state.w.trim();
            row.city = city.w.trim();
            row.location = location.w.trim();
            row.rfc = rfc.w.trim();
            row.curp = curp.w.trim();
            row.nss = nss.w.toString().trim();
            row.email = email ? email.w.trim() : '';
            row.phone = phone ? phone.w.trim() : '';
            row.marital_status = marital_status ? marital_status.w.trim() : '';
            row.visa = visa.w.trim() === 'SI' ? true : false;
            row.fm_two = fm_two.w.trim() === 'SI' ? true : false;
            row.travel = travel.w.trim() === 'SI' ? true : false;
            row.brigade_member =
              brigade_member.w.trim() === 'SI' ? true : false;
            row.salary = salary.w.trim();
            row.daily_salary = daily_salary.w.trim();
            row.type_contract = type_contract.w.toString().trim();
            row.salary = salary.w.trim();
            row.date_employment = date_employment.w.trim();
            row.quote = quote;
            row.work_term_date =
              work_term_date != undefined ? work_term_date.w.trim() : null;
            row.worker_status = worker_status.w.trim() === 'A' ? true : false;
            const emp = this.employeeRepository.create(row);
            await this.employeeRepository.save(emp);
            //createAllemployee.push(row);
            totalNew++;
          } catch (error) {
            totalError++;
            errors.push({
              id: exNoEmployee.v,
              error: 'se crea: ' + error,
            });
          }
        }
      }

      //}
    }

    return {
      total: total,
      edit: totalEdit,
      new: totalNew,
      error: totalError,
      empleados: errors,
    };
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const empExist = await this.employeeRepository.findOne({
      where: {
        employee_number: createEmployeeDto.employee_number,
      },
    });

    if (empExist?.id) {
      throw new BadRequestException(`El Empleado ya existe`);
    }
    //SE BUSCA EL JOB
    const job = await this.jobsService.findOne(createEmployeeDto.jobId);
    const department = await this.departmentsService.findOne(
      createEmployeeDto.departmentId,
    );
    const payRoll = await this.payrollsService.findOne(
      createEmployeeDto.payRollId,
    );
    const vacationProfile = await this.vacationsProfileService.findOne(
      createEmployeeDto.vacationProfileId,
    );
    const employeeProfile = await this.employeeProfilesService.findOne(
      createEmployeeDto.employeeProfileId,
    );

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
      relations: [
        'department',
        'job',
        'payRoll',
        'vacationProfile',
        'employeeProfile',
      ],
      order: {
        employee_number: 'ASC',
      },
    });

    if (!emps) {
      throw new NotFoundException(`Employees not found`);
    }
    return {
      total: total,
      emps: emps,
    };
  }

  //buscar por id
  async findOne(id: number) {
    const emp = await this.employeeRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        department: true,
        job: true,
        payRoll: true,
        vacationProfile: true,
        employeeProfile: true,
        userId: {
          roles: true,
        },
      },
    });

    if (!emp) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return {
      emp,
    };
  }

  //Buscar por array de ids de empleados
  async findMore(ids: any[]) {
    const emps = await this.employeeRepository.find({
      where: {
        id: In(ids),
      },
      relations: [
        'department',
        'job',
        'payRoll',
        'vacationProfile',
        'employeeProfile',
      ],
      order: {
        employee_number: 'ASC',
        //name: 'ASC'
      },
    });

    if (!emps) {
      throw new NotFoundException(`Employee #${ids} not found`);
    }
    return {
      emps,
    };
  }

  //Buscar por array de numero de empleado
  async findByEmployeeNumber(ids: any) {
    const emps = await this.employeeRepository.find({
      where: {
        employee_number: In(ids),
      },
      relations: [
        'department',
        'job',
        'payRoll',
        'vacationProfile',
        'employeeProfile',
      ],
      order: {
        employee_number: 'ASC',
        //name: 'ASC'
      },
    });

    if (!emps) {
      throw new NotFoundException(`Employee #${ids} not found`);
    }
    return {
      emps,
    };
  }

  //Buscar por tipo de nomina
  async findByNomina(tipo: string) {
    let whereTipo = {};
    if (tipo != 'Todas') {
      whereTipo = {
        payRoll: {
          name: tipo,
        },
      };
    } else {
      whereTipo = {};
    }
    const emps = await this.employeeRepository.find({
      where: whereTipo,
      relations: [
        'department',
        'job',
        'payRoll',
        'vacationProfile',
        'employeeProfile',
      ],
      order: {
        employee_number: 'ASC',
        //name: 'ASC'
      },
    });

    if (!emps) {
      throw new NotFoundException(`Employee #${tipo} not found`);
    }
    return {
      emps,
    };
  }

  //BUSCA LOS EMPLEADOS QUE NO ESTEN DENTRO DEL RANGO DE IDS
  //PARA LA RELACION EN EL ORGANIGRAMA
  async findLeaders(ids: any) {
    const leaders = await this.employeeRepository.find({
      where: {
        id: Not(In(ids)),
      },
    });

    return leaders;
  }

  async update(id: number, updateEmployeeDto: CreateEmployeeDto) {
    const emp = await this.employeeRepository.findOneBy({ id });
    if (!emp?.id) {
      throw new NotFoundException(`Employee #${id} not found`);
    }

    const empExist = await this.employeeRepository.findOne({
      where: {
        employee_number: updateEmployeeDto.employee_number,
      },
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
        id: id,
      },
    });
    if (!emp) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return await this.employeeRepository.softDelete(id);
  }

  //reporte de vacaciones
  async vacationReport(data, user) {
    const employee = await this.organigramaService.findJerarquia(
      {
        type: data.type,
        startDate: '',
        endDate: '',
      },
      user,
    );

    const report = [];
    for (let index = 0; index < employee.length; index++) {
      const emp = employee[index];
      const row = {};
      const ingreso = moment(new Date(emp?.date_employment)); // dia de ingreso
      const diaConsulta = moment(new Date(data.startDate)); //dia de consulta del reporte
      const anoCumplidos = diaConsulta.diff(ingreso, 'years', true); // años cumplidos al dia del reporte
      const finAno = moment(new Date(new Date(data.startDate).getFullYear(), 11, 31)); //fin de año
      const anoCumplidosFinAno = finAno.diff(ingreso, 'years', true); //años cumplidos a fin de año

      //se obtiene el perfil del empleado
      const vacationsAno = await this.vacationsProfileService.findOne(emp.vacationProfile.id);

      let dayUsedAllYears = 0;
      //se obtiene el ajuste de vacaciones
      const adjustmentVacation = await this.employeeRepository.findOne({
        where: {
          logAdjustmentVacationEmployee: {
            employee: {
              id: emp.id,
            },
          },
        },
        relations: {
          logAdjustmentVacationEmployee: true,
        },
        order: {
          logAdjustmentVacationEmployee: {
            created_at: "DESC",
          }
        }

      });
      //let adjustment = await this.logAdjustmentVacationService.findby({id_employee: emp.id}); //log de ajuste de vacaciones

      //se calculan los dias de vacaciones al dia de la consulta
      const arrayAno = anoCumplidos.toFixed(2).split('.');
      const objDiasByAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayAno[0]));
      const objDiasBysiguenteAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayAno[0]) != 0 ? parseInt(arrayAno[0]) + 1 : 1));
      const totalDiasByAno = objDiasByAno ? objDiasByAno.total : 0;
      const sumDiasSiguenteAno = (parseInt(arrayAno[1]) / 100) * objDiasBysiguenteAno.day;
      const sumaDiasAntiguedad = totalDiasByAno + sumDiasSiguenteAno;
      //se calculan los dias de vacaciones a fin de año
      const arrayFinAno = anoCumplidosFinAno.toFixed(2).split('.');
      const objDiasByAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayFinAno[0]));
      const objDiasBysiguenteAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayFinAno[0]) != 0 ? parseInt(arrayFinAno[0]) + 1 : 1));
      const totalDiasByFinAno = objDiasByAnoFin ? objDiasByAnoFin.total : 0;
      const sumDiasSiguenteAnoFin = (parseInt(arrayFinAno[1]) / 100) * objDiasBysiguenteAnoFin.day;
      const sumaDiasAntiguedadFin = totalDiasByFinAno + sumDiasSiguenteAnoFin;
      let totalDiasVacacionesMedioDia = 0;

      //se obtienen las incidencias de vacaciones
      const incidenciaVacaciones = await this.employeeRepository.findOne({
        where: {
          id: emp.id,
          employeeIncidence: {
            incidenceCatologue: {
              code_band: In(['VAC', 'VACA']),
            },
            status: In(['Autorizada', 'Pendiente']),
          },
        },
        relations: {
          employeeIncidence: {
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
        },
      });

      //se obtinene las incidencias de vacacion medio dia
      const incidenciaVacacionesMedioDia = await this.employeeRepository.count({
        where: {
          id: emp.id,
          employeeIncidence: {
            incidenceCatologue: {
              code: In(['VacM']),
            },
            status: In(['Autorizada', 'Pendiente']),
          },
        },
        relations: {
          employeeIncidence: {
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
        },
      });

      
      
      //si no existe ajuste
      //se realiza el calculo con las incidencias
      if (!adjustmentVacation) {
        //si existen vacaciones medio dia, se suman
        if (incidenciaVacacionesMedioDia > 0) {
          totalDiasVacacionesMedioDia = incidenciaVacacionesMedioDia * 0.5;
        }

        //se suman los dias de vacaciones por incidencia
        incidenciaVacaciones?.employeeIncidence.forEach((element) => {
          element.dateEmployeeIncidence.forEach((element) => {
            dayUsedAllYears++;
          });
        });
        //se suman las vacaciones de medio dia
        dayUsedAllYears += Number(totalDiasVacacionesMedioDia); //total de vacaciones
        
      } else {
        //si existe ajuste toma el valor del ajuste
        //y toma las incidencias posteriores al dia de ajuste
        //y sumas las cantidades

        let totalDiasIncidencia = 0;
        //vacaciones normales y adelantadas
        const newIncidenceNormales = await this.employeeRepository.findOne({
          relations: {
            employeeIncidence: {
              dateEmployeeIncidence: true,
              incidenceCatologue: true,
            },
          },
          where: {
            id: emp.id,
            employeeIncidence: {
              dateEmployeeIncidence: {
                date: MoreThanOrEqual(
                  format(
                    new Date(
                      adjustmentVacation.logAdjustmentVacationEmployee[
                        adjustmentVacation.logAdjustmentVacationEmployee
                          .length - 1
                      ].created_at,
                    ),
                    'yyyy-MM-dd',
                  ) as any,
                ),
              },
              status: In(['Autorizada', 'Pendiente']),
              incidenceCatologue: {
                code_band: In(['VAC', 'VACA'])
              },
            },
          },
        });

        //vacaciones medio dia
        const newIncidenceVacMedioDia = await this.employeeRepository.findOne({
          relations: {
            employeeIncidence: {
              dateEmployeeIncidence: true,
              incidenceCatologue: true,
            },
          },
          where: {
            id: emp.id,
            employeeIncidence: {
              dateEmployeeIncidence: {
                date: MoreThanOrEqual(
                  format(
                    new Date(
                      adjustmentVacation.logAdjustmentVacationEmployee[
                        adjustmentVacation.logAdjustmentVacationEmployee
                          .length - 1
                      ].created_at,
                    ),
                    'yyyy-MM-dd',
                  ) as any,
                ),
              },
              status: In(['Autorizada', 'Pendiente']),
              incidenceCatologue: {
                code_band: In(['VacM']),
              },
            },
          },
        });


        if (newIncidenceNormales) {
          for (
            let index = 0;
            index < newIncidenceNormales.employeeIncidence.length;
            index++
          ) {
            const element = newIncidenceNormales.employeeIncidence[index];
            totalDiasIncidencia += element.dateEmployeeIncidence.length;
          }
        }

        if (newIncidenceVacMedioDia) {
          for (let index = 0; index < newIncidenceVacMedioDia.employeeIncidence.length; index++) {
            const element = newIncidenceVacMedioDia.employeeIncidence[index];
            totalDiasIncidencia += Number(element.dateEmployeeIncidence.length) * Number(0.5);
          } 
        } 
        
        dayUsedAllYears = Number(adjustmentVacation.logAdjustmentVacationEmployee[0].new_value) + parseFloat(totalDiasIncidencia.toFixed(2));
      }

      row['id'] = emp.id;
      row['perfil'] = emp.employeeProfile.name;
      row['num_employee'] = emp.employee_number;
      row['nombre'] = emp.name + ' ' + emp.paternal_surname + ' ' + emp.maternal_surname;
      row['ingreso'] = emp.date_employment;
      row['anos_cumplidos'] = anoCumplidos.toFixed(2); //años cumplidos
      row['anos_fin_ano'] = anoCumplidosFinAno.toFixed(2); //años cumplidos hasta fin de año
      row['dias_antiguedad_fin_ano'] = sumaDiasAntiguedadFin.toFixed(2); //dias proporcionales por antiguedad hasta fin de año
      row['dias_antiguedad'] = sumaDiasAntiguedad.toFixed(2); //dias proporcionales por antiguedad
      row['dias_utilizados_all_years'] = dayUsedAllYears.toFixed(2); //dias utilizados(todos los años)
      row['dias_disponibles_dia_hoy'] = (sumaDiasAntiguedad - dayUsedAllYears).toFixed(2); //dias disponibles al dia de hoy
      row['dias_disponibles_fin_ano'] = (sumaDiasAntiguedadFin - dayUsedAllYears).toFixed(2); //dias disponibles hasta fin de año
      report.push(row);
    }

    return report;
  }

  //consultar vacaciones por empleado
  async vacationByEmployee(id: number, data:any){

    const emp = await this.employeeRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        department: true,
        job: true,
        payRoll: true,
        vacationProfile: true,
        employeeProfile: true,
        employeeIncidence: true,
      },
    });
    const dateStart = new Date(data.start);
    const dateEnd = new Date(data.end);
    const report = [];
    const row = {};
    const ingreso = moment(new Date(emp?.date_employment)); // dia de ingreso
    const diaConsulta = moment(new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())); //dia de consulta del reporte
    const anoCumplidos = diaConsulta.diff(ingreso, 'years', true); // años cumplidos al dia del reporte
    const finAno = moment(new Date(new Date().getFullYear(), 11, 31)); //fin de año
    const anoCumplidosFinAno = finAno.diff(ingreso, 'years', true); //años cumplidos a fin de año

    const vacationsAno = await this.vacationsProfileService.findOne(
      emp.vacationProfile.id,
    );

    let dayUsedAllYears = 0;
    const adjustmentVacation = await this.employeeRepository.findOne({
      where: {
        logAdjustmentVacationEmployee: {
          employee: {
            id: emp.id,
          },
        },
      },
      relations: {
        logAdjustmentVacationEmployee: true,
      },
    });
    //let adjustment = await this.logAdjustmentVacationService.findby({id_employee: emp.id}); //log de ajuste de vacaciones

    //se calculan los dias de vacaciones al dia de la consulta
    const arrayAno = anoCumplidos.toFixed(2).split('.');
    const objDiasByAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayAno[0]));
    const objDiasBysiguenteAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayAno[0]) != 0 ? parseInt(arrayAno[0]) + 1 : 1));
    const totalDiasByAno = objDiasByAno ? objDiasByAno.total : 0;
    const sumDiasSiguenteAno = (parseInt(arrayAno[1]) / 100) * objDiasBysiguenteAno.day;
    const sumaDiasAntiguedad = totalDiasByAno + sumDiasSiguenteAno;
    //se calculan los dias de vacaciones a fin de año
    const arrayFinAno = anoCumplidosFinAno.toFixed(2).split('.');
    const objDiasByAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayFinAno[0]));
    const objDiasBysiguenteAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayFinAno[0]) != 0 ? parseInt(arrayFinAno[0]) + 1 : 1));
    const totalDiasByFinAno = objDiasByAnoFin ? objDiasByAnoFin.total : 0;
    const sumDiasSiguenteAnoFin = (parseInt(arrayFinAno[1]) / 100) * objDiasBysiguenteAnoFin.day;
    const sumaDiasAntiguedadFin = totalDiasByFinAno + sumDiasSiguenteAnoFin;
    let totalDiasVacacionesMedioDia = 0;

    //se obtienen las incidencias de vacaciones
    const incidenciaVacaciones = await this.employeeRepository.findOne({
      where: {
        id: emp.id,
        employeeIncidence: {
          incidenceCatologue: {
            code_band: In(['Vac', 'VACA']),
          },
          status: In(['Autorizada', 'Pendiente']),
        },
      },
      relations: {
        employeeIncidence: {
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
      },
    });

    //se obtinene las incidencias de vacacion medio dia
    const incidenciaVacacionesMedioDia = await this.employeeRepository.count({
      where: {
        id: emp.id,
        employeeIncidence: {
          incidenceCatologue: {
            code_band: In(['VacM']),
          },
          status: In(['Autorizada', 'Pendiente']),
        },
      },
      relations: {
        employeeIncidence: {
          incidenceCatologue: true,
          dateEmployeeIncidence: true,
        },
      },
    });

    if (incidenciaVacacionesMedioDia > 0) {
      totalDiasVacacionesMedioDia = incidenciaVacacionesMedioDia * 0.5;
    }

    //si no existe ajuste
    //se realiza el calculo con las incidencias
    if (!adjustmentVacation) {
      //si existen vacaciones medio dia, se suman
      if (incidenciaVacacionesMedioDia > 0) {
        totalDiasVacacionesMedioDia = incidenciaVacacionesMedioDia * 0.5;
      }

      //se suman los dias de vacaciones por incidencia
      incidenciaVacaciones?.employeeIncidence.forEach((element) => {
        element.dateEmployeeIncidence.forEach((element) => {
          dayUsedAllYears++;
        });
      });
      //se suman las vacaciones de medio dia
      dayUsedAllYears += Number(totalDiasVacacionesMedioDia); //total de vacaciones

    } else {
      //si existe ajuste toma el valor del ajuste
      //y toma las incidencias posteriores al dia de ajuste
      //y sumas las cantidades

      let totalDiasIncidencia = 0;
      //vacaciones normales y adelantadas
      const newIncidenceNormales = await this.employeeRepository.findOne({
        relations: {
          employeeIncidence: {
            dateEmployeeIncidence: true,
            incidenceCatologue: true,
          },
        },
        where: {
          id: emp.id,
          employeeIncidence: {
            dateEmployeeIncidence: {
              date: MoreThanOrEqual(
                format(
                  new Date(
                    adjustmentVacation.logAdjustmentVacationEmployee[
                      adjustmentVacation.logAdjustmentVacationEmployee
                        .length - 1
                    ].created_at,
                  ),
                  'yyyy-MM-dd',
                ) as any,
              ),
            },
            status: In(['Autorizada', 'Pendiente']),
            incidenceCatologue: {
              code_band: In(['Vac', 'VACA']),
            },
          },
        },
      });

      //vacaciones medio dia
      const newIncidenceVacMedioDia = await this.employeeRepository.findOne({
        relations: {
          employeeIncidence: {
            dateEmployeeIncidence: true,
            incidenceCatologue: true,
          },
        },
        where: {
          id: emp.id,
          employeeIncidence: {
            dateEmployeeIncidence: {
              date: MoreThanOrEqual(
                format(
                  new Date(
                    adjustmentVacation.logAdjustmentVacationEmployee[
                      adjustmentVacation.logAdjustmentVacationEmployee
                        .length - 1
                    ].created_at,
                  ),
                  'yyyy-MM-dd',
                ) as any,
              ),
            },
            status: In(['Autorizada', 'Pendiente']),
            incidenceCatologue: {
              code_band: In(['VacM']),
            },
          },
        },
      });

      if (newIncidenceNormales) {
        for (let index = 0; index < newIncidenceNormales.employeeIncidence.length; index++) {
          const element = newIncidenceNormales.employeeIncidence[index];
          totalDiasIncidencia += element.dateEmployeeIncidence.length;
        }
      }

      if (newIncidenceVacMedioDia) {
        for (let index = 0; index < newIncidenceVacMedioDia.employeeIncidence.length; index++) {
          const element = newIncidenceVacMedioDia.employeeIncidence[index];
          totalDiasIncidencia += Number(element.dateEmployeeIncidence.length) * Number(0.5);
        }
      }

      dayUsedAllYears = Number(adjustmentVacation.logAdjustmentVacationEmployee[adjustmentVacation.logAdjustmentVacationEmployee.length - 1].new_value) + parseFloat(totalDiasIncidencia.toFixed(2));
    }

    row['id'] = emp.id;
    row['perfil'] = emp.employeeProfile.name;
    row['num_employee'] = emp.employee_number;
    row['nombre'] = emp.name + ' ' + emp.paternal_surname + ' ' + emp.maternal_surname;
    row['ingreso'] = emp.date_employment;
    row['anos_cumplidos'] = Number(anoCumplidos.toFixed(2)); //años cumplidos
    row['anos_fin_ano'] = Number(anoCumplidosFinAno.toFixed(2)); //años cumplidos hasta fin de año
    row['dias_antiguedad_fin_ano'] = Number(sumaDiasAntiguedadFin.toFixed(2)); //dias proporcionales por antiguedad hasta fin de año
    row['dias_antiguedad'] = Number(sumaDiasAntiguedad.toFixed(2)); //dias proporcionales por antiguedad
    row['dias_utilizados_all_years'] = Number(dayUsedAllYears.toFixed(2)); //dias utilizados(todos los años)
    row['dias_disponibles_dia_hoy'] = Number((sumaDiasAntiguedad - dayUsedAllYears).toFixed(2)); //dias disponibles al dia de hoy
    row['dias_disponibles_fin_ano'] = Number((sumaDiasAntiguedadFin - dayUsedAllYears).toFixed(2)); //dias disponibles hasta fin de año
    row['dias_sugeridos_apartar'] = 0; //dias sugeridos para apartar por la empresa
    report.push(row);

    return report;
  }

  //reporte status de vacaiones
  async statusVacation(data: any, userLogin: any){
    let response = {
      data: [],
      total: 0,
      error: false,
      message: ''
    } 
    const startDate = format(new Date(data.startDate), 'yyyy-MM-dd');
    const endDate = format(new Date(data.endDate), 'yyyy-MM-dd');
    let dataEmployee = [];
      
    try {
      
      const incidencias = await this.employeeRepository.find({
        select: {
          employee_number: true,
          name: true,
          paternal_surname: true,
          maternal_surname: true,
          employeeIncidence: {
            status: true,
            incidenceCatologue: {
              code_band: true,
              name: true,
            },
            dateEmployeeIncidence: {
              date: true,
            },
          }
        },
        where: {
          id: In(data.ids),
          employeeIncidence: {
            dateEmployeeIncidence: {
              date: Between(startDate as any, endDate as any),
            },
            incidenceCatologue: {
              code_band: In(['VAC', 'VACA', 'VacM']),
            },
            status: 'Autorizada'
          },
        },
        relations: {
          employeeIncidence: {
            incidenceCatologue: true,
            dateEmployeeIncidence: true,
          },
        },
      });
      
      
      response.total = incidencias.length;
      response.data = incidencias;

      return response;
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    

  }

    
    
}
