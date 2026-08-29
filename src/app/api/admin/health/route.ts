import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connect } from "net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * DB health check endpoint.
 *
 * Returns the status of the database connection so the admin panel can
 * show a warning banner when the DB is not working.
 *
 * This endpoint does TWO checks:
 * 1. Raw TCP connection to the DB host:port (is the server reachable?)
 * 2. Prisma query (can we actually run queries?)
 *
 * If TCP works but Prisma fails, the issue is NOT network — it's likely
 * a Neon quota exceeded error, missing tables, or bad credentials.
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
    errorType: null as string | null,
    fixInstructions: null as string | null,
    tablesExist: false,
    tcpReachable: false,
  };

  // Parse the DB URL to extract host and port for TCP test
  let dbHost = "";
  let dbPort = 5432;
  if (isPostgres) {
    try {
      const match = url.match(/@([^:/?#]+):(\d+)/);
      if (match) {
        dbHost = match[1];
        dbPort = parseInt(match[2], 10);
      } else {
        const matchNoPort = url.match(/@([^:/?#]+)/);
        if (matchNoPort) dbHost = matchNoPort[1];
      }
    } catch {
      // ignore parse errors
    }
  }

  // Test 0: Raw TCP connection (is the DB server reachable at all?)
  if (dbHost) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = connect({ host: dbHost, port: dbPort, timeout: 10000 });
        socket.on("connect", () => {
          status.tcpReachable = true;
          socket.destroy();
          resolve();
        });
        socket.on("timeout", () => {
          socket.destroy();
          reject(new Error("TCP connection timeout"));
        });
        socket.on("error", (err) => {
          socket.destroy();
          reject(err);
        });
      });
    } catch (tcpErr) {
      status.tcpReachable = false;
      // TCP failed — the DB server is truly unreachable
      status.ok = false;
      status.errorType = "NETWORK";
      status.error = `Cannot reach database server at ${dbHost}:${dbPort}. ${tcpErr instanceof Error ? tcpErr.message : ""}`;
      status.fixInstructions =
        "The database server is not reachable. Check if your database provider (Neon/Supabase/etc.) is running and accessible.";
      return NextResponse.json(status, { status: 500 });
    }
  }

  try {
    // Test 1: Read via Prisma
    try {
      const count = await db.siteContent.count();
      status.read = true;
      status.tablesExist = true;
      void count;
    } catch (readErr) {
      const msg = readErr instanceof Error ? readErr.message : String(readErr);
      status.error = `Read failed: ${msg}`;

      if (msg.includes("does not exist") || msg.includes("P2021")) {
        status.errorType = "MISSING_TABLES";
        status.fixInstructions =
          "Database tables are missing. The build script runs 'prisma db push' automatically on deploy. Trigger a redeploy on Vercel to create tables.";
      } else if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
        // Prisma says "can't reach" but TCP test passed — this means the
        // real issue is NOT network. It's likely a Neon quota exceeded
        // error or authentication failure that Prisma is masking.
        status.errorType = "DB_REJECTED_CONNECTION";
        status.error = `Database server rejected the connection. TCP connection to ${dbHost}:${dbPort} succeeded, but Prisma cannot run queries. This usually means your Neon free-tier data transfer quota (1GB/month) has been exceeded, OR the database credentials are wrong.`;
        status.fixInstructions =
          "ACTION REQUIRED: Your Neon free-tier database has likely exceeded its 1GB/month data transfer quota. Fix: 1) Go to https://neon.tech and create a NEW project (fresh 1GB quota). 2) Copy the new connection string. 3) On Vercel, go to Project Settings → Environment Variables → update DATABASE_URL. 4) Redeploy — tables auto-create via 'prisma db push'.";
      } else if (msg.includes("quota") || msg.includes("53000")) {
        status.errorType = "QUOTA_EXCEEDED";
        status.error = `Neon data transfer quota exceeded: ${msg}`;
        status.fixInstructions =
          "Your Neon free-tier has exceeded its 1GB/month data transfer quota. Create a new Neon project to get a fresh quota, then update DATABASE_URL on Vercel and redeploy.";
      } else {
        status.errorType = "UNKNOWN_DB_ERROR";
        status.fixInstructions = `Unexpected database error: ${msg}`;
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
        const msg = writeErr instanceof Error ? writeErr.message : String(writeErr);
        status.error = `Write failed: ${msg}`;
        if (msg.includes("quota") || msg.includes("53000")) {
          status.errorType = "QUOTA_EXCEEDED";
          status.fixInstructions =
            "Your Neon free-tier has exceeded its 1GB/month data transfer quota. Create a new Neon project to get a fresh quota.";
        }
      }
    }

    status.ok = status.read && (isLocal || status.write);
  } catch (err) {
    status.ok = false;
    status.error = `Unexpected: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json(status, { status: status.ok ? 200 : 500 });
}
