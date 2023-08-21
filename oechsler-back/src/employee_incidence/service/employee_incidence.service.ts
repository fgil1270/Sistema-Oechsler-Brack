import { Injectable } from '@nestjs/common';
import { CreateEmployeeIncidenceDto, UpdateEmployeeIncidenceDto } from '../dto/create-employee_incidence.dto';


@Injectable()
export class EmployeeIncidenceService {
  create(createEmployeeIncidenceDto: CreateEmployeeIncidenceDto) {
    return 'This action adds a new employeeIncidence';
  }

  findAll() {
    return `This action returns all employeeIncidence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeeIncidence`;
  }

  update(id: number, updateEmployeeIncidenceDto: UpdateEmployeeIncidenceDto) {
    return `This action updates a #${id} employeeIncidence`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeeIncidence`;
  }
}
