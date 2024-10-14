import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/CreateTransactionDto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus } from '../domain/core/transactionStatusEnum';

@Injectable()
export class TransactionsService {
    constructor(private db: PrismaService){}

    async retieveTransaction(id: string) {  
        const transaction = await this.db.transaction.findUnique({
            where: { id },
            include: {
                transactionType: {
                    select: { name: true },
                },
                transactionStatus: {
                    select: { name: true },
                },
            },
        });
        if(!transaction) throw new NotFoundException("transaction no exists");
        return this.map(transaction);
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {  
        const transaction = await this.db.transaction.create({
            data: {
                ...createTransactionDto,
                transactionStatusId: TransactionStatus.PENDING
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
        return this.map(transaction);
    }

    private map(transaction){
        return {
            transactionExternalId: transaction.id, // Suponiendo que `id` es el external ID
            transactionType: transaction.transactionType,
            transactionStatus: transaction.transactionStatus,
            value: transaction.value,
            createdAt: transaction.createdAt,
        };
    }
}
