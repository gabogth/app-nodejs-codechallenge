import { Injectable } from '@nestjs/common';
import { Transaction } from '../domain/core/transaction';

@Injectable()
export class AntifraudcheckService {
    async isFraudulent(transaction: Transaction) {
        //simulando una verificacion pesada
        await new Promise((resolve) => setTimeout(resolve, 3000));
        //termino simulacion
        return transaction.value > 1000;
    }
}
