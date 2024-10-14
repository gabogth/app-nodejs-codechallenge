import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transactionType.createMany({
    data: [
      { id: 1, name: 'Transferencia' },
      { id: 2, name: 'Pago de Servicios' },
      { id: 3, name: 'Yape!' },
    ],
    skipDuplicates: true,
  });

  await prisma.transactionStatus.createMany({
    data: [
      { id: 1, name: 'pending' },
      { id: 2, name: 'approved' },
      { id: 3, name: 'rejected' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });