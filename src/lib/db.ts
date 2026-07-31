import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Detects whether DATABASE_URL points at a SQLite file (local dev) while the
 * Prisma schema is configured for PostgreSQL (production / Vercel + Neon).
 *
 * When this mismatch is present, any real Prisma query would hang forever
 * trying to reach a Postgres server that doesn't exist locally. Instead of
 * hanging, we return `null` and let callers fall back to static catalogue
 * data. This keeps every API route snappy on local dev without touching the
 * schema (which must stay `postgresql` for the Vercel deployment).
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
 * `db` is a Proxy over the real PrismaClient.
 *
 * When running locally with a SQLite-style DATABASE_URL but a PostgreSQL
 * schema, the Proxy short-circuits every model accessor (`db.product`,
 * `db.category`, …) so that `findMany` / `count` / etc. resolve to empty
 * results immediately. This makes the admin/products API respond instantly
 * with the static catalogue fallback instead of hanging on a Postgres
 * connection that will never succeed.
 *
 * On production (Vercel + Neon Postgres), `DATABASE_URL` is a real
 * `postgres://` URL, so the Proxy delegates to a genuine PrismaClient.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    // Local SQLite mismatch → return no-op handlers for known model names.
    if (isLocalSqliteMismatch()) {
      const noopModel = new Proxy({} as Record<string, (...args: unknown[]) => unknown>, {
        get(_t, method: string | symbol) {
          // All model methods resolve to empty / zero / null so callers
          // treating the result as an array or count keep working.
          if (method === 'findMany' || method === 'findUnique' || method === 'findFirst') {
            return async () => [];
          }
          if (method === 'count' || method === 'aggregate') {
            return async () => 0;
          }
          if (method === 'create' || method === 'createMany') {
            return async () => ({ count: 0 });
          }
          if (method === 'update' || method === 'updateMany' || method === 'upsert') {
            return async () => null;
          }
          if (method === 'delete' || method === 'deleteMany') {
            return async () => ({ count: 0 });
          }
          // Anything else (groupBy, etc.) → null
          return async () => null;
        },
      });

      const knownModels = new Set([
        'adminUser', 'lead', 'blogPost', 'siteContent', 'product', 'category', 'user',
      ]);
      if (typeof prop === 'string' && knownModels.has(prop)) {
        return noopModel;
      }

      // `$disconnect`, `$connect`, `$transaction`, etc. → no-op
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return typeof prop === 'string' && prop === '$transaction'
          ? async (fn: unknown) => (typeof fn === 'function' ? (fn as () => unknown)() : [])
          : async () => undefined;
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
