import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.favorites
  .findFirst()
  .then(async (result) => {
    if (result) {
      return;
    }
    await prisma.favorites.create({ data: {} });
    console.log('Favorites record created in Postgres');
  })
  .catch((error) => console.log(error))
  .finally(async () => await prisma.$disconnect());
