import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * DB health check endpoint.
 *
 * Returns the status of the database connection so the admin panel can
 * show a warning banner when the DB is not working.
 */
export async function GET() {
  const url = process.env.DATABASE_URL || "";
  const isLocal = url.startsWith("file:");
  const isPostgres = url.startsWith("postgres");

  const status = {
    ok: true,
    mode: isLocal ? "local-json" : isPostgres ? "postgres" : "no-url",
    databaseUrl: url ? `${url.substring(0, 30)}...` : "(not set)",
    read: false,
    write: false,
    error: null as string | null,
    tablesExist: false,
  };

  try {
    // Test 1: Read
    try {
      const count = await db.siteContent.count();
      status.read = true;
      status.tablesExist = true;
      void count;
    } catch (readErr) {
      status.error = `Read failed: ${readErr instanceof Error ? readErr.message : String(readErr)}`;
      if (status.error.includes("does not exist") || status.error.includes("P2021")) {
        status.error += " — tables missing, run 'prisma db push' to create them";
      }
    }

    // Test 2: Write (only if read succeeded)
    if (status.read) {
      try {
        const testKey = "__health_check__";
        await db.siteContent.upsert({
          where: { key: testKey },
          create: { key: testKey, value: JSON.stringify({ ts: Date.now() }) },
          update: { value: JSON.stringify({ ts: Date.now() }) },
        });
        await db.siteContent.deleteMany({ where: { key: testKey } });
        status.write = true;
      } catch (writeErr) {
        status.error = `Write failed: ${writeErr instanceof Error ? writeErr.message : String(writeErr)}`;
      }
    }

    status.ok = status.read && (isLocal || status.write);
  } catch (err) {
    status.ok = false;
    status.error = `Unexpected: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json(status, { status: status.ok ? 200 : 500 });
}
