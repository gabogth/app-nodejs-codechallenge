import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaService } from './prisma/prisma.service';
import { KafkaService } from './kafka/kafka.service';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
