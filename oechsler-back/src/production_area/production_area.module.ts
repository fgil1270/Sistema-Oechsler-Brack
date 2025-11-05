import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductionAreaController } from './controller/production-area.controller';
import { ProductionArea } from './entities/production_area.entity';
import { ProductionAreaService } from './service/production-area.service';


@Module({
    imports: [TypeOrmModule.forFeature([ProductionArea])],
    controllers: [ProductionAreaController],
    providers: [ProductionAreaService],
    exports: [ProductionAreaService],
})
export class ProductionAreaModule { }
