import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy + safe Prisma client initialization.
// On Vercel serverless, if DATABASE_URL is not set or the connection
// fails, we must not crash the entire API route at module load time.
// The client is constructed lazily on first access; if construction or
// a query fails, calling code wraps the call in try/catch.
let _client: PrismaClient | null = null;

function createClient(): PrismaClient {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (!_client) {
      _client = globalForPrisma.prisma ?? createClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _client;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (_client as any)[prop];
    return typeof val === 'function' ? val.bind(_client) : val;
  },
});
