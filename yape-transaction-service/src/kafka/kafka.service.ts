import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigEnv } from '../domain/core/configEnv';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;

    constructor() {
        console.log("ConfigEnv.BROKERS", ConfigEnv.BROKERS, "ConfigEnv.CLIENTID", ConfigEnv.CLIENTID);
        this.kafka = new Kafka({
            clientId: ConfigEnv.CLIENTID,
            brokers: ConfigEnv.BROKERS
        });
    }

    async onModuleInit() {
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: true
        });
        await this.producer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async send(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
}
