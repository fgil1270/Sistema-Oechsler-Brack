import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile, readFileSync, writeFile } from 'fs';
import { read, utils } from 'xlsx';
import { format } from 'date-fns';
import * as moment from 'moment';

import {
  CreateLogAdjustmentVacationDto,
  UpdateLogAdjustmentVacationDto,
} from '../dto/create_adjustment_vacation.dto';
import { LogAdjustmentVacation } from '../entities/log_adjustment_vacation.entity';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class LogAdjustmentVacationService {
  constructor(
    @InjectRepository(LogAdjustmentVacation)
    private logAdjustmentVacationRepository: Repository<LogAdjustmentVacation>,
    private employeeService: EmployeesService,
  ) {}

  async create(
    createLogAdjustmentVacationDto: CreateLogAdjustmentVacationDto,
    user: any,
  ) {
    const emp = await this.employeeService.findOne(
      createLogAdjustmentVacationDto.id_employee,
    );
    const leader = await this.employeeService.findOne(user.idEmployee);
    const logAdjustmentVacation = this.logAdjustmentVacationRepository.create(
      createLogAdjustmentVacationDto,
    );

    logAdjustmentVacation.employee = emp.emp;
    logAdjustmentVacation.leader = leader.emp;

    return await this.logAdjustmentVacationRepository.save(
      logAdjustmentVacation,
    );
  }

  async findAll() {
    const total = await this.logAdjustmentVacationRepository.count();
    const logAdjustmentVacations =
      await this.logAdjustmentVacationRepository.find();

    if (!logAdjustmentVacations) {
      throw new NotFoundException(`Views not found`);
    }
    return {
      total: total,
      logAdjustmentVacations: logAdjustmentVacations,
    };
  }

  async findOne(id: number) {
    const logAdjustmentVacation =
      await this.logAdjustmentVacationRepository.findOne({
        relations: {
          employee: true,
        },
        where: {
          id: id,
        },
      });
    if (!logAdjustmentVacation) {
      throw new NotFoundException(`Log Adjustment Vacation #${id} not found`);
    }
    return {
      logAdjustmentVacation,
    };
  }

  async findby(data: any) {
    const logAdjustmentVacations =
      await this.logAdjustmentVacationRepository.find({
        relations: {
          employee: true,
          leader: true,
        },
        where: {
          employee: {
            id: data.id_employee,
          },
        },
      });
    if (!logAdjustmentVacations) {
      throw new NotFoundException(
        `Log Adjustment Vacation #${data.id_employee} not found`,
      );
    }

    return logAdjustmentVacations;
  }

  async update(
    id: number,
    updateLogAdjustmentVacationDto: CreateLogAdjustmentVacationDto,
  ) {
    const logAdjustmentVacation =
      await this.logAdjustmentVacationRepository.findOne({
        where: {
          id: id,
        },
      });

    if (!logAdjustmentVacation) {
      throw new NotFoundException(`Log Adjustment Vacation #${id} not found`);
    }
    const editedLogAdjustmentVacation = Object.assign(
      logAdjustmentVacation,
      updateLogAdjustmentVacationDto,
    );
    return await this.logAdjustmentVacationRepository.save(
      editedLogAdjustmentVacation,
    );
  }

  async remove(id: number) {
    return await this.logAdjustmentVacationRepository.softDelete(id);
  }
}
