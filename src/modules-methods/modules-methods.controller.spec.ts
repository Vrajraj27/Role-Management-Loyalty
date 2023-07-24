import { Test, TestingModule } from '@nestjs/testing';
import { ModulesMethodsController } from './modules-methods.controller';
import { ModulesMethodsService } from './modules-methods.service';

describe('ModulesMethodsController', () => {
  let controller: ModulesMethodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesMethodsController],
      providers: [ModulesMethodsService],
    }).compile();

    controller = module.get<ModulesMethodsController>(ModulesMethodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
