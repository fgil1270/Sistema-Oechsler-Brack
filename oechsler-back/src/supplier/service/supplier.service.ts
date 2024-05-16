import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  QueryRunner,
  FindOptionsWhere,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { Supplier } from '../entities/supplier.entity';
import { Teacher } from '../entities/teacher.entity';
import { es } from 'date-fns/locale';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';
  }

  //buscar todos los proveedores
  async findSuplierAll() {
    const supplier = await this.supplierRepository.find();

    return supplier;
  }

  async findSupplierOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  async updateSupplier(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  async removeSupplier(id: number) {
    return `This action removes a #${id} supplier`;
  }

  //buscar todos los instructores por query
  async findTeacherAll(query: Partial<Teacher>) {

    let supplierId: any;
    let teacher: any;
    if (query.supplier) {

      supplierId = query.supplier;
      teacher = await this.teacherRepository.find({
        relations: {
          supplier: true,
        },
        where: {
          supplier: {
            id: supplierId
          },
        
        },
      })
    }else{

      teacher = await this.teacherRepository.find({
        relations: {
          supplier: true,
        },
      });
    }



    return teacher;
  }
}
