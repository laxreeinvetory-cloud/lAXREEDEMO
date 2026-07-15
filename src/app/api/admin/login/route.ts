import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";

// Simple password hashing (not bcrypt, but secure enough for admin panel)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "Username and password required" }, { status: 400 });
    }

    // Check if any admin user exists, if not create default
    let admin = await db.adminUser.findFirst({
      where: { username },
    });

    // If no admin users exist, create default admin
    if (!admin) {
      const count = await db.adminUser.count();
      if (count === 0) {
        admin = await db.adminUser.create({
          data: {
            username: "admin",
            password: hashPassword("laxree2026"),
            name: "LaxRee Admin",
            role: "superadmin",
          },
        });
      }
    }

    if (!admin || admin.password !== hashPassword(password)) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("[ADMIN LOGIN ERROR]", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
