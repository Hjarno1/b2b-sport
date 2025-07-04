// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // this lets us avoid reconnect storms in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: ['query', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
