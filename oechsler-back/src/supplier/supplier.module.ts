import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './service/supplier.service';
import { SupplierController } from './controller/supplier.controller';
import { Supplier } from './entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [SupplierController],
  providers: [SupplierService]
})
export class SupplierModule {}
