import { Module } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
