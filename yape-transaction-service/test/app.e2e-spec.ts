import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Asegúrate de tener el módulo correcto
import { HttpStatus, INestApplication } from '@nestjs/common';
import { KafkaService } from '../src/kafka/kafka.service'; // Ajusta la ruta según tu estructura
import { PrismaService } from '../src/prisma/prisma.service'; // Ajusta la ruta según tu estructura
import * as request from 'supertest';
import { ConfigEnv } from '../src/domain/core/configEnv';

describe('App E2E', () => {
  let app: INestApplication;
  const mockPrismaService = {
    transaction: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  const mockKafkaService = {
    send: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KafkaService)
      .useValue(mockKafkaService)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a transaction', async () => {
    const mockResolveDb = {
      id: 'c5355226-f7c9-4dbc-8b1c-dfa32716f8af',
      accountExternalIdDebit: '3333',
      accountExternalIdCredit: '11111',
      transferTypeId: 3,
      value: 1000,
      transactionStatusId: 1,
      createdAt: '2024-10-14T18:49:58.745Z',
      transactionType: { name: 'Yape!' },
      transactionStatus: { name: 'pending' }
    };
    const req = {
      accountExternalIdDebit: "3333",
      accountExternalIdCredit: "11111",
      transferTypeId: 3,
      value: 1000
    };
    const resp = {
      transactionExternalId: "c5355226-f7c9-4dbc-8b1c-dfa32716f8af",
      transactionType: {
        name: "Yape!"
      },
      transactionStatus: {
        name: "pending"
      },
      value: 1000,
      createdAt: "2024-10-14T18:49:58.745Z",
    };

    mockPrismaService.transaction.create.mockResolvedValue(mockResolveDb);
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(req);
      console.log('response.status', response.status);
      
    expect(response.body.transactionExternalId).toBe(resp.transactionExternalId);
    expect(response.body.transactionType.name).toBe(resp.transactionType.name);
    expect(response.body.transactionStatus.name).toBe(resp.transactionStatus.name);
    expect(response.body.value).toBe(resp.value);
    expect(response.body.createdAt).toBe(resp.createdAt);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(mockKafkaService.send).toHaveBeenCalledWith(ConfigEnv.TOPIC, resp);
  });

  it('should retrieve a transaction', async () => {
    const mockResolveDb = {
      id: 'c5355226-f7c9-4dbc-8b1c-dfa32716f8af',
      accountExternalIdDebit: '3333',
      accountExternalIdCredit: '11111',
      transferTypeId: 3,
      value: 1000,
      transactionStatusId: 1,
      createdAt: '2024-10-14T18:49:58.745Z',
      transactionType: { name: 'Yape!' },
      transactionStatus: { name: 'pending' }
    };
    const id = 'c5355226-f7c9-4dbc-8b1c-dfa32716f8af';
    const resp = {
      transactionExternalId: "c5355226-f7c9-4dbc-8b1c-dfa32716f8af",
      transactionType: {
        name: "Yape!"
      },
      transactionStatus: {
        name: "pending"
      },
      value: 1000,
      createdAt: "2024-10-14T18:49:58.745Z",
    };

    mockPrismaService.transaction.findUnique.mockResolvedValue(mockResolveDb);
    const response = await request(app.getHttpServer())
      .get(`/transactions/${id}`)
      .send();
    expect(response.body.transactionExternalId).toBe(resp.transactionExternalId);
    expect(response.body.transactionType.name).toBe(resp.transactionType.name);
    expect(response.body.transactionStatus.name).toBe(resp.transactionStatus.name);
    expect(response.body.value).toBe(resp.value);
    expect(response.body.createdAt).toBe(resp.createdAt);
    expect(response.status).toBe(HttpStatus.OK);
  });
});