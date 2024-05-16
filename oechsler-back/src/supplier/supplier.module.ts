import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './service/supplier.service';
import { SupplierController, TeacherController } from './controller/supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { Teacher } from './entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Supplier,
    Teacher,
  ])],
  controllers: [SupplierController, TeacherController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
