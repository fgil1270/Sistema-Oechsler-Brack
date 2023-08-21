import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeIncidenceService } from '../service/employee_incidence.service';
import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';


@Controller('employee-incidence')
export class EmployeeIncidenceController {
  constructor(private readonly employeeIncidenceService: EmployeeIncidenceService) {}

  @Post()
  create(@Body() createEmployeeIncidenceDto: CreateEmployeeIncidenceDto) {
    return this.employeeIncidenceService.create(createEmployeeIncidenceDto);
  }

  @Get()
  findAll() {
    return this.employeeIncidenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeIncidenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto) {
    return this.employeeIncidenceService.update(+id, updateEmployeeIncidenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeIncidenceService.remove(+id);
  }
}
