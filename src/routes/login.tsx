import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, HardHat, ShieldCheck, Truck, Eye, EyeOff } from "lucide-react";

type Role = "customer" | "driver" | "admin" | "super-admin";

const roleConfig: Record<Role, { label: string; icon: React.ElementType; accent: string; dashboard: string }> = {
  customer: { label: "Customer", icon: Building2, accent: "bg-primary/10 text-primary", dashboard: "/customer" },
  driver: { label: "Driver", icon: Truck, accent: "bg-accent/15 text-accent", dashboard: "/driver" },
  admin: { label: "Admin", icon: HardHat, accent: "bg-secondary/30 text-foreground", dashboard: "/admin" },
  "super-admin": { label: "Super Admin", icon: ShieldCheck, accent: "bg-foreground text-background", dashboard: "/super-admin" },
};

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ role: (s.role as Role) || "customer" }),
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const cfg = roleConfig[role] ?? roleConfig.customer;
  const Icon = cfg.icon;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    // Navigate to the role's dashboard
    navigate({ to: cfg.dashboard as any });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>

        {/* Role badge */}
        <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${cfg.accent}`}>
          <Icon className="h-4 w-4" />
          {cfg.label} Portal
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back. Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-card px-3 pr-10 text-sm outline-none focus:border-ring"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button type="submit" className="mt-2 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" search={{ role }} className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
