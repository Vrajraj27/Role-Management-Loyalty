import { Test, TestingModule } from '@nestjs/testing';
import { PermisisonController } from './permisison.controller';
import { PermisisonService } from './permisison.service';

describe('PermisisonController', () => {
  let controller: PermisisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermisisonController],
      providers: [PermisisonService],
    }).compile();

    controller = module.get<PermisisonController>(PermisisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
