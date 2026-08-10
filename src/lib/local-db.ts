/**
 * Local JSON file-based persistence layer.
 *
 * Why this exists:
 * - The Prisma schema is configured for PostgreSQL (for Vercel/Neon production).
 * - Locally, DATABASE_URL points at a SQLite file path (`file:...`), which the
 *   PostgreSQL Prisma client cannot talk to.
 * - Previously `db.ts` short-circuited every database call to a no-op, which
 *   meant admin edits (blog posts, CMS image overrides, settings) never
 *   persisted — causing "delete doesn't work", "images don't update on live",
 *   etc.
 *
 * What this does:
 * - Implements just enough of the PrismaClient surface (findMany, findUnique,
 *   findFirst, create, update, upsert, delete, deleteMany, count, aggregate)
 *   to back every model used by the API routes.
 * - Persists each model's rows to a JSON file under `<projectRoot>/db/data/`.
 * - Reads/writes are synchronous on the event loop (the datasets are tiny:
 *   a handful of blog posts, a few SiteContent rows, maybe 50–200 products).
 *
 * This is dev-only. In production (real `postgres://` URL) the real Prisma
 * client is used and this file is never imported.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

// Resolve <projectRoot>/db/data.
// In Next.js dev (Turbopack) and serverless, `process.cwd()` is the project
// root. `__dirname` is unreliable because Turbopack compiles to `.next/`.
const PROJECT_ROOT = process.cwd();

const DATA_DIR = join(PROJECT_ROOT, "db", "data");

// Ensure the data directory exists on first write.
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

// In-memory cache keyed by model name. Loaded lazily from disk on first access.
const cache = new Map<string, unknown[]>();

function filePath(model: string): string {
  return join(DATA_DIR, `${model}.json`);
}

function load(model: string): unknown[] {
  if (cache.has(model)) return cache.get(model)!;
  ensureDataDir();
  let rows: unknown[] = [];
  try {
    const raw = readFileSync(filePath(model), "utf8");
    rows = raw ? (JSON.parse(raw) as unknown[]) : [];
  } catch {
    // File doesn't exist yet — treat as empty.
    rows = [];
  }
  cache.set(model, rows);
  return rows;
}

function persist(model: string) {
  ensureDataDir();
  const rows = cache.get(model) ?? [];
  writeFileSync(filePath(model), JSON.stringify(rows, null, 2), "utf8");
}

// ─────────────────────────────────────────────────────────────
// Prisma-style filter matching
// ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function match(row: any, where: any): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const condition = where[key];

    // Logical AND
    if (key === "AND" && Array.isArray(condition)) {
      if (!condition.every((c) => match(row, c))) return false;
      continue;
    }
    // Logical OR
    if (key === "OR" && Array.isArray(condition)) {
      if (!condition.some((c) => match(row, c))) return false;
      continue;
    }
    // Logical NOT
    if (key === "NOT" && condition) {
      if (match(row, condition)) return false;
      continue;
    }

    const value = row[key];

    // Operator objects (e.g. { equals, contains, in, gt, lt, startsWith, ... })
    if (condition && typeof condition === "object" && !Array.isArray(condition) && !(condition instanceof Date)) {
      for (const op of Object.keys(condition)) {
        const operand = (condition as Record<string, unknown>)[op];
        switch (op) {
          case "equals":
            if (value !== operand) return false;
            break;
          case "not":
            if (value === operand) return false;
            break;
          case "in":
            if (!Array.isArray(operand) || !operand.includes(value)) return false;
            break;
          case "notIn":
            if (Array.isArray(operand) && operand.includes(value)) return false;
            break;
          case "contains":
            if (typeof value !== "string" || typeof operand !== "string") return false;
            if (!value.toLowerCase().includes(operand.toLowerCase())) return false;
            break;
          case "startsWith":
            if (typeof value !== "string" || typeof operand !== "string") return false;
            if (!value.toLowerCase().startsWith(operand.toLowerCase())) return false;
            break;
          case "endsWith":
            if (typeof value !== "string" || typeof operand !== "string") return false;
            if (!value.toLowerCase().endsWith(operand.toLowerCase())) return false;
            break;
          case "gt":
            if (typeof operand !== "number" && typeof operand !== "string") return false;
            if (!(value > (operand as number | string))) return false;
            break;
          case "gte":
            if (typeof operand !== "number" && typeof operand !== "string") return false;
            if (!(value >= (operand as number | string))) return false;
            break;
          case "lt":
            if (typeof operand !== "number" && typeof operand !== "string") return false;
            if (!(value < (operand as number | string))) return false;
            break;
          case "lte":
            if (typeof operand !== "number" && typeof operand !== "string") return false;
            if (!(value <= (operand as number | string))) return false;
            break;
          case "mode":
            // Handled by contains/startsWith (case-insensitive by default)
            break;
          default:
            // Unknown operator — fail safe
            return false;
        }
      }
    } else {
      // Plain equality
      if (value !== condition) return false;
    }
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortRows(rows: any[], orderBy?: any): any[] {
  if (!orderBy) return rows;
  const sortKeys = Array.isArray(orderBy) ? orderBy : [orderBy];
  // Apply sorts in reverse so the first key wins as primary
  const result = [...rows];
  for (let i = sortKeys.length - 1; i >= 0; i--) {
    const criterion = sortKeys[i];
    for (const field of Object.keys(criterion)) {
      const dir = criterion[field];
      result.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        if (av === undefined || av === null) return dir === "desc" ? 1 : -1;
        if (bv === undefined || bv === null) return dir === "desc" ? -1 : 1;
        if (typeof av === "string" && typeof bv === "string") {
          return dir === "desc" ? bv.localeCompare(av) : av.localeCompare(bv);
        }
        return dir === "desc" ? (av < bv ? 1 : -1) : av < bv ? -1 : 1;
      });
    }
  }
  return result;
}

function cuid(): string {
  // 24-char base36-ish id (good enough for local dev)
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 10);
  const rnd2 = Math.random().toString(36).slice(2, 10);
  return `${ts}${rnd}${rnd2}`.slice(0, 24).padEnd(24, "0");
}

// ─────────────────────────────────────────────────────────────
// Model proxy — implements the subset of Prisma methods used by
// every API route in /api/admin/* and /api/*.
// ─────────────────────────────────────────────────────────────
function makeModel(model: string) {
  return {
    // findMany
    findMany(args?: {
      where?: Record<string, unknown>;
      orderBy?: unknown;
      take?: number;
      skip?: number;
      select?: unknown;
      include?: unknown;
    }): Promise<unknown[]> {
      try {
        let rows = load(model);
        if (args?.where) rows = rows.filter((r) => match(r, args.where));
        if (args?.orderBy) rows = sortRows(rows, args.orderBy);
        if (args?.skip) rows = rows.slice(args.skip);
        if (args?.take !== undefined) rows = rows.slice(0, args.take);
        // Strip out internal _meta — none currently, but defensive copy
        return Promise.resolve(rows.map((r) => ({ ...(r as object) })));
      } catch (err) {
        console.error(`[local-db] ${model}.findMany error`, err);
        return Promise.resolve([]);
      }
    },

    findUnique(args: {
      where: Record<string, unknown>;
      select?: unknown;
      include?: unknown;
    }): Promise<unknown | null> {
      try {
        const rows = load(model);
        const found = rows.find((r) => match(r, args.where));
        return Promise.resolve(found ? { ...(found as object) } : null);
      } catch (err) {
        console.error(`[local-db] ${model}.findUnique error`, err);
        return Promise.resolve(null);
      }
    },

    findFirst(args?: {
      where?: Record<string, unknown>;
      orderBy?: unknown;
      select?: unknown;
      include?: unknown;
    }): Promise<unknown | null> {
      try {
        let rows = load(model);
        if (args?.where) rows = rows.filter((r) => match(r, args!.where!));
        if (args?.orderBy) rows = sortRows(rows, args.orderBy);
        const found = rows[0];
        return Promise.resolve(found ? { ...(found as object) } : null);
      } catch (err) {
        console.error(`[local-db] ${model}.findFirst error`, err);
        return Promise.resolve(null);
      }
    },

    create(args: { data: Record<string, unknown> }): Promise<unknown> {
      try {
        const rows = load(model);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newRow: any = { ...args.data };
        if (!newRow.id) newRow.id = cuid();
        // Add timestamps if missing
        if (!newRow.createdAt) newRow.createdAt = new Date().toISOString();
        if (!newRow.updatedAt) newRow.updatedAt = new Date().toISOString();
        else newRow.updatedAt = new Date().toISOString();
        rows.push(newRow);
        cache.set(model, rows);
        persist(model);
        return Promise.resolve({ ...newRow });
      } catch (err) {
        console.error(`[local-db] ${model}.create error`, err);
        return Promise.reject(err);
      }
    },

    update(args: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }): Promise<unknown> {
      try {
        const rows = load(model);
        const idx = rows.findIndex((r) => match(r, args.where));
        if (idx === -1) {
          return Promise.reject(new Error("Record not found"));
        }
        const existing = rows[idx] as Record<string, unknown>;
        // Apply each field; ignore nested relation writes which we don't support
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated: any = { ...existing };
        for (const [k, v] of Object.entries(args.data)) {
          if (v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
            // Prisma nested write like { update: {...}, set: [...] } — flatten the common cases
            const nested = v as Record<string, unknown>;
            if (nested.set !== undefined) {
              updated[k] = nested.set;
            } else if (nested.connect !== undefined) {
              // Skip — we don't enforce relations locally
            } else if (nested.disconnect !== undefined) {
              // Skip
            } else {
              // Unknown nested op — store as-is (best effort)
              updated[k] = v;
            }
          } else {
            updated[k] = v;
          }
        }
        updated.updatedAt = new Date().toISOString();
        rows[idx] = updated;
        cache.set(model, rows);
        persist(model);
        return Promise.resolve({ ...updated });
      } catch (err) {
        console.error(`[local-db] ${model}.update error`, err);
        return Promise.reject(err);
      }
    },

    upsert(args: {
      where: Record<string, unknown>;
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }): Promise<unknown> {
      try {
        const rows = load(model);
        const idx = rows.findIndex((r) => match(r, args.where));
        if (idx === -1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newRow: any = { ...args.create };
          if (!newRow.id) newRow.id = cuid();
          if (!newRow.createdAt) newRow.createdAt = new Date().toISOString();
          newRow.updatedAt = new Date().toISOString();
          rows.push(newRow);
          cache.set(model, rows);
          persist(model);
          return Promise.resolve({ ...newRow });
        } else {
          const existing = rows[idx] as Record<string, unknown>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated: any = { ...existing, ...args.update };
          updated.updatedAt = new Date().toISOString();
          rows[idx] = updated;
          cache.set(model, rows);
          persist(model);
          return Promise.resolve({ ...updated });
        }
      } catch (err) {
        console.error(`[local-db] ${model}.upsert error`, err);
        return Promise.reject(err);
      }
    },

    delete(args: { where: Record<string, unknown> }): Promise<unknown> {
      try {
        const rows = load(model);
        const idx = rows.findIndex((r) => match(r, args.where));
        if (idx === -1) {
          return Promise.reject(new Error("Record not found"));
        }
        const removed = rows[idx];
        rows.splice(idx, 1);
        cache.set(model, rows);
        persist(model);
        return Promise.resolve({ ...(removed as object) });
      } catch (err) {
        console.error(`[local-db] ${model}.delete error`, err);
        return Promise.reject(err);
      }
    },

    deleteMany(args?: { where?: Record<string, unknown> }): Promise<{ count: number }> {
      try {
        const rows = load(model);
        const keep = args?.where ? rows.filter((r) => !match(r, args.where)) : [];
        const count = rows.length - keep.length;
        cache.set(model, keep);
        persist(model);
        return Promise.resolve({ count });
      } catch (err) {
        console.error(`[local-db] ${model}.deleteMany error`, err);
        return Promise.resolve({ count: 0 });
      }
    },

    count(args?: { where?: Record<string, unknown> }): Promise<number> {
      try {
        const rows = load(model);
        const filtered = args?.where ? rows.filter((r) => match(r, args!.where!)) : rows;
        return Promise.resolve(filtered.length);
      } catch (err) {
        console.error(`[local-db] ${model}.count error`, err);
        return Promise.resolve(0);
      }
    },

    aggregate(args: {
      where?: Record<string, unknown>;
      _count?: Record<string, boolean> | true;
      _sum?: Record<string, boolean>;
      _avg?: Record<string, boolean>;
      _min?: Record<string, boolean>;
      _max?: Record<string, boolean>;
    }): Promise<Record<string, unknown>> {
      try {
        const rows = load(model);
        const filtered = args.where ? rows.filter((r) => match(r, args.where!)) : rows;
        const result: Record<string, unknown> = {};
        if (args._count) result._count = filtered.length;
        // We only implement _count here — sum/avg/min/max rarely used in admin
        return Promise.resolve(result);
      } catch (err) {
        console.error(`[local-db] ${model}.aggregate error`, err);
        return Promise.resolve({});
      }
    },

    groupBy(args: {
      by: string[];
      where?: Record<string, unknown>;
      _count?: Record<string, boolean> | true;
    }): Promise<unknown[]> {
      try {
        const rows = load(model);
        const filtered = args.where ? rows.filter((r) => match(r, args.where!)) : rows;
        const groups = new Map<string, unknown[]>();
        for (const row of filtered) {
          const key = args.by.map((b) => String((row as Record<string, unknown>)[b])).join("|");
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(row);
        }
        const result = Array.from(groups.entries()).map(([key, groupRows]) => {
          const obj: Record<string, unknown> = {};
          args.by.forEach((b, i) => {
            obj[b] = key.split("|")[i];
          });
          if (args._count) obj._count = groupRows.length;
          return obj;
        });
        return Promise.resolve(result);
      } catch (err) {
        console.error(`[local-db] ${model}.groupBy error`, err);
        return Promise.resolve([]);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Public API — a Proxy that hands out the right model adapter
// ─────────────────────────────────────────────────────────────

const KNOWN_MODELS = [
  "adminUser",
  "lead",
  "blogPost",
  "siteContent",
  "product",
  "category",
  "user",
];

const modelCache = new Map<string, ReturnType<typeof makeModel>>();

export const localDb = new Proxy(
  {} as Record<string, ReturnType<typeof makeModel>>,
  {
    get(_target, prop: string | symbol) {
      if (typeof prop !== "string") return undefined;
      if (!KNOWN_MODELS.includes(prop)) return undefined;
      if (!modelCache.has(prop)) {
        modelCache.set(prop, makeModel(prop));
      }
      return modelCache.get(prop);
    },
  },
);

// Helpers for external callers that want to inspect/reset local data
export function _localDbDebug() {
  const snapshot: Record<string, unknown> = {};
  for (const m of KNOWN_MODELS) {
    snapshot[m] = load(m);
  }
  return snapshot;
}

export function _localDbPath(model: string): string {
  return filePath(model);
}

// `dirname` is used above for path resolution — silence unused warning
void dirname;
