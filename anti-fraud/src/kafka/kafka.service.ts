import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { Transaction } from '../domain/core/transaction';
import { AntifraudcheckService } from '../antifraudcheck/antifraudcheck.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionStatus } from '../domain/core/transactionStatusEnum';
import { ConfigEnv } from '../domain/core/configEnv';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(private antifraudcheckService: AntifraudcheckService, private transactionsService: TransactionsService) {
        console.log("clientId", ConfigEnv.CLIENTID, "brokers", ConfigEnv.BROKERS);
        this.kafka = new Kafka({
            clientId: ConfigEnv.CLIENTID,
            brokers: ConfigEnv.BROKERS
        });
    }

    async onModuleInit() {
        this.consumer = this.kafka.consumer({ groupId: ConfigEnv.GROUPID });
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: ConfigEnv.TOPIC, fromBeginning: true });
        await this.runConsumer();
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }

    private async runConsumer() {
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const transaction = JSON.parse(message.value?.toString()) as Transaction;
                this.processAntifraud(transaction)
            },
        });
    }

    private async processAntifraud(transaction: Transaction){
        const isFrudulent = await this.antifraudcheckService.isFraudulent(transaction);
        const status = isFrudulent ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
        await this.transactionsService.updateTransactionFraudStatus(transaction.transactionExternalId, status);
    }
}