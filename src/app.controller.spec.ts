import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { beforeAll, describe, expect, it } from 'vitest';

describe('DI test', () => {
  let service: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    service = module.get(AppService);
  });

  it('injects AppService', () => {
    expect(service).toBeDefined();
    expect(service.getHello()).toBe('Hello World!');
  });
});