import { Test, TestingModule } from '@nestjs/testing';
import { IncidenceCatologueService } from './incidence_catologue.service';

describe('IncidenceCatologueService', () => {
  let service: IncidenceCatologueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidenceCatologueService],
    }).compile();

    service = module.get<IncidenceCatologueService>(IncidenceCatologueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
