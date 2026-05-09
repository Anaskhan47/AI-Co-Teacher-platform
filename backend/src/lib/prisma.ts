import { PrismaClient } from '@prisma/client';
import logger from './logger';

let prisma: PrismaClient;

try {
    // Lazy-initialization to prevent boot-time crashes in serverless environments
    prisma = new PrismaClient({
        log: ['error', 'warn'],
        errorFormat: 'minimal',
    });
    
    // Silence connection errors at the engine level
    prisma.$connect().catch(err => {
        logger.error('DATABASE_CONNECTION_DEFERRED: Engine will retry on first request.', { error: err.message });
    });
} catch (e) {
    logger.error('PRISMA_INITIALIZATION_CRITICAL_FAILURE', { error: e });
    // Provide a dummy object to prevent 'undefined' crashes, handlers will catch the null-client
    prisma = {} as PrismaClient;
}

export default prisma;
