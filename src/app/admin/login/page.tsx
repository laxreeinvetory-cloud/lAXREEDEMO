"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/auth-context";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await login(username, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/images/laxree-logo.png" alt="LaxRee" className="h-12 mx-auto" />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-sand">Admin Panel</p>
        </div>
        <div className="glass-on-charcoal rounded-[24px] p-8">
          <h1 className="font-display text-2xl text-ivory mb-2">Welcome Back</h1>
          <p className="font-body text-sm text-sand mb-6">Sign in to manage your website</p>
          {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="data-label mb-1.5 block text-[11px] text-sand">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/50" />
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="data-label mb-1.5 block text-[11px] text-sand">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/50" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand/50 hover:text-sand">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="pill pill-brass mt-2 w-full py-3.5 text-[14px] disabled:opacity-50">{loading ? "Signing in…" : "Sign In"}</button>
          </form>
          <div className="mt-6 rounded-xl border border-brass/20 bg-brass/5 p-4">
            <p className="font-mono text-[10px] text-brass uppercase tracking-wider mb-1">Default Login</p>
            <p className="font-body text-[12px] text-sand">Username: <span className="text-ivory font-mono">admin</span><br />Password: <span className="text-ivory font-mono">laxree2026</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
