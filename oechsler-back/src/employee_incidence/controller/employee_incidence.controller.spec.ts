import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeIncidenceController } from './employee_incidence.controller';
import { EmployeeIncidenceService } from './employee_incidence.service';

describe('EmployeeIncidenceController', () => {
  let controller: EmployeeIncidenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeIncidenceController],
      providers: [EmployeeIncidenceService],
    }).compile();

    controller = module.get<EmployeeIncidenceController>(EmployeeIncidenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
