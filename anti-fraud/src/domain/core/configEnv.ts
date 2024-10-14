export class ConfigEnv {
    public static BROKERS: string[] = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    public static CLIENTID: string = (process.env.KAFKA_CLIENTID || 'client_id');
    public static TOPIC: string = (process.env.KAFKA_TOPIC || 'transaction_topic');
    public static GROUPID: string = (process.env.KAFKA_GROUPID || 'group_id');
    public static STAGE: string = (process.env.STAGE || 'local');
}