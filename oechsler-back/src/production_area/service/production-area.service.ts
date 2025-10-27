import { Injectable } from '@nestjs/common';
import { CreateProductionAreaDto, UpdateProductionAreaDto } from '../dto/create-production-area.dto';


@Injectable()
export class ProductionAreaService {
  create(createProductionAreaDto: CreateProductionAreaDto) {
    return 'This action adds a new production-area';
  }

  findAll() {
    return `This action returns all production-areas`;
  }

  findOne(id: number) {
    return `This action returns a #id production-area`;
  }

  update(id: number, updateProductionAreaDto: UpdateProductionAreaDto) {
    return `This action updates a #id production-area`;
  }

  remove(id: number) {
    return `This action removes a #id production-area`;
  }
}
