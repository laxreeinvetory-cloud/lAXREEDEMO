import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";

// Simple password hashing (not bcrypt, but secure enough for admin panel)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Admin login.
 *
 * Auth strategy (in priority order):
 *  1. Database lookup — if the admin user exists in the DB, verify password there.
 *     This supports multiple admins created via the panel.
 *  2. Environment variable fallback — if the DB is empty/unavailable (which is
 *     the case on Vercel serverless where SQLite writes don't persist), fall
 *     back to ADMIN_USERNAME / ADMIN_PASSWORD env vars. This guarantees the
 *     owner can always log in even when the DB layer is ephemeral.
 *
 * The default credentials (admin / laxree2026) are used for the env-var
 * fallback when ADMIN_USERNAME / ADMIN_PASSWORD are not explicitly set.
 * On Vercel, set ADMIN_USERNAME and ADMIN_PASSWORD in Project Settings →
 * Environment Variables to override the defaults.
 */
const ENV_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "laxree2026";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Username and password required" },
        { status: 400 }
      );
    }

    // ── 1. Try the database first ──────────────────────────────
    // On Vercel serverless, the DB may be empty on every cold start
    // (SQLite writes don't persist). Wrap each DB call in try/catch so
    // a missing/corrupt DB never blocks the env-var fallback below.
    let dbAdmin: {
      username: string;
      password: string;
      name: string;
      role: string;
    } | null = null;

    try {
      dbAdmin = await db.adminUser.findFirst({
        where: { username },
        select: { username: true, password: true, name: true, role: true },
      });

      // If no admin users exist at all, seed the default (best-effort;
      // the write may be lost on Vercel, but the env-var fallback still
      // grants access).
      if (!dbAdmin) {
        const count = await db.adminUser.count().catch(() => 1);
        if (count === 0) {
          try {
            await db.adminUser.create({
              data: {
                username: "admin",
                password: hashPassword("laxree2026"),
                name: "LaxRee Admin",
                role: "superadmin",
              },
            });
          } catch {
            // Seeding failed (read-only FS on Vercel) — ignore; env-var
            // fallback below will still authenticate the owner.
          }
        }
      }
    } catch (dbErr) {
      // DB unavailable — log and continue to env-var fallback.
      console.error("[ADMIN LOGIN DB ERROR]", dbErr);
    }

    // ── 2. Authenticate ────────────────────────────────────────
    // (a) DB user found → verify against stored hash.
    if (dbAdmin) {
      if (dbAdmin.password === hashPassword(password)) {
        return NextResponse.json({
          ok: true,
          user: {
            username: dbAdmin.username,
            name: dbAdmin.name,
            role: dbAdmin.role,
          },
        });
      }
      // DB user exists but password is wrong → reject. Do NOT fall through
      // to env vars (that would let a wrong password succeed if it happened
      // to match the env password).
      return NextResponse.json(
        { ok: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // (b) No DB user — fall back to environment variables.
    if (username === ENV_ADMIN_USERNAME && password === ENV_ADMIN_PASSWORD) {
      return NextResponse.json({
        ok: true,
        user: {
          username: ENV_ADMIN_USERNAME,
          name: "LaxRee Admin",
          role: "superadmin",
        },
      });
    }

    return NextResponse.json(
      { ok: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (err) {
    console.error("[ADMIN LOGIN ERROR]", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
