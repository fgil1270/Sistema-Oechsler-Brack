import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreatePayrollDto } from '../dto/create-payroll.dto';
import { Payroll } from "../entities/payroll.entity";

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll) private payrollRepository: Repository<Payroll>
  ){}

  async create(createPayrollDto: CreatePayrollDto) {
    const payrollExist = await this.payrollRepository.findOne({
      where: {
        name: Like(`%${createPayrollDto.name}%`)
      }
    });

    if (payrollExist?.id) {
      throw new BadRequestException(`La nómina ya existe`);
    }

    const payroll = this.payrollRepository.create(createPayrollDto);
    return await this.payrollRepository.save(payroll);
  }

  async findAll() {
    const total = await this.payrollRepository.count();
    const payrolls = await this.payrollRepository.find();
    
    if (!payrolls) {
      throw new NotFoundException(`PayRolls not found`);
    }
    return {
      total: total,
      payrolls: payrolls
    };
  }

  async findOne(id: number) {
    const payroll = await this.payrollRepository.findOne({
      where: {
        id: id
      }
    });
    if (!payroll) {
      throw new NotFoundException(`Payroll #${id} not found`);
    }
    return {
      payroll
    };
  }

  async findName(name: string) {
    const payroll = await this.payrollRepository.findOne({
      where: {
        name: Like(`%${name}%`)
      }
    });
    if (!payroll) {
      return {payroll};
      throw new NotFoundException(`Payroll #${name} not found`);
    }
    return {payroll};
  }

  async update(id: number, updatePayrollDto: CreatePayrollDto) {
    const payroll = await this.payrollRepository.findOneBy({id});
    this.payrollRepository.merge(payroll, updatePayrollDto);
    return await this.payrollRepository.update(id, payroll);
  }

  async remove(id: number) {
    const payroll = await this.payrollRepository.findOne({
      where: {
        id: id
      }
    });
    if (!payroll) {
      throw new NotFoundException(`Payroll #${id} not found`);
    }
    return await this.payrollRepository.softDelete(id);
  }
}
