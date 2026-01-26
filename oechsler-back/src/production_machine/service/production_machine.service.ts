import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  In,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  DataSource,
} from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

import { CreateProductionMachineDto } from '../dto/create_production_machine.dto';
import { ProductionMachine } from '../entities/production_machine.entity';

@Injectable()
export class ProductionMachineService {

  constructor(
    @InjectRepository(ProductionMachine)
    private productionMachineRepository: Repository<ProductionMachine>,
    @InjectDataSource() private dataSource: DataSource,
  ) { }

  //crear maquina de produccion
  create(createProductionMachineDto: CreateProductionMachineDto) {
    return 'This action adds a new production-machine';
  }

  //obtener todas las maquinas de produccion
  findAll() {
    return `This action returns all production-machines`;
  }

  //obtener una maquina de produccion por id
  findOne(id: number) {
    return `This action returns a #id production-machine`;
  }

  /*   update(id: number, updateProductionMachineDto: UpdateProductionMachineDto) {
      return `This action updates a #id production-machine`;
    } */

  //eliminar una maquina de produccion por id
  remove(id: number) {
    return `This action removes a #id production-machine`;
  }
}
