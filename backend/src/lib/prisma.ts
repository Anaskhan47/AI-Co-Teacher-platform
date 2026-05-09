import { PrismaClient } from '@prisma/client';
import logger from './logger';

let prismaInstance: PrismaClient | null = null;

/**
 * ULTIMATE RESILIENCE PROXY
 * This prevents the Prisma engine from even LOADING into memory until a request is made.
 * This is the ONLY way to prevent Vercel boot-time 500 errors when DATABASE_URL is bad.
 */
const prismaProxy = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        // Only initialize when a property is accessed (e.g., prisma.user)
        if (!prismaInstance) {
            try {
                logger.info('PRISMA_LAZY_INITIALIZATION: Initializing engine on-demand.');
                prismaInstance = new PrismaClient({
                    log: ['error', 'warn'],
                    errorFormat: 'minimal',
                });
            } catch (e) {
                logger.error('PRISMA_CRITICAL_BOOT_FAILURE: Falling back to null-instance.', { error: e });
                // Return a dummy to prevent immediate crash, let controllers handle the missing data
                return () => Promise.resolve(null);
            }
        }
        
        const value = (prismaInstance as any)[prop];
        if (typeof value === 'function') {
            return value.bind(prismaInstance);
        }
        return value;
    }
});

export default prismaProxy;
