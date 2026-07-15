import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; key: string; icon: LucideIcon; badge?: string };

export interface DashboardShellProps {
  role: string;
  roleLabel: string;
  userName: string;
  userEmail: string;
  nav: NavItem[];
  active: string;
  onNavigate: (key: string) => void;
  children: ReactNode;
  accent?: "primary" | "accent" | "secondary";
}

export function DashboardShell({ roleLabel, userName, userEmail, nav, active, onNavigate, children, accent = "primary" }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  useRouterState({ select: (s) => s.location.pathname });

  const accentBg =
    accent === "accent" ? "bg-accent text-accent-foreground" :
    accent === "secondary" ? "bg-secondary text-secondary-foreground" :
    "bg-primary text-primary-foreground";

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className={cn("grid h-9 w-9 place-items-center rounded-xl font-bold", accentBg)}>C</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">CleanHaul</div>
              <div className="text-[11px] text-muted-foreground">{roleLabel}</div>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 pb-4">
          {nav.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); setOpen(false); }}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4", isActive && "text-primary")} strokeWidth={2} />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-semibold", accentBg)}>
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-medium">{userName}</div>
              <div className="truncate text-xs text-muted-foreground">{userEmail}</div>
            </div>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-background"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label, value, change, icon: Icon, tone = "primary",
}: {
  label: string; value: string; change?: string; icon: LucideIcon;
  tone?: "primary" | "accent" | "secondary" | "warning" | "destructive";
}) {
  const toneClass =
    tone === "accent" ? "bg-accent/10 text-accent" :
    tone === "secondary" ? "bg-secondary/20 text-secondary-foreground" :
    tone === "warning" ? "bg-warning/15 text-warning-foreground" :
    tone === "destructive" ? "bg-destructive/10 text-destructive" :
    "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", toneClass)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {change && <div className="mt-1 text-xs text-muted-foreground">{change}</div>}
    </div>
  );
}

export function Panel({ title, description, actions, children, className }: { title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h3 className="truncate text-sm font-semibold">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatusChip({ children, tone = "muted" }: { children: ReactNode; tone?: "success" | "warning" | "muted" | "accent" | "destructive" | "info" }) {
  const cls =
    tone === "success" ? "bg-success/15 text-success-foreground ring-success/30" :
    tone === "warning" ? "bg-warning/20 text-warning-foreground ring-warning/30" :
    tone === "accent" ? "bg-accent/15 text-accent ring-accent/30" :
    tone === "destructive" ? "bg-destructive/10 text-destructive ring-destructive/30" :
    tone === "info" ? "bg-primary/10 text-primary ring-primary/30" :
    "bg-muted text-muted-foreground ring-border";
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", cls)}>{children}</span>;
}
