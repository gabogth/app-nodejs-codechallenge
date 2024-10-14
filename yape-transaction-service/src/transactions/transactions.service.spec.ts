import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/CreateTransactionDto';
import { TransactionStatus } from '../domain/core/transactionStatusEnum';
import { Transaction } from '@prisma/client'

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
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionsService>(TransactionsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('retrieveTransaction', () => {
        it('should retrieve a transaction by id', async () => {
            const transactionId = '12312312-123-12-3';
            const mockTransaction = {
                id: '12312312-123-12-3',
                accountExternalIdCredit: '123',
                accountExternalIdDebit: '321',
                createdAt: new Date(),
                transactionStatusId: 1,
                transferTypeId: 2,
                value: 200
            } as Transaction;

            jest.spyOn(prismaService.transaction, 'findUnique').mockResolvedValue(mockTransaction);

            const result = await service.retieveTransaction(transactionId);
            expect(result).toEqual({
                transactionExternalId: mockTransaction.id,
                transactionType: undefined,
                transactionStatus: undefined,
                value: mockTransaction.value,
                createdAt: mockTransaction.createdAt
            });
        });

        it('should throw NotFoundException if transaction is not found', async () => {
            const transactionId = '999';
            jest.spyOn(prismaService.transaction, 'findUnique').mockResolvedValue(null);

            await expect(service.retieveTransaction(transactionId)).rejects.toThrow(NotFoundException);
            await expect(service.retieveTransaction(transactionId)).rejects.toThrow("transaction no exists");
        });
    });

    describe('createTransaction', () => {
        it('should create a transaction', async () => {
            const createTransactionDto: CreateTransactionDto = {
                value: 200,
                accountExternalIdCredit: '123',
                accountExternalIdDebit: '321',
                transferTypeId: 1
            };
            const mockTransaction = {
                id: '12312312-123-12-3',
                accountExternalIdCredit: '123',
                accountExternalIdDebit: '321',
                createdAt: new Date(),
                transactionStatusId: 1,
                transferTypeId: 2,
                value: 200
            } as Transaction;

            jest.spyOn(prismaService.transaction, 'create').mockResolvedValue(mockTransaction);

            const result = await service.createTransaction(createTransactionDto);
            expect(result).toEqual({
                transactionExternalId: mockTransaction.id,
                transactionType: undefined,
                transactionStatus: undefined,
                value: mockTransaction.value,
                createdAt: mockTransaction.createdAt,
            });
            expect(prismaService.transaction.create).toHaveBeenCalledWith({
                data: {
                    ...createTransactionDto,
                    transactionStatusId: TransactionStatus.PENDING,
                },
                include: {
                    transactionType: {
                        select: { name: true },
                    },
                    transactionStatus: {
                        select: { name: true },
                    },
                },
            });
        });
    });
});
