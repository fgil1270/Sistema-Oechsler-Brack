import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { format } from 'date-fns';
import * as moment from 'moment';

import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { Calendar } from '../entities/calendar.entity';
import { EmployeesService } from '../../employees/service/employees.service';

@Injectable()
export class CalendarService {

    constructor(
        @InjectRepository(Calendar) private calendarRepository: Repository<Calendar>,
        private employeService: EmployeesService,
    ) {}

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
                id:id
            }
        });
        if (!calendar) throw new NotFoundException('La fecha no existe');

        return calendar;
    }
    async findByDate(date: string) {
        const calendar = await this.calendarRepository.findOne({
            where: {
                date: date as any
            }
        });
        
        return calendar;
    }

    

}
