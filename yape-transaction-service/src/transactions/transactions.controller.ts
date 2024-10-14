import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransactionDto } from './dto/CreateTransactionDto';
import { ConfigEnv } from '../domain/core/configEnv';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
    constructor(private service: TransactionsService, private senderKafka: KafkaService) { }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, description: 'Transaction retieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier for the transaction',
        type: String,
        example: 'c5355226-f7c9-4dbc-8b1c-dfa32716f8af'
    })
    async retrieveTransaction(@Param("id") id: string){
        try {
            return await this.service.retieveTransaction(id);
        } catch(e) {
            if(e instanceof NotFoundException) throw e;
            else throw new BadRequestException(e.message);
        }
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async createTransaction(@Body() transactionReq: CreateTransactionDto){
        try {
            const transaction = await this.service.createTransaction(transactionReq);
            await this.senderKafka.send(ConfigEnv.TOPIC, transaction);
            return transaction;
        } catch(e) {
            throw new BadRequestException(e.message);
        }
    }
}
