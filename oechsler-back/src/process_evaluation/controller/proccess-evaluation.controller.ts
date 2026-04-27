import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProcessEvaluationDto } from '../dto/proccess_evaluation.dto';
import { ProccessEvaluationService } from '../service/proccess-evaluation.service';

@Controller('proccess-evaluation')
export class ProccessEvaluationController {
  constructor(private readonly proccessEvaluationService: ProccessEvaluationService) { }

  @Post()
  create(@Body() createProcessEvaluationDto: CreateProcessEvaluationDto) {
    return this.proccessEvaluationService.create(createProcessEvaluationDto);
  }

  @Get()
  findAll() {
    return this.proccessEvaluationService.findAll();
  }


}
