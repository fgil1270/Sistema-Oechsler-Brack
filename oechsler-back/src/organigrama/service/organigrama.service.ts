import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

import {
  CreateOrganigramaDto,
  UpdateOrganigramaDto,
  OrganigramaGerarquia,
  SearchOrganigramaDto
} from '../dto/create-organigrama.dto';
import { Organigrama } from '../entities/organigrama.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { UsersService } from '../../users/service/users.service';
import { da } from 'date-fns/locale';

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Organigrama)
    private organigramaRepository: Repository<Organigrama>,
    @Inject(forwardRef(() => EmployeesService))
    private employeeService: EmployeesService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @InjectDataSource() private dataSource: DataSource,
  ) { }

  async create(createOrganigramaDto: CreateOrganigramaDto) {
    const orgDTO = {
      leader: null,
      employee: null,
      evaluar: false,
    };

    const orgExist = await this.organigramaRepository.findOne({
      relations: {
        leader: true,
        employee: true,
      },
      where: {
        leader: {
          id: createOrganigramaDto.leader,
        },
        employee: {
          id: createOrganigramaDto.employee,
        },
      },
    });

    if (orgExist?.id) {
      throw new BadRequestException(`La Relacion ya existe`);
    }
    try {
      const leader = await this.employeeService.findOne(
        createOrganigramaDto.leader,
      );
      const employee = await this.employeeService.findOne(
        createOrganigramaDto.employee,
      );

      orgDTO.leader = leader.emp;
      orgDTO.employee = employee.emp;
      orgDTO.evaluar = createOrganigramaDto.evaluar;
    } catch (error) {
      throw new BadRequestException(`Error al crear la Relación`);
    }

    const org = this.organigramaRepository.create(orgDTO);
    return await this.organigramaRepository.save(org);
  }

  async findAll(user: any) {
    const isAdmin = user.roles.some(
      (role) => role.name === 'Admin' || role.name === 'RH',
    );
    const isJefeTurno = user.roles.some(
      (role) => role.name === 'Jefe de Turno',
    );
    const total = await this.organigramaRepository.count();
    /* const orgs = await this.organigramaRepository.find({
      relations: {
        leader: {
          department: true,
          job: true,
        },
        employee: {
          department: true,
          job: true,
        },
      },
      where: {
        employee: {
          deleted_at: IsNull(),
        },
      },
    }); */

    const listOrg = await this.dataSource.manager.createQueryBuilder('organigrama', 'org')
      .leftJoinAndSelect('org.employee', 'employee')
      .leftJoinAndSelect('org.leader', 'leader')
      .innerJoinAndSelect('employee.department', 'department')
      .innerJoinAndSelect('employee.job', 'job')
      .innerJoinAndSelect('employee.payRoll', 'payRoll')
      .innerJoinAndSelect('leader.department', 'departmentLeader')
      .innerJoinAndSelect('leader.job', 'jobLeader')
      .where('employee.deleted_at IS NULL')
      .getMany();

    const query = `
            SELECT * FROM employee AS e
            INNER JOIN job AS j ON e.jobId = j.id
            INNER JOIN department AS d On e.departmentId = d.id
            WHERE j.shift_leader = 1
            `;
    const visibleJefeTurno = await this.organigramaRepository.query(query);

    if (!listOrg) {
      throw new NotFoundException(`Organigrama not found`);
    }
    return {
      total: listOrg.length,
      orgs: listOrg,
    };
  }

  //SE OBTIENEN lideres del empleado
  async leaders(id: number) {
    const leaders = await this.organigramaRepository.find({
      relations: {
        leader: true,
        employee: {
          userId: true,
        },
      },
      where: {
        employee: {
          id: id,
          deleted_at: IsNull(),
        },
      },
    });

    return {
      orgs: leaders,
    };
  }

  //SE OBTIENEN posibles lideres
  async findLeader(id: number) {
    const leaders = await this.organigramaRepository.find({
      relations: {
        leader: true,
        employee: {
          userId: true,
        },
      },
      where: {
        employee: {
          id: id,
        },
      },
    });

    const idsLeaders = [];
    idsLeaders.push(id);
    leaders.forEach((leader) => {
      idsLeaders.push(leader.leader.id);
    });

    const newLeaders = await this.employeeService.findLeaders(idsLeaders);

    return {
      orgs: newLeaders,
    };
  }

  async findEmployeeByLeader(idLeader: number, idUser: number) {
    //SE OBTIENEN LOS EMPLEADOS DEL LIDER
    const leader = await this.employeeService.findOne(idLeader);
    const admin = await this.userService.findOne(idUser);
    let isAdmin = false;
    admin.user.roles.find((role) => role.name == 'Admin' || role.name == 'RH')
      ? (isAdmin = true)
      : (isAdmin = false);
    let isJefeTurno = false;
    isJefeTurno = admin.user.roles.some((role) => role.name === 'Jefe de Turno');
    /* user.roles.find((role) => {
      role.name === 'Admin' ? isAdmin = true : isAdmin = false;
      role.name === 'RH' ? isRh = true : isRh = false;
    });  */
    const employeesAdmin = await this.employeeService.findAll();

    const employeesLeader = await this.organigramaRepository.find({
      relations: {
        leader: true,
        employee: true,
      },
      where: [
        {
          leader: {
            id: idLeader,
          },
        },
        {
          employee: {
            job: {
              shift_leader: true,
            },
          },

        }
      ],

    });

    const idsEmployees = [];
    idsEmployees.push(idLeader);

    //si es admin o RH se obtienen todos los empleados
    if (isAdmin) {
      employeesAdmin.emps.forEach((emp) => {
        idsEmployees.push(emp.id);
      });
    } else {
      employeesLeader.forEach((emp) => {
        idsEmployees.push(emp.employee.id);
      });
    }

    return {
      orgs: isAdmin ? employeesAdmin : employeesLeader,
      idsEmployees: idsEmployees,
    };
  }

  async findOne(id: number) {
    const org = await this.organigramaRepository.findOne({
      relations: {
        leader: {
          department: true,
          job: true,
        },
        employee: {
          department: true,
          job: true,
        },
      },
      where: {
        id: id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organigrama #${id} not found`);
    }
    return { org };
  }

  async findJerarquia(data: OrganigramaGerarquia, user: any) {
    try {
      //se verifica si el usuario logueado tiene role de Admin o RH
      //si es asi se obtienen todos los empleados
      const isAdmin = user.roles.some(
        (role) => role.name === 'Admin' || role.name === 'RH',
      );

      const isJefeTurno = user.roles.some(
        (role) => role.name === 'Jefe de Turno',
      );

      const employees = [];
      //si es Admin se obtienen todos los empleados
      if (isAdmin) {
        const levelOne = await this.employeeService.findAll();
        levelOne.emps.forEach((element) => {
          employees.push(element);
        });
        return employees;
      }

      const bc = await this.organigramaRepository.find({
        relations: {
          leader: true,
          employee: true,
        },
        where: {
          leader: In([user.idEmployee]),
        },
      });

      const levelOne = await this.organigramaRepository.find({
        relations: {
          employee: {
            department: true,
            job: true,
            payRoll: true,
            vacationProfile: true,
            employeeProfile: true,
          },
          leader: true,
        },
        where: {
          employee: {
            deleted_at: IsNull(),
          },
          leader: In([user.idEmployee]),

        },
        order: {
          employee: {
            name: 'ASC',
            employee_number: 'ASC',
          },
        },
      });

      let visibleJefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
        .innerJoinAndSelect('employee.job', 'job')
        .innerJoinAndSelect('employee.payRoll', 'payRoll')
        .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
        .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
        .where('job.shift_leader = 1')
        .orderBy('employee.employee_number', 'ASC')
        .getMany();

      levelOne.forEach((element) => {

        if (element.employee) {
          employees.push(element.employee);
        }

      });


      //si es jefe de turno agrega los empleados que su puesto es visible por jefe de turno
      if (isJefeTurno) {
        let test: any[] = [];
        let test2: any[] = [];

        visibleJefeTurno.forEach((element) => {
          test.push(element);
        });
        test2 = test.filter((element) => !employees.some((emp) => emp.id === element.id));
        employees.push(...test2);

      }



      if (data.type == 'Normal') {
        const userLogin = await this.employeeService.findOne(user.idEmployee);

        //levelOne.employee.push(...userLogin);
        //si necesita los datos del usuario logueado

        if (data.needUser) {
          employees.push(userLogin.emp);
        }

        return employees;
      }

      const idsEmployees = [];

      for (let index = 0; index < employees.length; index++) {
        idsEmployees.push(employees[index].id);
      }

      const levelTwo = await this.organigramaRepository
        .createQueryBuilder('organigrama')
        .leftJoinAndSelect('organigrama.employee', 'employee')
        .leftJoinAndSelect('employee.department', 'department')
        .leftJoinAndSelect('employee.job', 'job')
        .leftJoinAndSelect('employee.payRoll', 'payRoll')
        .leftJoinAndSelect('employee.vacationProfile', 'vacationProfile')
        .leftJoinAndSelect('employee.employeeProfile', 'employeeProfile')
        .leftJoinAndSelect('organigrama.leader', 'leader')
        .where('employee.deleted_at IS NULL')
        .andWhere('organigrama.leader IN (:...idsEmployees)', { idsEmployees })
        .getMany();
      /* await this.organigramaRepository.find({
        relations: {
          employee: {
            department: true,
            job: true,
            payRoll: true,
            vacationProfile: true,
            employeeProfile: true,
          },
          leader: true,
        },
        where: {
          leader: In(idsEmployees),
          employee: {
            deleted_at: IsNull(),
          },
        },
      }); */

      levelTwo.forEach((element) => {
        if (element.employee) {
          employees.push(element.employee);
        }
      });

      //levelTwo.push(...levelOne);

      return employees;
    } catch (error) {
      return error;
    }
  }

  //buscar organigrama por 
  async findBy(data: Partial<SearchOrganigramaDto>, user: any) {
    //se verifica si el usuario logueado tiene role de Admin o RH
    //si es asi se obtienen todos los empleados
    const isAdmin = user.roles.some(
      (role) => role.name === 'Admin' || role.name === 'RH',
    );

    const isJefeTurno = user.roles.some(
      (role) => role.name === 'Jefe de Turno'
    );

    const isDirector = user.roles.some(
      (role) => role.name === 'Direccion',
    );

    const employees = [];

    try {
      //si es Admin se obtienen todos los empleados
      if (isAdmin) {
        const levelOne = await this.employeeService.findAll();
        levelOne.emps.forEach((element) => {
          employees.push(element);
        });
        return employees;
      }

      //buscara los empleados que en la tabla departament tiene el campo director
      if (isDirector && data.byDepartmentDirector) {

        const levelOne = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
          .innerJoinAndSelect('employee.department', 'department')
          .leftJoinAndSelect('department.director', 'director')
          .leftJoinAndSelect('department.manager', 'manager')
          .innerJoinAndSelect('employee.job', 'job')
          .innerJoinAndSelect('employee.payRoll', 'payRoll')
          .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
          .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
          .where('director.id = :directorId', { directorId: user.idEmployee })
          .andWhere('employee.deleted_at IS NULL')
          .orderBy('employee.name', 'ASC')
          .addOrderBy('employee.employee_number', 'ASC')
          .getMany();

        levelOne.forEach((element) => {
          employees.push(element);
        });
        return employees;

      }

      const levelOne = await this.organigramaRepository.find({
        relations: {
          employee: {
            department: true,
            job: true,
            payRoll: true,
            vacationProfile: true,
            employeeProfile: true,
          },
          leader: true,
        },
        where: {
          employee: {
            deleted_at: IsNull(),
          },
          leader: In([user.idEmployee]),

        },
        order: {
          employee: {
            name: 'ASC',
            employee_number: 'ASC',
          },
        },
      });

      let visibleJefeTurno = await this.dataSource.manager.createQueryBuilder('employee', 'employee')
        .innerJoinAndSelect('employee.job', 'job')
        .innerJoinAndSelect('employee.payRoll', 'payRoll')
        .innerJoinAndSelect('employee.vacationProfile', 'vacationProfile')
        .innerJoinAndSelect('employee.employeeProfile', 'employeeProfile')
        .where('job.shift_leader = 1')
        .orderBy('employee.employee_number', 'ASC')
        .getMany();

      levelOne.forEach((element) => {
        if (element.employee) {
          employees.push(element.employee);
        }

      });


      //si es jefe de turno agrega los empleados que su puesto es visible por jefe de turno
      if (isJefeTurno) {
        let test: any[] = [];
        let test2: any[] = [];

        visibleJefeTurno.forEach((element) => {
          test.push(element);
        });
        test2 = test.filter((element) => !employees.some((emp) => emp.id === element.id));
        employees.push(...test2);

      }


      //nivel 1 de jerarquia
      if (data.type == 'Normal') {
        const userLogin = await this.employeeService.findOne(user.idEmployee);

        //levelOne.employee.push(...userLogin);
        //si necesita los datos del usuario logueado

        if (data.needUser) {
          employees.push(userLogin.emp);
        }

        return employees;
      }

      const idsEmployees = [];

      for (let index = 0; index < employees.length; index++) {
        idsEmployees.push(employees[index].id);
      }

      //nivel 2 de jerarquia
      const levelTwo = await this.organigramaRepository
        .createQueryBuilder('organigrama')
        .leftJoinAndSelect('organigrama.employee', 'employee')
        .leftJoinAndSelect('employee.department', 'department')
        .leftJoinAndSelect('employee.job', 'job')
        .leftJoinAndSelect('employee.payRoll', 'payRoll')
        .leftJoinAndSelect('employee.vacationProfile', 'vacationProfile')
        .leftJoinAndSelect('employee.employeeProfile', 'employeeProfile')
        .leftJoinAndSelect('organigrama.leader', 'leader')
        .where('employee.deleted_at IS NULL')
        .andWhere('organigrama.leader IN (:...idsEmployees)', { idsEmployees })
        .getMany();


      levelTwo.forEach((element) => {
        employees.push(element.employee);
      });

      return employees;
    } catch (error) {
      return error;
    }


  }

  async update(id: number, updateOrganigramaDto: UpdateOrganigramaDto) {
    const org = await this.organigramaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organigrama #${id} not found`);
    }


    const leader = await this.employeeService.findOne(
      updateOrganigramaDto.leader,
    );
    org.leader = leader.emp;
    org.evaluar = updateOrganigramaDto.evaluar;
    return await this.organigramaRepository.save(org);
  }

  async remove(id: number) {
    const org = await this.organigramaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organigrama #${id} not found`);
    }

    return await this.organigramaRepository.remove(org);
  }
}
