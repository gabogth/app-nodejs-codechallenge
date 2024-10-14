import { TransactionStatus } from "./transactionStatusEnum";
import { TransactionType } from "./transactionTypeEnum";

export class Transaction {
    transactionExternalId: string;
    value: number;
}