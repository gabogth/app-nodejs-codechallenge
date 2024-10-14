import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) {}

    async updateTransactionFraudStatus(id: string, transactionStatusId: number) {
        await this.prisma.transaction.update({
            where: { id },
            data: { transactionStatusId },
        });
    }
}
