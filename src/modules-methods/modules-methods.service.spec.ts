import { Test, TestingModule } from '@nestjs/testing';
import { ModulesMethodsService } from './modules-methods.service';

describe('ModulesMethodsService', () => {
  let service: ModulesMethodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulesMethodsService],
    }).compile();

    service = module.get<ModulesMethodsService>(ModulesMethodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
