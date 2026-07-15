import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Bell, Building2, Cpu, Database, FileText, Globe,
  Home, KeyRound, Layers, Lock, Mail, Plug, Server, Settings, ShieldCheck, Users, Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell, PageHeader, Panel, StatCard, StatusChip, type NavItem } from "@/components/dashboard-shell";

export const Route = createFileRoute("/super-admin")({
  component: SuperAdminDashboard,
});

const nav: NavItem[] = [
  { label: "Overview", key: "overview", icon: Home },
  { label: "Admins", key: "admins", icon: Users },
  { label: "Roles & Permissions", key: "roles", icon: ShieldCheck },
  { label: "System Health", key: "health", icon: Activity },
  { label: "Database", key: "db", icon: Database },
  { label: "APIs", key: "apis", icon: Plug },
  { label: "Integrations", key: "integ", icon: Layers },
  { label: "Payments", key: "pay", icon: KeyRound },
  { label: "Email & SMS", key: "comm", icon: Mail },
  { label: "Audit Logs", key: "logs", icon: FileText },
  { label: "Backups", key: "backups", icon: Server },
  { label: "Security", key: "security", icon: Lock },
  { label: "Settings", key: "settings", icon: Settings },
];

const traffic = [
  { t: "00", v: 42 }, { t: "04", v: 28 }, { t: "08", v: 88 }, { t: "12", v: 142 },
  { t: "16", v: 168 }, { t: "20", v: 124 }, { t: "24", v: 74 },
];
const latency = [
  { t: "Mon", v: 82 }, { t: "Tue", v: 74 }, { t: "Wed", v: 91 },
  { t: "Thu", v: 68 }, { t: "Fri", v: 72 }, { t: "Sat", v: 64 }, { t: "Sun", v: 70 },
];

function SuperAdminDashboard() {
  const [view, setView] = useState("overview");
  return (
    <DashboardShell
      role="super-admin"
      roleLabel="Platform control"
      userName="Ishaan Malhotra"
      userEmail="ishaan@cleanhaul.io"
      nav={nav}
      active={view}
      onNavigate={setView}
      accent="secondary"
    >
      {view === "overview" && <Overview />}
      {view === "admins" && <AdminsView />}
      {view === "health" && <HealthView />}
      {view === "integ" && <IntegrationsView />}
      {view === "security" && <SecurityView />}
      {!["overview", "admins", "health", "integ", "security"].includes(view) && <Placeholder view={view} />}
    </DashboardShell>
  );
}

function Overview() {
  return (
    <>
      <PageHeader
        title="Platform Overview"
        description="Everything CleanHaul, at a glance."
        actions={<StatusChip tone="success">All systems operational</StatusChip>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Companies" value="284" change="+12 this month" icon={Building2} tone="primary" />
        <StatCard label="Total Users" value="12,481" change="+284 wk" icon={Users} tone="secondary" />
        <StatCard label="Drivers" value="1,284" change="342 online" icon={ShieldCheck} tone="primary" />
        <StatCard label="Revenue (YTD)" value="₹2.4 Cr" change="+42% YoY" icon={BarChart3} tone="accent" />
        <StatCard label="API Calls (24h)" value="1.82 M" change="99.98% success" icon={Zap} tone="primary" />
        <StatCard label="Storage" value="1.42 TB" change="of 5 TB" icon={Database} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="API Traffic" description="Requests per hour" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic}>
                <defs>
                  <linearGradient id="api" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#api)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="System Health">
          {[
            { label: "API Gateway", value: "99.99%", tone: "success" as const, icon: Zap },
            { label: "PostgreSQL Primary", value: "Healthy", tone: "success" as const, icon: Database },
            { label: "Redis Cache", value: "62% mem", tone: "warning" as const, icon: Cpu },
            { label: "Object Storage", value: "Healthy", tone: "success" as const, icon: Server },
            { label: "Payment Gateway", value: "Degraded", tone: "warning" as const, icon: KeyRound },
            { label: "SMS Provider", value: "Healthy", tone: "success" as const, icon: Bell },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted"><s.icon className="h-4 w-4 text-muted-foreground" /></span>
                <span className="text-sm">{s.label}</span>
              </div>
              <StatusChip tone={s.tone}>{s.value}</StatusChip>
            </div>
          ))}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Response Latency" description="p95 · last 7 days">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latency}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="ms" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Recent Errors" actions={<button className="text-xs font-medium text-primary hover:underline">All errors</button>}>
          <div className="divide-y divide-border">
            {[
              { code: "500", msg: "payment_gateway_timeout", when: "2 min ago", svc: "billing" },
              { code: "429", msg: "rate_limited on /v1/otp", when: "18 min ago", svc: "otp" },
              { code: "404", msg: "driver_not_found", when: "42 min ago", svc: "match" },
              { code: "401", msg: "invalid_admin_token", when: "1 h ago", svc: "auth" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive"><AlertTriangle className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium"><span className="font-mono text-xs text-destructive">{e.code}</span> · {e.msg}</div>
                  <div className="text-xs text-muted-foreground">{e.svc} · {e.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function AdminsView() {
  return (
    <>
      <PageHeader title="Admins & Roles" description="Manage who can access the admin console." actions={<button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Invite admin</button>} />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Last active</th><th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Neha Kapoor", "neha@cleanhaul.io", "Ops Admin", "2 min ago", "Active", "success"],
                ["Rajat Verma", "rajat@cleanhaul.io", "Finance Admin", "1 h ago", "Active", "success"],
                ["Priya Menon", "priya@cleanhaul.io", "Support Admin", "3 h ago", "Active", "success"],
                ["Aakash Bose", "aakash@cleanhaul.io", "Read only", "Yesterday", "Idle", "warning"],
                ["Karan Rao", "karan@cleanhaul.io", "Ops Admin", "4 days ago", "Suspended", "destructive"],
              ].map(([n, e, r, l, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-medium">{n}</td>
                  <td className="py-3 text-muted-foreground">{e}</td>
                  <td className="py-3">{r}</td>
                  <td className="py-3 text-muted-foreground">{l}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function HealthView() {
  return (
    <>
      <PageHeader title="System Health" description="Real-time status across services." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Uptime (30d)" value="99.98%" icon={Activity} tone="primary" />
        <StatCard label="p95 latency" value="72 ms" icon={Zap} tone="secondary" />
        <StatCard label="CPU" value="34%" icon={Cpu} tone="primary" />
        <StatCard label="Errors (24h)" value="18" icon={AlertTriangle} tone="warning" />
      </div>
    </>
  );
}

function IntegrationsView() {
  const items = [
    { name: "Stripe", desc: "Payments · India", icon: KeyRound, status: "Connected", tone: "success" as const },
    { name: "Twilio", desc: "SMS · OTP", icon: Bell, status: "Connected", tone: "success" as const },
    { name: "SendGrid", desc: "Transactional email", icon: Mail, status: "Connected", tone: "success" as const },
    { name: "Google Maps", desc: "Routing & Places", icon: Globe, status: "Connected", tone: "success" as const },
    { name: "AWS S3", desc: "Photo verification storage", icon: Database, status: "Connected", tone: "success" as const },
    { name: "Slack", desc: "Ops alerts", icon: Bell, status: "Disconnected", tone: "muted" as const },
  ];
  return (
    <>
      <PageHeader title="Integrations" description="Third-party services powering CleanHaul." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.name} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><i.icon className="h-5 w-5" /></span>
              <StatusChip tone={i.tone}>{i.status}</StatusChip>
            </div>
            <div className="mt-4"><div className="font-semibold">{i.name}</div><div className="text-xs text-muted-foreground">{i.desc}</div></div>
            <button className="mt-5 w-full rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted">Configure</button>
          </div>
        ))}
      </div>
    </>
  );
}

function SecurityView() {
  return (
    <>
      <PageHeader title="Security" description="Access, keys and policies." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Policies">
          {["Enforce 2FA for admins", "IP allowlist for console", "Rotate API keys every 90 days", "Require signed webhooks"].map((p, i) => (
            <div key={p} className="flex items-center justify-between py-2.5">
              <span className="text-sm">{p}</span>
              <div className={`h-5 w-9 rounded-full ${i !== 2 ? "bg-primary" : "bg-muted"} relative`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition ${i !== 2 ? "left-4" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="API Keys">
          {[
            ["Production", "sk_live_•••8f21", "Ops"],
            ["Staging", "sk_test_•••4c02", "Eng"],
            ["Backups", "sk_live_•••11ba", "Infra"],
          ].map(([n, k, o]) => (
            <div key={n} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
              <div><div className="text-sm font-medium">{n}</div><div className="font-mono text-xs text-muted-foreground">{k}</div></div>
              <div className="text-xs text-muted-foreground">Owner · {o}</div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

function Placeholder({ view }: { view: string }) {
  const item = nav.find(n => n.key === view);
  return (
    <>
      <PageHeader title={item?.label || view} description="Module preview." />
      <Panel>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted"><Server className="h-5 w-5 text-muted-foreground" /></div>
          <div className="mt-4 text-sm font-medium">{item?.label} module</div>
          <div className="mt-1 text-xs text-muted-foreground">Same enterprise UI, wired up for the {item?.label.toLowerCase()} workflows.</div>
        </div>
      </Panel>
    </>
  );
}
