import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ViewsService } from './service/views.service';
import { ViewsController } from './controller/views.controller';
import { View } from './entities/view.entity';
import { ModuleViews } from 'src/modules/entities/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      View,
      ModuleViews,
    ]),
  ],
  controllers: [ViewsController],
  providers: [ViewsService],
  exports: [ViewsService]
})
export class ViewsModule {}
