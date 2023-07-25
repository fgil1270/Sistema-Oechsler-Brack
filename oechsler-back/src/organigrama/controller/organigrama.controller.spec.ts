import { Test, TestingModule } from '@nestjs/testing';
import { OrganigramaController } from './organigrama.controller';
import { OrganigramaService } from './organigrama.service';

describe('OrganigramaController', () => {
  let controller: OrganigramaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganigramaController],
      providers: [OrganigramaService],
    }).compile();

    controller = module.get<OrganigramaController>(OrganigramaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
