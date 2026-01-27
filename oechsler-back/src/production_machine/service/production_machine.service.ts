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
  async create(createProductionMachineDto: CreateProductionMachineDto) {
    return 'This action adds a new production-machine';
  }

  //obtener todas las maquinas de produccion
  async findAll() {
    return this.productionMachineRepository.find();
  }

  //obtener todas las maquinas de produccion con empleados
  async findAllWithEmployees() {
    return this.productionMachineRepository.find({
      relations: ['productionMachineEmployees'],
    });
  }

  //obtener una maquina de produccion por id
  async findOne(id: number) {

    let productionMachine = this.productionMachineRepository.findOne({
      where: { id: id },
      relations: ['productionMachineEmployees'],
    });
    return productionMachine;
  }

  /*   update(id: number, updateProductionMachineDto: UpdateProductionMachineDto) {
      return `This action updates a #id production-machine`;
    } */

  //eliminar una maquina de produccion por id
  async remove(id: number) {
    return `This action removes a #id production-machine`;
  }
}
