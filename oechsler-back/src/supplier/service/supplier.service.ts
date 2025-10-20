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
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { Supplier } from '../entities/supplier.entity';
import { Teacher } from '../entities/teacher.entity';
import { es } from 'date-fns/locale';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) { }

  //crear un proveedor
  async create(createSupplierDto: CreateSupplierDto) {
    const createSupplier = this.supplierRepository.create(createSupplierDto);

    //se crea un array de condiciones para la busqueda
    const whereClauses: FindOptionsWhere<Supplier>[] = [];

    if (createSupplierDto.business_name) {
      whereClauses.push({ business_name: createSupplierDto.business_name } as FindOptionsWhere<Supplier>);
    }
    if (createSupplierDto.name) {
      whereClauses.push({ name: createSupplierDto.name } as FindOptionsWhere<Supplier>);
    }
    if (createSupplierDto.code) {
      whereClauses.push({ code: createSupplierDto.code } as FindOptionsWhere<Supplier>);
    }

    let findExisting: Supplier | null = null;
    if (whereClauses.length) {
      findExisting = await this.supplierRepository.findOne({
        where: whereClauses,
      });
    }

    if (findExisting) {
      throw new NotFoundException('El proveedor ya existe');
    }

    const supplier = await this.supplierRepository.save(createSupplier);



    return supplier;
  }

  //buscar todos los proveedores
  async findSuplierAll() {
    const supplier = await this.supplierRepository.find();

    return supplier;
  }

  //buscar un proveedor por id
  async findSupplierOne(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id: id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  //actualizar un proveedor
  async updateSupplier(id: number, updateSupplierDto: UpdateSupplierDto) {

    //buscar el proveedor por id
    const supplier = await this.supplierRepository.findOne({ where: { id: id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    Object.assign(supplier, updateSupplierDto);

    await this.supplierRepository.save(supplier);

    return supplier;
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
    } else {

      teacher = await this.teacherRepository.find({
        relations: {
          supplier: true,
        },
      });
    }



    return teacher;
  }

  //buscar un instructor por id
  async findTeacherById(id: number) {

    const teacher = await this.teacherRepository.findOne({
      relations: {
        supplier: true,
      },
      where: {
        id: id,
      },
    });

    return teacher;
  }


  //crear un instructor
  async createTeacher(data: CreateTeacherDto) {
    const teacher = this.teacherRepository.create(data);

    const supplier = await this.supplierRepository.findOne({
      where: { id: data.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    teacher.supplier = supplier;

    return this.teacherRepository.save(teacher);
  }
}
