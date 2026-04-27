import { Injectable } from '@nestjs/common';
import { CreateProcessEvaluationDto } from '../dto/proccess_evaluation.dto';


@Injectable()
export class ProccessEvaluationService {
  create(createProccessEvaluationDto: CreateProcessEvaluationDto) {
    return 'This action adds a new proccess-evaluation';
  }

  findAll() {
    return `This action returns all proccess-evaluations`;
  }


}
