import { Module } from '@nestjs/common';
import { AntifraudcheckService } from '../antifraudcheck/antifraudcheck.service';
import { TransactionsService } from '../transactions/transactions.service';
import { KafkaService } from './kafka.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [AntifraudcheckService, TransactionsService, KafkaService, PrismaService],
    exports: [KafkaService]
})
export class KafkaModule {}
