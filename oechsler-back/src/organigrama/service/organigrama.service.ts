import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, Admin } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateOrganigramaDto,
  UpdateOrganigramaDto,
  OrganigramaGerarquia,
} from '../dto/create-organigrama.dto';
import { Organigrama } from '../entities/organigrama.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Organigrama)
    private organigramaRepository: Repository<Organigrama>,
    @Inject(forwardRef(() => EmployeesService))
    private employeeService: EmployeesService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

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
    const orgs = await this.organigramaRepository.find({
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
    });
    const query = `
            SELECT * FROM employee AS e
            INNER JOIN job AS j ON e.jobId = j.id
            INNER JOIN department AS d On e.departmentId = d.id
            WHERE j.shift_leader = 1
            `;
    const visibleJefeTurno = await this.organigramaRepository.query(query);

    if (!orgs) {
      throw new NotFoundException(`Organigrama not found`);
    }
    return {
      total: orgs.length,
      orgs: orgs,
    };
  }

  //SE OBTIENEN lideres
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
    admin.user.roles.find((role) => role.name === 'Admin')
      ? (isAdmin = true)
      : (isAdmin = false);

    const isRh = false;
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
      where: {
        leader: {
          id: idLeader,
        },
      },
    });

    const idsEmployees = [];
    idsEmployees.push(idLeader);
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
      if (isAdmin) {
        const levelOne = await this.employeeService.findAll();
        levelOne.emps.forEach((element) => {
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
          leader: In([user.idEmployee]),
        },
        order: {
          employee: {
            name: 'ASC',
            employee_number: 'ASC',
          },
        },
      });
      
      let visibleJefeTurno = await this.organigramaRepository.find({
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
            job: {
              shift_leader : true
            }
          }
        },
        order: {
          employee: {
            name: 'ASC',
            employee_number: 'ASC',
          },
        },
      });

      levelOne.forEach((element) => {
        employees.push(element.employee);
      });
      
      //si es jefe de turno agrega los empleados que su puesto es visible por jefe de turno
      if(isJefeTurno){
        let test: any[] = [];
        let test2: any[] = [];
        visibleJefeTurno.forEach((element) => {
          test.push(element.employee);
        });
        test2 = test.filter((element) => !employees.some((emp) => emp.id === element.id));
        employees.push(...test2);
        
      }

      

      if (data.type == 'Normal') {
        const userLogin = await this.employeeService.findOne(user.idEmployee);

        //levelOne.employee.push(...userLogin);
        employees.push(userLogin.emp);

        return employees;
      }

      const idsEmployees = [];

      for (let index = 0; index < employees.length; index++) {
        idsEmployees.push(employees[index].id);
      }

      const levelTwo = await this.organigramaRepository.find({
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
        },
      });

      levelTwo.forEach((element) => {
        employees.push(element.employee);
      });

      //levelTwo.push(...levelOne);

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
