import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, HardHat, ShieldCheck, Truck, Eye, EyeOff, LocateFixed } from "lucide-react";

type Role = "customer" | "driver" | "admin" | "super-admin";

const roleConfig: Record<Role, { label: string; icon: React.ElementType; accent: string; dashboard: string }> = {
  customer: { label: "Customer", icon: Building2, accent: "bg-primary/10 text-primary", dashboard: "/customer" },
  driver: { label: "Driver", icon: Truck, accent: "bg-accent/15 text-accent", dashboard: "/driver" },
  admin: { label: "Admin", icon: HardHat, accent: "bg-secondary/30 text-foreground", dashboard: "/admin" },
  "super-admin": { label: "Super Admin", icon: ShieldCheck, accent: "bg-foreground text-background", dashboard: "/super-admin" },
};

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({ role: (s.role as Role) || "customer" }),
  component: RegisterPage,
});

function RegisterPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const cfg = roleConfig[role] ?? roleConfig.customer;
  const Icon = cfg.icon;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [error, setError] = useState("");

  function useCurrentLocation() {
    if (!navigator.geolocation) { setLocError("Geolocation not supported by your browser."); return; }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setLocating(false); },
      () => { setLocError("Unable to retrieve location. Please allow access."); setLocating(false); }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (role === "customer" && !mobile) { setError("Please enter your mobile number."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    // After registration go straight to dashboard
    navigate({ to: cfg.dashboard as any });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link to="/login" search={{ role }} className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>

        {/* Role badge */}
        <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${cfg.accent}`}>
          <Icon className="h-4 w-4" />
          {cfg.label} Portal
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register to access your {cfg.label.toLowerCase()} dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
            />
          </label>

          {role === "customer" && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Mobile number</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
              />
            </label>
          )}

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

          {role === "customer" && (
            <div className="space-y-2">
              <span className="block text-xs font-medium text-muted-foreground">Location</span>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
              >
                <LocateFixed className="h-4 w-4 text-primary" />
                {locating ? "Detecting…" : "Use current location"}
              </button>
              {locError && <p className="text-xs text-destructive">{locError}</p>}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Latitude</span>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g. 12.971599"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Longitude</span>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g. 77.594566"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
                  />
                </label>
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="h-11 w-full rounded-xl border border-border bg-card px-3 pr-10 text-sm outline-none focus:border-ring"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button type="submit" className="mt-2 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" search={{ role }} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
