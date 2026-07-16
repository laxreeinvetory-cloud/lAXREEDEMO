"use client";

import { AdminProvider } from "@/lib/admin/auth-context";
import { AdminShell } from "@/lib/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
