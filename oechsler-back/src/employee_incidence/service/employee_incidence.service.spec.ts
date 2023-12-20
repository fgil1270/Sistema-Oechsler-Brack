import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeIncidenceService } from './employee_incidence.service';

describe('EmployeeIncidenceService', () => {
  let service: EmployeeIncidenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeIncidenceService],
    }).compile();

    service = module.get<EmployeeIncidenceService>(EmployeeIncidenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
