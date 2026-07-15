import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, ShieldCheck, Truck, Building2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  component: Landing,
});

const roles = [
  {
    id: "customer",
    to: "/login" as const,
    role: "customer",
    name: "Customer",
    tagline: "Builders, contractors & industries",
    desc: "Raise pickup requests, track drivers live and manage invoices.",
    icon: Building2,
    accent: "bg-primary/10 text-primary",
  },
  {
    id: "driver",
    to: "/login" as const,
    role: "driver",
    name: "Driver",
    tagline: "Verified transport partners",
    desc: "Accept nearby jobs, navigate pickups and log earnings.",
    icon: Truck,
    accent: "bg-accent/15 text-accent",
  },
  {
    id: "admin",
    to: "/login" as const,
    role: "admin",
    name: "Admin",
    tagline: "Operations & fleet control",
    desc: "Approve drivers, monitor live trips and generate reports.",
    icon: HardHat,
    accent: "bg-secondary/30 text-foreground",
  },
  {
    id: "super",
    to: "/login" as const,
    role: "super-admin",
    name: "Super Admin",
    tagline: "Platform owner",
    desc: "System health, admins, integrations and audit logs.",
    icon: ShieldCheck,
    accent: "bg-foreground text-background",
  },
];

function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">C</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">CleanHaul</div>
            <div className="text-[11px] text-muted-foreground">Waste Management Platform</div>
          </div>
        </div>
        <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:pt-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Enterprise · Live preview
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Construction & demolition waste, <span className="text-primary">handled cleanly.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A modern operations platform connecting sites with verified transport drivers. Explore the dashboards below — every role has its own focused workspace.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <Link
              key={r.id}
              to={r.to}
              search={{ role: r.role }}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
            >
              <div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${r.accent}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div className="mt-5">
                  <div className="text-lg font-semibold tracking-tight">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.tagline}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary">
                Open dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 grid gap-6 border-t border-border pt-10 text-sm text-muted-foreground sm:grid-cols-3">
          <div><div className="text-xs uppercase tracking-wide">Cities</div><div className="mt-1 text-2xl font-semibold text-foreground">42</div></div>
          <div><div className="text-xs uppercase tracking-wide">Verified drivers</div><div className="mt-1 text-2xl font-semibold text-foreground">1,284</div></div>
          <div><div className="text-xs uppercase tracking-wide">Waste diverted</div><div className="mt-1 text-2xl font-semibold text-foreground">18.6k tons</div></div>
        </div>
      </section>
    </div>
  );
}
