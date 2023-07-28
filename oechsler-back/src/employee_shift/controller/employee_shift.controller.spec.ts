import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeShiftController } from './employee_shift.controller';
import { EmployeeShiftService } from './employee_shift.service';

describe('EmployeeShiftController', () => {
  let controller: EmployeeShiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeShiftController],
      providers: [EmployeeShiftService],
    }).compile();

    controller = module.get<EmployeeShiftController>(EmployeeShiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
