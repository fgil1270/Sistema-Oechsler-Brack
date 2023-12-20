import { Test, TestingModule } from '@nestjs/testing';
import { VacationsProfileController } from './vacations-profile.controller';
import { VacationsProfileService } from '../service/vacations-profile.service';

describe('VacationsProfileController', () => {
  let controller: VacationsProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacationsProfileController],
      providers: [VacationsProfileService],
    }).compile();

    controller = module.get<VacationsProfileController>(VacationsProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
