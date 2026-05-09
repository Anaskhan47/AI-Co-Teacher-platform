import { PrismaClient } from '@prisma/client';

/**
 * ENTERPRISE PRISMA SINGLETON
 * Designed for Vercel Serverless environments.
 * Prevents connection exhaustion and runtime initialization crashes.
 */

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'minimal',
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * SAFE EXECUTION WRAPPER
 * Intercepts database calls and provides a graceful fallback if the engine fails.
 */
export const safeDb = async <T>(operation: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "") {
      return fallback;
    }
    return await operation();
  } catch (error) {
    console.error("[PRISMA_RUNTIME_ERROR]", error);
    return fallback;
  }
};

export default prisma;
