import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service'; // Ajusta la ruta según tu estructura de archivos
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta según tu estructura de archivos

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prisma.transaction.update with correct parameters', async () => {
    const updateSpy = jest.spyOn(prismaService.transaction, 'update').mockResolvedValue(undefined);
    const id = 'transaction-id';
    const statusId = 1;
    await service.updateTransactionFraudStatus(id, statusId);
    
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id },
      data: { transactionStatusId: statusId },
    });
  });
});