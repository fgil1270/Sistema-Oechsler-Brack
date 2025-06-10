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

import { CreateEmployeeDto, UpdateEmployeeDto, findEmployeeProduccion } from '../dto/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeJobHistory } from '../entities/employee_job_history.entity';
import { EmployeeDepartmentHistory } from '../entities/employee_department_history.entity';
import { EmployeePayrollHistory } from '../entities/employee_payroll_history.entity';
import { EmployeeVacationProfileHistory } from '../entities/employee_vacation_profile_history.entity';
import { EmployeeWorkerHistory } from '../entities/employee_worker_history.entity';
import { JobsService } from '../../jobs/service/jobs.service';
import { DepartmentsService } from '../../departments/service/departments.service';
import { PayrollsService } from '../../payrolls/service/payrolls.service';
import { VacationsProfileService } from '../../vacations-profile/service/vacations-profile.service';
import { EmployeeProfilesService } from '../../employee-profiles/service/employee-profiles.service';
import { join } from 'path';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { CalendarService } from '../../calendar/service/calendar.service';
import { da, tr } from 'date-fns/locale';
import { EmployeeShift } from 'src/employee_shift/entities/employee_shift.entity';
import { CustomLoggerService } from '../../logger/logger.service';

@Injectable()
export class EmployeesService {
  private log = new CustomLoggerService();
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeJobHistory) private employeeJobHistoryRepository: Repository<EmployeeJobHistory>,
    @InjectRepository(EmployeeDepartmentHistory) private employeeDepartmentHistoryRepository: Repository<EmployeeDepartmentHistory>,
    @InjectRepository(EmployeePayrollHistory) private employeePayrollHistoryRepository: Repository<EmployeePayrollHistory>,
    @InjectRepository(EmployeeVacationProfileHistory) private employeeVacationProfileHistoryRepository: Repository<EmployeeVacationProfileHistory>,
    @InjectRepository(EmployeeWorkerHistory) private employeeWorkerHistoryRepository: Repository<EmployeeWorkerHistory>,
    private jobsService: JobsService,
    private departmentsService: DepartmentsService,
    private payrollsService: PayrollsService,
    private vacationsProfileService: VacationsProfileService,
    private employeeProfilesService: EmployeeProfilesService,
    private organigramaService: OrganigramaService,
    @Inject(forwardRef(() => CalendarService)) private calendarService: CalendarService,
  ) { }

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
    for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
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
      const dateChangeVacationProfile =
        workbook.Sheets['Todos'][utils.encode_cell({ r: rowNum, c: 38 })];
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
      if (exNoEmployee.w.trim()) {
        console.log("primera")
        console.log("numero de empleado", exNoEmployee.w.trim())
        console.log("row", rowNum)
        console.log("total", total)

      }

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
        try {
          if (!tableDepartment) {
            const tableDepartmentTotal = await this.departmentsService.findAll();
            newDepartment = await this.departmentsService.create({
              cv_code: (tableDepartmentTotal.total + 1).toString(),
              cv_description: departamento.w,
              cc: departamento.w.split(' ')[0],
            });
          }
        } catch (error) {
          this.log.error("variable: " + departamento + ", error:", error.stack)
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

            //si el puesto es distinto se crea el historial
            if (tableEmployee.job.id !== tableJob.id) {
              const empJob = this.employeeJobHistoryRepository.create({
                employee: tableEmployee,
                job: tableEmployee.job,
              });
              await this.employeeJobHistoryRepository.save(empJob);
            }

            //si el departamento es distinto se crea el historial
            if (tableEmployee.department.id !== tableDepartment.dept.id) {
              const empDepartment = this.employeeDepartmentHistoryRepository.create({
                employee: tableEmployee,
                department: tableEmployee.department,
              });
              await this.employeeDepartmentHistoryRepository.save(empDepartment);
            }

            //si la nomina es distinta se crea el historial
            if (tableEmployee.payRoll.id !== tablePayRoll.payroll.id) {
              const empPayroll = this.employeePayrollHistoryRepository.create({
                employee: tableEmployee,
                payroll: tableEmployee.payRoll,
              });
              await this.employeePayrollHistoryRepository.save(empPayroll);
            }

            //si el perfil de vacaciones es distinto se crea el historial
            if (
              tableEmployee.vacationProfile.id !== tableVacationProfile.vacationsProfile.id
            ) {

              const empVacationProfile =
                this.employeeVacationProfileHistoryRepository.create({
                  employee: tableEmployee,
                  vacationProfile: tableEmployee.vacationProfile,
                  created_at: dateChangeVacationProfile ? new Date(dateChangeVacationProfile.w.trim()) : new Date(),
                });
              await this.employeeVacationProfileHistoryRepository.save(
                empVacationProfile
              );
            }

            //si el tipo de empleado(CONFIANZA, SINDICALIZADO) es distinto se crea el historial
            if (tableEmployee.worker !== tipeEmployee.w.toUpperCase()) {
              const empWorker = this.employeeWorkerHistoryRepository.create({
                employee: tableEmployee,
                worker: tableEmployee.worker,
              });
              await this.employeeWorkerHistoryRepository.save(empWorker);
            }

            //se actualiza el empleado
            this.employeeRepository.update(tableEmployee.id, row);

            totalEdit++;
          } catch (error) {

            totalError++;
            this.log.error('Error al actualizar', error.stack);
            this.log.error('Error al actualizar', JSON.stringify(row));
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

            //SE CREA EL EMPLEADO
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
      relations: {
        department: true,
        job: {
          competence: true
        },
        payRoll: true,
        vacationProfile: true,
        employeeProfile: true
      },
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

  //Buscar empleado por algun argumento
  async findBy(query: Partial<CreateEmployeeDto>) {
    const emps = await this.employeeRepository.findOne({
      where: query,
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
    })

    if (!emps) {
      throw new NotFoundException(`Employee #${query} not found`);
    }
    return emps;
  }

  //Buscar empleados de produccion
  async findEmployeeProduction(query: Partial<findEmployeeProduccion>) {
    const queryEmps = await this.employeeRepository.createQueryBuilder('employee')
      .innerJoinAndSelect('employee.department', 'department')
      .innerJoinAndSelect('employee.job', 'job')
      .innerJoinAndSelect('employee.payRoll', 'payRoll')
      .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
      .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
      .where('employee.employee_number = :employee_number', { employee_number: query.employee_number })
      .andWhere('job.produccion_visible = :produccion_visible', { produccion_visible: query.produccion_visible })
    if (query.birthdate) {
      queryEmps.andWhere('employee.birthdate = :birthdate', { birthdate: new Date(query.birthdate) });
    }

    queryEmps.orderBy('employee.employee_number', 'ASC');
    const [sql, parameters] = queryEmps.getQueryAndParameters();

    const emps = await queryEmps.getOne();

    return emps;
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
        needUser: true
      },
      user,
    );

    const report = [];
    for (let index = 0; index < employee.length; index++) {
      const emp = employee[index];
      const row = {};
      const ingreso = moment(new Date(emp?.date_employment)); // dia de ingreso
      const diaConsulta = moment(new Date(data.startDate)); //dia de consulta del reporte
      let diaCambio: any; //dia de cambio de perfil de vacaciones
      let anoCumplidoDiaCambio: any; //años cumplidos al dia del cambio de perfil de vacaciones
      let anoCumplidos: any; // años cumplidos al dia del reporte
      const finAno = moment(new Date(new Date(data.startDate).getFullYear(), 11, 31)); //fin de año
      let anoCumplidosFinAno: any; //años cumplidos a fin de año
      let arrayAno: any; //separar año y dias
      let arrayAnoHistorial: any; //separar año y dias historial
      let objDiasByAno: any;
      let objDiasByAnoHistorial: any;
      let objDiasBySiguenteAnoHistorial: any;
      let objDiasBySiguenteAno: any;
      let totalDiasByAnoHistorial: any;
      let totalDiasByAno: any;
      let sumDiasSiguenteAnoHistorial: any;
      let sumDiasSiguenteAno: any;
      let sumaDiasAntiguedadHistorial: any;
      let sumaDiasAntiguedad: any;
      let dayUsedAllYears = 0; //dias usados en todos los años

      let arrayFinAno: any;
      let objDiasByAnoFin: any;
      let objDiasBysiguenteAnoFin: any;
      let totalDiasByFinAno: any;
      let sumDiasSiguenteAnoFin: any;
      let sumaDiasAntiguedadFin = totalDiasByFinAno + sumDiasSiguenteAnoFin;
      let totalDiasVacacionesMedioDia = 0;
      let totalVacacionesPendientes = 0;

      //se obtiene el perfil del empleado
      const vacationsAno = await this.vacationsProfileService.findOne(emp.vacationProfile.id);

      //se obtiene el ultimo cambio de perfil de vacaciones
      const lastVacationProfile = await this.employeeVacationProfileHistoryRepository.findOne({
        relations: {
          vacationProfile: {
            vacationProfileDetail: true
          }
        },
        where: {
          employee: {
            id: emp.id
          },
        },
        order: {
          created_at: 'DESC',
        },
      });


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
        }


      });


      //si existe un un historial de vacaciones
      //se toman los dias de vacaciones del historial
      if (lastVacationProfile) {
        //se obtiene el dia de cambio de perfil de vacaciones
        diaCambio = moment(new Date(lastVacationProfile.created_at));
        //se obtiene los años cumplidos al dia de cambio de perfil de vacaciones
        anoCumplidoDiaCambio = diaCambio.diff(ingreso, 'years', true);
        //se genera array para separar años y dias del historial
        arrayAnoHistorial = anoCumplidoDiaCambio.toFixed(2).split('.');
        //se obtienes los dias que corresponden al año de cambio de perfil de vacaciones
        objDiasByAnoHistorial = lastVacationProfile.vacationProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayAnoHistorial[0]));
        //si el año del cambio de perfil de vacaciones es igual al año de la consulta
        objDiasBySiguenteAnoHistorial = lastVacationProfile.vacationProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayAnoHistorial[0]) != 0 ? parseInt(arrayAnoHistorial[0]) + 1 : 1));
        //se obtiene el total de dias que corresponden al año de cambio de perfil de vacaciones
        totalDiasByAnoHistorial = objDiasByAnoHistorial ? objDiasByAnoHistorial.total : 0;
        //se obtiene los dias que corresponden al siguiente año de cambio de perfil de vacaciones
        sumDiasSiguenteAnoHistorial = (parseInt(arrayAnoHistorial[1]) / 100) * objDiasBySiguenteAnoHistorial.day;
        //suma de los dias de antiguedad del historial
        sumaDiasAntiguedadHistorial = totalDiasByAnoHistorial + sumDiasSiguenteAnoHistorial;


        //se obtiene los años cumplidosde la fecha de cambio de perfil al dia de consulta
        anoCumplidos = diaConsulta.diff(diaCambio, 'years', true);
        //se calculan los dias de vacaciones al dia de la consulta
        //se genera array para separar años y dias
        arrayAno = anoCumplidos.toFixed(2).split('.');



        //se obtiene el total de dias que corresponden al año despues del cambio de perfil
        objDiasByAno = vacationsAno.vacationsProfile.vacationProfileDetail.find(
          (year) =>
            year.year === ((parseInt(arrayAnoHistorial[0]) + parseInt(arrayAno[0])) != 0 ? (parseInt(arrayAnoHistorial[0]) + parseInt(arrayAno[0])) + 1 : 1)
        );
        //se obtiene los dias que corresponden al siguiente año
        objDiasBySiguenteAno = vacationsAno.vacationsProfile.vacationProfileDetail.find(
          (year) =>
            year.year === (parseInt(arrayAnoHistorial[0]) != 0 ? parseInt(arrayAnoHistorial[0]) + 1 : 1)
        );
        //se obtiene el total de dias que corresponden al año
        totalDiasByAno = objDiasByAno ? objDiasByAno.total : 0;
        //se obtiene los dias que corresponden al siguiente año
        sumDiasSiguenteAno = (parseInt(arrayAno[1]) / 100) * objDiasBySiguenteAno.day;
        //suma de los dias de antiguedad
        sumaDiasAntiguedad = (arrayAno[0] == 0 ? 0 : totalDiasByAno) + sumDiasSiguenteAno + sumaDiasAntiguedadHistorial;
        //se obtiene los años cumplidos a fin de año
        anoCumplidosFinAno = finAno.diff(diaCambio, 'years', true);
        //se calculan los dias de vacaciones a fin de año
        arrayFinAno = anoCumplidosFinAno.toFixed(2).split('.');
        objDiasByAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayAnoHistorial[0]) != 0 ? parseInt(arrayAnoHistorial[0]) + 1 : 1));
        objDiasBysiguenteAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayFinAno[0]) != 0 ? parseInt(arrayFinAno[0]) + 1 : 1));
        totalDiasByFinAno = objDiasByAnoFin ? objDiasByAnoFin.total : 0;
        sumDiasSiguenteAnoFin = (parseInt(arrayFinAno[1]) / 100) * objDiasBysiguenteAnoFin.day;
        sumaDiasAntiguedadFin = totalDiasByFinAno + sumDiasSiguenteAnoFin;

      } else {
        //se obtiene los años cumplidos al dia de consulta
        anoCumplidos = diaConsulta.diff(ingreso, 'years', true);
        //se calculan los dias de vacaciones al dia de la consulta
        //se genera array para separar años y dias
        arrayAno = anoCumplidos.toFixed(2).split('.');
        //si no existe un historial de vacaciones
        //se toman los dias de vacaciones del perfil actual
        objDiasByAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayAno[0]));
        objDiasBySiguenteAno = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayAno[0]) != 0 ? parseInt(arrayAno[0]) + 1 : 1));
        totalDiasByAno = objDiasByAno ? objDiasByAno.total : 0;
        sumDiasSiguenteAno = (parseInt(arrayAno[1]) / 100) * objDiasBySiguenteAno.day;
        sumaDiasAntiguedad = totalDiasByAno + sumDiasSiguenteAno;

        //se obtiene los años cumplidos a fin de año
        anoCumplidosFinAno = finAno.diff(ingreso, 'years', true);
        //se calculan los dias de vacaciones a fin de año
        arrayFinAno = anoCumplidosFinAno.toFixed(2).split('.');
        objDiasByAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === parseInt(arrayFinAno[0]));
        objDiasBysiguenteAnoFin = vacationsAno.vacationsProfile.vacationProfileDetail.find((year) => year.year === (parseInt(arrayFinAno[0]) != 0 ? parseInt(arrayFinAno[0]) + 1 : 1));
        totalDiasByFinAno = objDiasByAnoFin ? objDiasByAnoFin.total : 0;
        sumDiasSiguenteAnoFin = (parseInt(arrayFinAno[1]) / 100) * objDiasBysiguenteAnoFin.day;
        sumaDiasAntiguedadFin = totalDiasByFinAno + sumDiasSiguenteAnoFin;

      }



      //si no existe ajuste
      //se realiza el calculo con las incidencias
      if (!adjustmentVacation) {
        const incidences = await this.employeeRepository.createQueryBuilder('employee')
          .select('employee.id', 'employee_id')
          .addSelect('employeeIncidence.id', 'incidence_id')
          .addSelect('employeeIncidence.status', 'status')
          .addSelect('incidenceCatologue.code_band', 'code_band')
          .addSelect('dateEmployeeIncidence.date', 'incidence_date')
          .addSelect('employeeShift.start_date', 'shift_date')
          .addSelect('shift.name', 'shift_name')
          .innerJoin('employee.employeeIncidence', 'employeeIncidence')
          .innerJoin('employeeIncidence.incidenceCatologue', 'incidenceCatologue')
          .innerJoin('employeeIncidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
          .innerJoin('employee.employeeShift', 'employeeShift')
          .innerJoin('employeeShift.shift', 'shift')
          .where('employee.id = :id', { id: emp.id })
          .andWhere('employeeIncidence.status IN (:status)', { status: ['Autorizada', 'Pendiente'] })
          .andWhere('incidenceCatologue.code_band IN (:code)', { code: ['VAC', 'VACA', 'VacM'] })
          .andWhere('employeeShift.start_date = dateEmployeeIncidence.date')
          .getRawMany();


        //se obtinene el total de vacaciones autorizadas, pendientes
        incidences?.forEach((element) => {
          if (element.status === 'Pendiente') {
            if (element.code_band === 'VAC' || element.code_band === 'VACA') {
              totalVacacionesPendientes += 1;
            } else if (element.code_band === 'VacM') {
              totalVacacionesPendientes += 0.5;
            }
          } else {
            if (element.code_band === 'VAC' || element.code_band === 'VACA') {
              dayUsedAllYears += 1;
            } else if (element.code_band === 'VacM') {
              dayUsedAllYears += 0.5;
            }
          }

        });
        //se suman las vacaciones de medio dia
        dayUsedAllYears += Number(totalVacacionesPendientes); //total de vacaciones

      } else {
        //si existe ajuste toma el valor del ajuste
        //y toma las incidencias posteriores al dia de ajuste
        //y sumas las cantidades

        let totalDiasIncidencia = 0;

        const incidences = await this.employeeRepository.createQueryBuilder('employee')
          .select('employee.id', 'employee_id')
          .addSelect('employeeIncidence.id', 'incidence_id')
          .addSelect('employeeIncidence.status', 'status')
          .addSelect('incidenceCatologue.code_band', 'code_band')
          .addSelect('dateEmployeeIncidence.date', 'incidence_date')
          .addSelect('employeeShift.start_date', 'shift_date')
          .addSelect('shift.name', 'shift_name')
          .innerJoin('employee.employeeIncidence', 'employeeIncidence')
          .innerJoin('employeeIncidence.incidenceCatologue', 'incidenceCatologue')
          .innerJoin('employeeIncidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
          .innerJoin('employee.employeeShift', 'employeeShift')
          .innerJoin('employeeShift.shift', 'shift')
          .where('employee.id = :id', { id: emp.id })
          .andWhere('employeeIncidence.status IN (:status)', { status: ['Autorizada', 'Pendiente'] })
          .andWhere('dateEmployeeIncidence.date >= :date', { date: format(new Date(adjustmentVacation.logAdjustmentVacationEmployee[0].created_at), 'yyyy-MM-dd') })
          .andWhere('incidenceCatologue.code_band IN (:code)', { code: ['VAC', 'VACA', 'VacM'] })
          .andWhere('employeeShift.start_date = dateEmployeeIncidence.date')
          .getRawMany();


        incidences?.forEach((element) => {
          if (element.status === 'Pendiente') {
            if (element.code_band === 'VAC' || element.code_band === 'VACA') {
              if (element.shift_name === '12x12-1' || element.shift_name === '12x12-2') {
                totalVacacionesPendientes += 1.5;
                totalDiasIncidencia += 1.5;
              } else {
                totalVacacionesPendientes += 1;
                totalDiasIncidencia += 1;
              }

            } else if (element.code_band === 'VacM') {
              totalVacacionesPendientes += 0.5;
              totalDiasIncidencia += Number(0.5);
            }
          } else {
            if (element.code_band === 'VAC' || element.code_band === 'VACA') {
              if (element.shift_name === '12x12-1' || element.shift_name === '12x12-2') {
                totalDiasIncidencia += 1.5;
              } else {
                totalDiasIncidencia += 1;
              }

            } else if (element.code_band === 'VacM') {
              totalDiasIncidencia += Number(0.5);
            }
          }
        });


        dayUsedAllYears = Number(adjustmentVacation.logAdjustmentVacationEmployee[adjustmentVacation.logAdjustmentVacationEmployee.length - 1].new_value) + parseFloat(totalDiasIncidencia.toFixed(2));
      }

      let totalAnoCumplido = Number(anoCumplidos.toFixed(2)) + Number(anoCumplidoDiaCambio ? anoCumplidoDiaCambio.toFixed(2) : 0);
      let totalAnoCumplidoFinAno = Number(anoCumplidoDiaCambio ? anoCumplidoDiaCambio.toFixed(2) : 0) + Number(anoCumplidosFinAno.toFixed(2))
      row['id'] = emp.id;
      row['perfil'] = emp.employeeProfile.name;
      row['num_employee'] = emp.employee_number;
      row['nombre'] = emp.name + ' ' + emp.paternal_surname + ' ' + emp.maternal_surname;
      row['ingreso'] = emp.date_employment;
      row['anos_cumplidos'] = totalAnoCumplido.toFixed(2); //años cumplidos
      row['anos_fin_ano'] = totalAnoCumplidoFinAno.toFixed(2); //años cumplidos hasta fin de año
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
  async vacationByEmployee(id: number, data: any) {

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
    const finAno = moment(new Date(new Date(data.start).getFullYear(), 11, 31)); //fin de año
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
    let dataTest: any;
    let totalVacacionesPendientes = 0;



    //si no existe ajuste
    //se realiza el calculo con las incidencias
    if (!adjustmentVacation) {
      const incidences = await this.employeeRepository.createQueryBuilder('employee')
        .select('employee.id', 'employee_id')
        .addSelect('employeeIncidence.id', 'incidence_id')
        .addSelect('employeeIncidence.status', 'status')
        .addSelect('incidenceCatologue.code_band', 'code_band')
        .addSelect('dateEmployeeIncidence.date', 'incidence_date')
        .addSelect('employeeShift.start_date', 'shift_date')
        .addSelect('shift.name', 'shift_name')
        .innerJoin('employee.employeeIncidence', 'employeeIncidence')
        .innerJoin('employeeIncidence.incidenceCatologue', 'incidenceCatologue')
        .innerJoin('employeeIncidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
        .innerJoin('employee.employeeShift', 'employeeShift')
        .innerJoin('employeeShift.shift', 'shift')
        .where('employee.id = :id', { id: emp.id })
        .andWhere('employeeIncidence.status IN (:status)', { status: ['Autorizada', 'Pendiente'] })
        .andWhere('incidenceCatologue.code_band IN (:code)', { code: ['VAC', 'VACA', 'VacM'] })
        .andWhere('employeeShift.start_date = dateEmployeeIncidence.date')
        .getRawMany();

      dataTest = incidences;

      //se obtinene el total de vacaciones autorizadas, pendientes
      incidences?.forEach((element) => {
        if (element.status === 'Pendiente') {
          if (element.code_band === 'VAC' || element.code_band === 'VACA') {
            totalVacacionesPendientes += 1;
          } else if (element.code_band === 'VacM') {
            totalVacacionesPendientes += 0.5;
          }
        } else {
          if (element.code_band === 'VAC' || element.code_band === 'VACA') {
            dayUsedAllYears += 1;
          } else if (element.code_band === 'VacM') {
            dayUsedAllYears += 0.5;
          }
        }

      });
      //se suman las vacaciones de medio dia
      dayUsedAllYears += Number(totalVacacionesPendientes); //total de vacaciones

    } else {
      //si existe ajuste toma el valor del ajuste
      //y toma las incidencias posteriores al dia de ajuste
      //y sumas las cantidades

      let totalDiasIncidencia = 0;

      const incidences = await this.employeeRepository.createQueryBuilder('employee')
        .select('employee.id', 'employee_id')
        .addSelect('employeeIncidence.id', 'incidence_id')
        .addSelect('employeeIncidence.status', 'status')
        .addSelect('incidenceCatologue.code_band', 'code_band')
        .addSelect('dateEmployeeIncidence.date', 'incidence_date')
        .addSelect('employeeShift.start_date', 'shift_date')
        .addSelect('shift.name', 'shift_name')
        .innerJoin('employee.employeeIncidence', 'employeeIncidence')
        .innerJoin('employeeIncidence.incidenceCatologue', 'incidenceCatologue')
        .innerJoin('employeeIncidence.dateEmployeeIncidence', 'dateEmployeeIncidence')
        .innerJoin('employee.employeeShift', 'employeeShift')
        .innerJoin('employeeShift.shift', 'shift')
        .where('employee.id = :id', { id: emp.id })
        .andWhere('employeeIncidence.status IN (:status)', { status: ['Autorizada', 'Pendiente'] })
        .andWhere('dateEmployeeIncidence.date >= :date', { date: format(new Date(adjustmentVacation.logAdjustmentVacationEmployee[0].created_at), 'yyyy-MM-dd') })
        .andWhere('incidenceCatologue.code_band IN (:code)', { code: ['VAC', 'VACA', 'VacM'] })
        .andWhere('employeeShift.start_date = dateEmployeeIncidence.date')
        .getRawMany();

      dataTest = incidences;

      incidences?.forEach((element) => {
        if (element.status === 'Pendiente') {
          if (element.code_band === 'VAC' || element.code_band === 'VACA') {
            if (element.shift_name === '12x12-1' || element.shift_name === '12x12-2') {
              totalVacacionesPendientes += 1.5;
              totalDiasIncidencia += 1.5;
            } else {
              totalVacacionesPendientes += 1;
              totalDiasIncidencia += 1;
            }

          } else if (element.code_band === 'VacM') {
            totalVacacionesPendientes += 0.5;
            totalDiasIncidencia += Number(0.5);
          }
        } else {
          if (element.code_band === 'VAC' || element.code_band === 'VACA') {
            if (element.shift_name === '12x12-1' || element.shift_name === '12x12-2') {
              totalDiasIncidencia += 1.5;
            } else {
              totalDiasIncidencia += 1;
            }

          } else if (element.code_band === 'VacM') {
            totalDiasIncidencia += Number(0.5);
          }
        }
      });


      dayUsedAllYears = Number(adjustmentVacation.logAdjustmentVacationEmployee[adjustmentVacation.logAdjustmentVacationEmployee.length - 1].new_value) + parseFloat(totalDiasIncidencia.toFixed(2));
    }


    ////// dias sugeridos por la empresa

    const arrayDiasSugeridos = await this.calendarService.findRangeDate({
      start: new Date(data.start),
      end: finAno
    });

    const totalDiasSugeridos = arrayDiasSugeridos.filter((element) => element.suggest == true).length;

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
    row['dias_sugeridos_apartar'] = totalDiasSugeridos; //dias sugeridos para apartar por la empresa
    row['dias_vacaciones_pendientes'] = totalVacacionesPendientes; //dias pendientes por autorizar
    report.push(row);

    return report;
  }

  //reporte status de vacaiones
  async statusVacation(data: any, userLogin: any) {
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
