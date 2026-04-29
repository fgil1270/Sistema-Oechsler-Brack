import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProccessEvaluationService } from './service/proccess-evaluation.service';
import { ProccessEvaluationController } from './controller/proccess-evaluation.controller';
import { ProccessEvaluation } from './entities/proccess-evaluation.entity';
import { ProccessEvaluationQuestion } from './entities/proccess-evaluation-question.entity';
import { ProccessEvaluationResponse } from './entities/proccess-evaluation-response.entity';
import { ProccessEvaluationQuiz } from './entities/proccess-evaluation-quiz.entity';
import { ProccessEvaluationQuizResponse } from './entities/proccess-evaluation-quiz-response.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProccessEvaluation,
      ProccessEvaluationQuestion,
      ProccessEvaluationResponse,
      ProccessEvaluationQuiz,
      ProccessEvaluationQuizResponse
    ]),
    EmployeesModule
  ],
  controllers: [ProccessEvaluationController],
  providers: [ProccessEvaluationService],
  exports: [ProccessEvaluationService]
})
export class ProcessEvaluationModule { }
