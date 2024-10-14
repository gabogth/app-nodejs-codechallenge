import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "../../domain/core/transactionTypeEnum";
import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'External ID of the debit account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  accountExternalIdDebit: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'External ID of the credit account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  accountExternalIdCredit: string;

  @IsNumber()
  @ApiProperty({
    description: 'Type of transaction',
    example: 2,
  })
  transferTypeId: TransactionType;

  @IsNumber()
  @ApiProperty({
    description: 'Amount of transaction',
    example: 10.5,
  })
  value: number;
}