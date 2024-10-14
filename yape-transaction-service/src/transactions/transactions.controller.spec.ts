import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransactionDto } from './dto/CreateTransactionDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigEnv } from '../domain/core/configEnv';

describe('TransactionsController', () => {
    let controller: TransactionsController;
    let transactionsService: TransactionsService;
    let kafkaService: KafkaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                {
                    provide: TransactionsService,
                    useValue: {
                        retieveTransaction: jest.fn(),
                        createTransaction: jest.fn(),
                    },
                },
                {
                    provide: KafkaService,
                    useValue: {
                        send: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransactionsController>(TransactionsController);
        transactionsService = module.get<TransactionsService>(TransactionsService);
        kafkaService = module.get<KafkaService>(KafkaService);
    });

    describe('retrieveTransaction', () => {
        it('should retrieve a transaction by id', async () => {
            const transactionId = '123';
            const mockTransaction = {
                transactionExternalId: 'external-id',
                transactionType: 'debit',
                transactionStatus: 'pending',
                value: 200,
                createdAt: new Date()
            };

            jest.spyOn(transactionsService, 'retieveTransaction').mockResolvedValue(mockTransaction);

            const result = await controller.retrieveTransaction(transactionId);
            expect(result).toEqual(mockTransaction);
        });

        it('should throw NotFoundException if transaction is not found', async () => {
            const transactionId = '999';
            jest.spyOn(transactionsService, 'retieveTransaction').mockRejectedValue(new NotFoundException());

            await expect(controller.retrieveTransaction(transactionId)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for any other error', async () => {
            const transactionId = '999';
            jest.spyOn(transactionsService, 'retieveTransaction').mockRejectedValue(new Error('Some error occurred'));

            await expect(controller.retrieveTransaction(transactionId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('createTransaction', () => {
        it('should create a transaction and send it to Kafka', async () => {
            const createTransactionDto: CreateTransactionDto = {
                value: 200,
                accountExternalIdCredit: '123',
                accountExternalIdDebit: '321',
                transferTypeId: 1
            };
            const mockTransaction = {
                transactionExternalId: 'external-id',
                transactionType: 'debit',
                transactionStatus: 'pending',
                value: 200,
                createdAt: new Date()
            };

            jest.spyOn(transactionsService, 'createTransaction').mockResolvedValue(mockTransaction);
            jest.spyOn(kafkaService, 'send').mockResolvedValue(undefined);

            const result = await controller.createTransaction(createTransactionDto);
            expect(result).toEqual(mockTransaction);
            expect(kafkaService.send).toHaveBeenCalledWith(ConfigEnv.TOPIC, mockTransaction);
        });

        it('should throw BadRequestException if there is an error during creation', async () => {
            const createTransactionDto: CreateTransactionDto = {
                value: 200,
                accountExternalIdCredit: '123',
                accountExternalIdDebit: '321',
                transferTypeId: 1
            } as CreateTransactionDto;
            jest.spyOn(transactionsService, 'createTransaction').mockRejectedValue(new Error('Creation error'));

            await expect(controller.createTransaction(createTransactionDto)).rejects.toThrow(BadRequestException);
        });
    });
});
