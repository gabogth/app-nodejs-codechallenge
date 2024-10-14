import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudcheckService } from './antifraudcheck.service'; // Ajusta la ruta según tu estructura de archivos
import { Transaction } from '../domain/core/transaction'; // Ajusta la ruta según tu estructura de archivos

describe('AntifraudcheckService', () => {
  let service: AntifraudcheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntifraudcheckService],
    }).compile();

    service = module.get<AntifraudcheckService>(AntifraudcheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true for fraudulent transaction', async () => {
    const transaction: Transaction = { transactionExternalId: '123', value: 1500 };
    const result = await service.isFraudulent(transaction);
    expect(result).toBe(true);
  });

  it('should return false for non-fraudulent transaction', async () => {
    const transaction: Transaction = { transactionExternalId: '456', value: 800 };
    const result = await service.isFraudulent(transaction);
    expect(result).toBe(false);
  });
});
