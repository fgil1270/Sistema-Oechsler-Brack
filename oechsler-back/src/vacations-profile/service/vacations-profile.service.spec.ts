import { Test, TestingModule } from '@nestjs/testing';
import { VacationsProfileService } from './vacations-profile.service';

describe('VacationsProfileService', () => {
  let service: VacationsProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacationsProfileService],
    }).compile();

    service = module.get<VacationsProfileService>(VacationsProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
