import { Test, TestingModule } from '@nestjs/testing';
import { IncidenceCatologueController } from './incidence_catologue.controller';
import { IncidenceCatologueService } from '../service/incidence_catologue.service';

describe('IncidenceCatologueController', () => {
  let controller: IncidenceCatologueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidenceCatologueController],
      providers: [IncidenceCatologueService],
    }).compile();

    controller = module.get<IncidenceCatologueController>(
      IncidenceCatologueController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
