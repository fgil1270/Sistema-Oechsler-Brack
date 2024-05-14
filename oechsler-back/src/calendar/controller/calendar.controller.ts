import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CalendarService } from '../service/calendar.service';
import { CreateCalendarDto } from '../dto/create-calendar.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Calendario')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Crea fecha para el calendario' })
  @Post()
  create(
    @Body() createCalendarDto: CreateCalendarDto,
    @CurrentUser() user: any,
  ) {
    return this.calendarService.create(createCalendarDto, user);
  }

  @ApiOperation({ summary: 'Listar fechas del calendario' })
  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @ApiOperation({ summary: 'Buscar fecha por fecha' })
  @Get('/date/:date')
  findByDate(@Param('date') date: string) {
    return this.calendarService.findByDate(date);
  }

  @ApiOperation({ summary: 'Buscar fecha por rango de fechas' })
  @Get('/range-date')
  findRangeDate(@Query() dataDate: any) {
    return this.calendarService.findRangeDate(dataDate);
  }
}
