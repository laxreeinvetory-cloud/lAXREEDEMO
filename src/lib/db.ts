import { PrismaClient } from '@prisma/client'
import { localDb } from '@/lib/local-db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Detects whether DATABASE_URL points at a SQLite file (local dev) while the
 * Prisma schema is configured for PostgreSQL (production / Vercel + Neon).
 *
 * When this mismatch is present, we route every DB call to a local JSON
 * file-based store (see src/lib/local-db.ts) so that admin edits persist
 * during local development. In production, a real PrismaClient is used.
 */
function isLocalSqliteMismatch(): boolean {
  const url = process.env.DATABASE_URL || '';
  return url.startsWith('file:');
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

/**
 * `db` is a Proxy over either the local JSON store (dev) or a real
 * PrismaClient (production).
 *
 * When running locally with a SQLite-style DATABASE_URL but a PostgreSQL
 * schema, the Proxy hands out model adapters from `localDb`. Each adapter
 * implements findMany / findUnique / create / update / upsert / delete /
 * deleteMany / count / aggregate / groupBy and persists rows to
 * `<projectRoot>/db/data/<model>.json`.
 *
 * On production (Vercel + Neon Postgres), `DATABASE_URL` is a real
 * `postgres://` URL, so the Proxy delegates to a genuine PrismaClient.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    // Local SQLite mismatch → use the JSON file-based store.
    if (isLocalSqliteMismatch()) {
      const model = localDb[prop as string];
      if (model) return model;
      // `$disconnect`, `$connect`, `$transaction`, etc. → no-op
      if (typeof prop === 'string' && prop.startsWith('$')) {
        if (prop === '$transaction') {
          return async (fn: unknown) =>
            typeof fn === 'function' ? (fn as () => unknown)() : [];
        }
        return async () => undefined;
      }
      return undefined;
    }

    // Production path — real Prisma client.
    if (!_client) {
      _client = globalForPrisma.prisma ?? createClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _client;
      }
    }
    const val = (_client as unknown as Record<string, unknown>)[prop as string];
    return typeof val === 'function' ? val.bind(_client) : val;
  },
});
