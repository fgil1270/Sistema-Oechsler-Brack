import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { Calendar } from '../entities/calendar.entity';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    @Inject(forwardRef(() => EmployeesService)) private employeService: EmployeesService,
  ) { }

  async create(createCalendarDto: CreateCalendarDto, user: any) {
    const calendar = await this.calendarRepository.create(createCalendarDto);
    const emp = await this.employeService.findOne(user.idEmployee);
    calendar.created_by = emp.emp;
    return await this.calendarRepository.save(calendar);
  }

  async findAll() {
    return await this.calendarRepository.find();
  }

  async findOne(id: number) {
    const calendar = await this.calendarRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!calendar) throw new NotFoundException('La fecha no existe');

    return calendar;
  }

  async findByYear(year: Number) {
    const calendar = await this.calendarRepository.find({
      relations: {
        created_by: true,
      },
      where: {
        date: Between(
          format(new Date(year as any, 0, 1), 'yyyy-MM-dd') as any,
          format(new Date(year as any, 11, 31), 'yyyy-MM-dd') as any,
        ),
      },
    });

    if (!calendar) throw new NotFoundException('No hay fechas para este año');

    return calendar;
  }

  async findByDate(date: string) {
    const calendar = await this.calendarRepository.findOne({
      relations: {
        created_by: true,
      },
      where: {
        date: date as any,
      },
    });

    return calendar;
  }

  //calendario por rango de dias
  async findRangeDate(dataDate: any) {

    const startDate = new Date(dataDate.start);
    const endDate = new Date(dataDate.end);
    const calendar = await this.calendarRepository.find({
      relations: {
        created_by: true,
      },
      where: {
        date: Between(
          format(startDate, 'yyyy-MM-dd') as any,
          format(endDate, 'yyyy-MM-dd') as any,
        ),
      },
    });

    return calendar;
  }
}
