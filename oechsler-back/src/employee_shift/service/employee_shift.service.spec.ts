import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeShiftService } from './employee_shift.service';

describe('EmployeeShiftService', () => {
  let service: EmployeeShiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeShiftService],
    }).compile();

    service = module.get<EmployeeShiftService>(EmployeeShiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
