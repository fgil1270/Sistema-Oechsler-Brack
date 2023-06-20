import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ModulesService } from './service/modules.service';
import { ModulesController } from './controller/modules.controller';
import { ModuleViews } from "./entities/module.entity";
import { View } from 'src/views/entities/view.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleViews,
      View,
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
