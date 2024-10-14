import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';
import { AntifraudcheckService } from '../antifraudcheck/antifraudcheck.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Kafka, Consumer } from 'kafkajs';
import { ConfigEnv } from '../domain/core/configEnv';
import { Transaction } from '../domain/core/transaction';
import { TransactionStatus } from '../domain/core/transactionStatusEnum';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }),
  })),
}));

describe('KafkaService', () => {
  let service: KafkaService;
  let transactionsService: TransactionsService;
  let kafkaMock: Kafka;
  let consumerMock: Consumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        {
          provide: AntifraudcheckService,
          useValue: new AntifraudcheckService(),
        },
        {
          provide: TransactionsService,
          useValue: {
            updateTransactionFraudStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
    transactionsService = module.get<TransactionsService>(TransactionsService);

    kafkaMock = new Kafka({
      clientId: ConfigEnv.CLIENTID,
      brokers: ConfigEnv.BROKERS,
    });
    consumerMock = kafkaMock.consumer({ groupId: ConfigEnv.GROUPID });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject transactions when the value is greater than 1000', async () => {
    const transaction: Transaction = { transactionExternalId: '123', value: 1200 };
    const updateStatusSpy = jest.spyOn(transactionsService, 'updateTransactionFraudStatus').mockResolvedValue(undefined);
    await service['processAntifraud'](transaction);
    expect(updateStatusSpy).toHaveBeenCalledWith(transaction.transactionExternalId, TransactionStatus.REJECTED);
  });

  it('should approve transactions when the value is less than 1000', async () => {
    const transaction: Transaction = { transactionExternalId: '123', value: 800 };
    const updateStatusSpy = jest.spyOn(transactionsService, 'updateTransactionFraudStatus').mockResolvedValue(undefined);
    await service['processAntifraud'](transaction);
    expect(updateStatusSpy).toHaveBeenCalledWith(transaction.transactionExternalId, TransactionStatus.APPROVED);
  });
});