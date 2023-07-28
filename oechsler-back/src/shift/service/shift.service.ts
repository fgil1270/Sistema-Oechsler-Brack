import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateShiftDto, UpdateShiftDto } from '../dto/create-shift.dto';
import { Shift } from "../entities/shift.entity";

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>
  ){}

  async create(createShiftDto: CreateShiftDto) {
    const shiftExist = await this.shiftRepository.findOne({
      where: {
        code: Like(`%${createShiftDto.code}%`)
      }
    });

    if (shiftExist?.id) {
      throw new BadRequestException(`El Turno ya existe`);
    }

    const shift = this.shiftRepository.create(createShiftDto);
    return await this.shiftRepository.save(shift);
  }

  async findAll() {
    const total = await this.shiftRepository.count();
    const shifts = await this.shiftRepository.find();
    
    if (!shifts) {
      throw new NotFoundException(`Shifts not found`);
    }
    return {
      total: total,
      shifts: shifts
    };
  }

  async findOne(id: number) {
    const shift = await this.shiftRepository.findOne({
      where: {
        id: id
      }
    });
    if (!shift) {
      throw new NotFoundException(`Shift #${id} not found`);
    }
    return {
      shift
    };
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const shift = await this.shiftRepository.findOne({
      where: {
        id: id
      }
    });

    if (!shift) {
      throw new NotFoundException(`Shift #${id} not found`);
    }

    const shiftExist = await this.shiftRepository.findOne({
      where: {
        code: Like(`%${updateShiftDto.code}%`),
        id: Not(id)
      }
    });

    if (shiftExist?.id) {
      throw new BadRequestException(`El Turno ya existe`);
    }

    const updatedShift = Object.assign(shift, updateShiftDto);
    return await this.shiftRepository.save(updatedShift);
  }

  async remove(id: number) {
    const shift = await this.shiftRepository.findOne({
      where: {
        id: id
      }
    });

    if (!shift) {
      throw new NotFoundException(`Shift #${id} not found`);
    }

    return await this.shiftRepository.softDelete(shift);
  }
}
