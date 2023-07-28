import { Injectable } from '@nestjs/common';
import { CreateShiftDto, UpdateShiftDto } from '../dto/create-shift.dto';

@Injectable()
export class ShiftService {
  create(createShiftDto: CreateShiftDto) {
    return 'This action adds a new shift';
  }

  findAll() {
    return `This action returns all shift`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shift`;
  }

  update(id: number, updateShiftDto: UpdateShiftDto) {
    return `This action updates a #${id} shift`;
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }
}
