import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  providers: [TransactionsService, PrismaService, KafkaService],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
