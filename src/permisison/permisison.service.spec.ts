import { Test, TestingModule } from '@nestjs/testing';
import { PermisisonService } from './permisison.service';

describe('PermisisonService', () => {
  let service: PermisisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermisisonService],
    }).compile();

    service = module.get<PermisisonService>(PermisisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
