import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, BarChart3, Bell, CheckCircle2, ClipboardList, FileText, Home, LifeBuoy,
  MapPin, Package, Settings, ShieldCheck, Truck, Users, Wallet, XCircle, Search, IndianRupee, Send, X, Star,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell, PageHeader, Panel, StatCard, StatusChip, type NavItem } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

const nav: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: Home },
  { label: "Users", key: "users", icon: Users },
  { label: "Drivers", key: "drivers", icon: Truck, badge: "8" },
  { label: "Requests", key: "requests", icon: ClipboardList },
  { label: "Vehicles", key: "vehicles", icon: Package },
  { label: "Waste Categories", key: "waste", icon: Package },
  { label: "Dump Sites", key: "dumps", icon: MapPin },
  { label: "Analytics", key: "analytics", icon: BarChart3 },
  { label: "Payments", key: "payments", icon: Wallet },
  { label: "Reports", key: "reports", icon: FileText },
  { label: "Logs", key: "logs", icon: Activity },
  { label: "Support", key: "support", icon: LifeBuoy },
  { label: "Settings", key: "settings", icon: Settings },
];

const revenue = [
  { m: "Jan", r: 128000, b: 240 }, { m: "Feb", r: 152000, b: 288 }, { m: "Mar", r: 174000, b: 312 },
  { m: "Apr", r: 198000, b: 360 }, { m: "May", r: 221000, b: 402 }, { m: "Jun", r: 246000, b: 448 },
  { m: "Jul", r: 284000, b: 512 }, { m: "Aug", r: 312000, b: 564 },
];

const pendingDrivers = [
  { name: "Vikram Singh", vehicle: "MH-14-CD-8821 · Tipper", city: "Pune", submitted: "2 h ago" },
  { name: "Suresh Kumar", vehicle: "DL-08-AB-1140 · Dumper", city: "Delhi", submitted: "5 h ago" },
  { name: "Manoj Verma", vehicle: "KA-05-EF-4501 · Container", city: "Bengaluru", submitted: "Yesterday" },
  { name: "Ashok Reddy", vehicle: "TS-09-GH-7702 · Mini Truck", city: "Hyderabad", submitted: "Yesterday" },
];

const liveTrips = [
  { id: "REQ-2841", customer: "BuildWorks", driver: "R. Sharma", stage: "En Route", tone: "info" as const, city: "Mumbai" },
  { id: "REQ-2842", customer: "TataCon", driver: "P. Naidu", stage: "Loading", tone: "warning" as const, city: "Chennai" },
  { id: "REQ-2843", customer: "Godrej Sites", driver: "K. Meena", stage: "Heading to Dump", tone: "info" as const, city: "Pune" },
  { id: "REQ-2844", customer: "L&T", driver: "S. Iyer", stage: "Arriving", tone: "success" as const, city: "Bengaluru" },
  { id: "REQ-2845", customer: "Prestige", driver: "A. Khan", stage: "Pickup OTP", tone: "warning" as const, city: "Hyderabad" },
];

function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  return (
    <DashboardShell
      role="admin"
      roleLabel="Admin console"
      userName="Neha Kapoor"
      userEmail="neha@cleanhaul.io"
      nav={nav}
      active={view}
      onNavigate={setView}
      accent="primary"
    >
      {view === "dashboard" && <AdminHome />}
      {view === "users" && <UsersView />}
      {view === "drivers" && <DriversView />}
      {view === "requests" && <RequestsView />}
      {view === "vehicles" && <VehiclesView />}
      {view === "waste" && <WasteCategoriesView />}
      {view === "dumps" && <DumpSitesView />}
      {view === "analytics" && <AnalyticsView />}
      {view === "payments" && <PaymentsView />}
      {view === "reports" && <ReportsView />}
      {view === "logs" && <LogsView />}
      {view === "support" && <SupportView />}
      {view === "settings" && <SettingsView />}
      {!["dashboard", "users", "drivers", "requests", "vehicles", "waste", "dumps", "analytics", "payments", "reports", "logs", "support", "settings"].includes(view) && <Generic view={view} />}
    </DashboardShell>
  );
}

function AdminHome() {
  return (
    <>
      <PageHeader
        title="Operations Overview"
        description="Live view across all cities and fleets."
        actions={
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm"><option>Last 30 days</option><option>This week</option><option>Today</option></select>
            <button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Export</button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Users" value="12,481" change="+284 this wk" icon={Users} tone="primary" />
        <StatCard label="Drivers Online" value="342" change="of 1,284 total" icon={Truck} tone="secondary" />
        <StatCard label="Pending Drivers" value="8" change="Awaiting review" icon={ShieldCheck} tone="warning" />
        <StatCard label="Today's Requests" value="486" change="+12% DoD" icon={ClipboardList} tone="accent" />
        <StatCard label="Completed" value="9,214" change="98.1% success" icon={CheckCircle2} tone="primary" />
        <StatCard label="Revenue (MTD)" value="₹31.2 L" change="+18% MoM" icon={IndianRupee} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Revenue & Bookings" description="Monthly performance" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="r" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Live Fleet" description="Active drivers on map">
          <div className="relative h-72 overflow-hidden rounded-xl bg-gradient-to-br from-secondary/20 via-muted to-primary/10">
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, var(--color-primary) 1px, transparent 1px), radial-gradient(circle at 60% 70%, var(--color-accent) 1px, transparent 1px), radial-gradient(circle at 80% 20%, var(--chart-4) 1px, transparent 1px)",
              backgroundSize: "40px 40px, 50px 50px, 30px 30px",
            }} />
            {[[20, 30, "var(--primary)"], [60, 55, "var(--accent)"], [40, 70, "var(--secondary)"], [80, 25, "var(--primary)"], [55, 20, "var(--accent)"]].map(([x, y, c], i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <div className="h-3 w-3 rounded-full ring-4" style={{ background: c as string, boxShadow: `0 0 0 4px color-mix(in oklab, ${c} 20%, transparent)` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Active now</span>
            <span className="font-semibold text-foreground">342 drivers</span>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Pending Driver Approvals" actions={<button className="text-xs font-medium text-primary hover:underline">Review all</button>}>
          <div className="divide-y divide-border">
            {pendingDrivers.map((d) => (
              <div key={d.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-xs font-semibold">{d.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.vehicle} · {d.city}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10"><XCircle className="h-4 w-4" /></button>
                  <button className="rounded-lg bg-primary p-1.5 text-primary-foreground hover:opacity-90"><CheckCircle2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Live Trips" actions={<StatusChip tone="success">142 active</StatusChip>}>
          <div className="divide-y divide-border">
            {liveTrips.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><span className="font-mono text-xs text-muted-foreground">{t.id}</span><StatusChip tone={t.tone}>{t.stage}</StatusChip></div>
                  <div className="mt-1 truncate text-sm">{t.customer} · <span className="text-muted-foreground">{t.driver}</span></div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{t.city}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function UsersView() {
  return (
    <>
      <PageHeader title="Users" description="Manage customer accounts and subscriptions." actions={
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search users…" className="h-9 rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring" /></div>
          <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm"><option>All</option><option>Active</option><option>Inactive</option></select>
        </div>
      } />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value="12,481" icon={Users} tone="primary" />
        <StatCard label="Active" value="9,842" icon={CheckCircle2} tone="success" />
        <StatCard label="Inactive" value="2,639" icon={XCircle} tone="warning" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">City</th><th className="pb-3">Requests</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Aarav Patel", "aarav.patel@buildworks.com", "Mumbai", 24, "Active", "success"],
                ["Meera Nair", "meera.nair@greenpark.com", "Bengaluru", 18, "Active", "success"],
                ["Rohan Desai", "rohan.desai@marinacorp.com", "Chennai", 12, "Inactive", "warning"],
                ["Priya Singh", "priya.singh@rowehouse.com", "Delhi", 31, "Active", "success"],
                ["Karan Mehta", "karan.mehta@sunrise.com", "Pune", 8, "Active", "success"],
              ].map(([n, e, c, r, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-medium">{n}</td>
                  <td className="py-3 text-muted-foreground text-xs">{e}</td>
                  <td className="py-3 text-muted-foreground">{c}</td>
                  <td className="py-3">{r}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function DriversView() {
  return (
    <>
      <PageHeader title="Drivers" description="Verify, suspend, and manage the driver network." actions={
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search drivers…" className="h-9 rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring" /></div>
          <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm"><option>All statuses</option><option>Verified</option><option>Pending</option><option>Suspended</option></select>
        </div>
      } />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Driver</th><th className="pb-3">Vehicle</th><th className="pb-3">City</th><th className="pb-3">Trips</th><th className="pb-3">Rating</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Ravi Sharma", "MH-12-AB-4421 · Tipper", "Mumbai", 812, 4.9, "Verified", "success"],
                ["Priya Naidu", "TN-11-XY-9081 · Container", "Chennai", 604, 4.8, "Verified", "success"],
                ["Vikram Singh", "MH-14-CD-8821 · Tipper", "Pune", 0, 0, "Pending", "warning"],
                ["Suresh Kumar", "DL-08-AB-1140 · Dumper", "Delhi", 0, 0, "Pending", "warning"],
                ["Karan Meena", "MH-04-JK-2214 · Mini Truck", "Pune", 421, 4.7, "Verified", "success"],
                ["Ashwin Iyer", "KA-01-LM-4520 · Container", "Bengaluru", 302, 4.6, "Suspended", "destructive"],
              ].map(([n, v, c, t, r, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-medium">{n}</td>
                  <td className="py-3 text-muted-foreground">{v}</td>
                  <td className="py-3 text-muted-foreground">{c}</td>
                  <td className="py-3">{t}</td>
                  <td className="py-3">{r ? `★ ${r}` : "—"}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function VehiclesView() {
  return (
    <>
      <PageHeader title="Vehicles" description="Manage registered vehicles and fleet." actions={
        <button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">+ Add Vehicle</button>
      } />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Vehicles" value="284" icon={Truck} tone="primary" />
        <StatCard label="Active" value="242" icon={CheckCircle2} tone="success" />
        <StatCard label="Maintenance" value="28" icon={Activity} tone="warning" />
        <StatCard label="Inactive" value="14" icon={XCircle} tone="destructive" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Registration</th><th className="pb-3">Type</th><th className="pb-3">Driver</th><th className="pb-3">Capacity</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["MH-12-AB-4421", "Tipper", "Ravi Sharma", "8 t", "Active", "success"],
                ["TN-11-XY-9081", "Container", "Priya Naidu", "10 t", "Active", "success"],
                ["MH-14-CD-8821", "Tipper", "Vikram Singh", "8 t", "Maintenance", "warning"],
                ["DL-08-AB-1140", "Dumper", "Suresh Kumar", "6 t", "Active", "success"],
                ["KA-01-LM-4520", "Container", "Ashwin Iyer", "12 t", "Inactive", "destructive"],
              ].map(([r, t, d, c, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-mono text-xs font-medium">{r}</td>
                  <td className="py-3">{t}</td>
                  <td className="py-3 text-muted-foreground">{d}</td>
                  <td className="py-3">{c}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function WasteCategoriesView() {
  return (
    <>
      <PageHeader title="Waste Categories" description="Configure waste types and pricing." actions={
        <button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">+ Add Category</button>
      } />
      <Panel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Concrete", rate: "₹280/t", active: true },
            { name: "Bricks", rate: "₹220/t", active: true },
            { name: "Mixed Waste", rate: "₹320/t", active: true },
            { name: "Metal Scrap", rate: "₹450/t", active: true },
            { name: "Wood", rate: "₹180/t", active: false },
            { name: "Plastic", rate: "₹150/t", active: true },
          ].map((cat) => (
            <div key={cat.name} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{cat.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{cat.rate}</div>
                </div>
                <StatusChip tone={cat.active ? "success" : "warning"}>{cat.active ? "Active" : "Inactive"}</StatusChip>
              </div>
              <button className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-medium hover:bg-muted">Edit</button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function DumpSitesView() {
  return (
    <>
      <PageHeader title="Dump Sites" description="Manage waste disposal locations." actions={
        <button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">+ Add Site</button>
      } />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Sites" value="18" icon={MapPin} tone="primary" />
        <StatCard label="Active" value="16" icon={CheckCircle2} tone="success" />
        <StatCard label="Maintenance" value="2" icon={Activity} tone="warning" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Site Name</th><th className="pb-3">City</th><th className="pb-3">Capacity</th><th className="pb-3">Utilization</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Mumbai Central", "Mumbai", "500 t/day", "78%", "Active", "success"],
                ["Bengaluru East", "Bengaluru", "350 t/day", "62%", "Active", "success"],
                ["Delhi North", "Delhi", "400 t/day", "85%", "Active", "success"],
                ["Pune West", "Pune", "250 t/day", "45%", "Maintenance", "warning"],
                ["Chennai South", "Chennai", "300 t/day", "71%", "Active", "success"],
              ].map(([n, c, cap, util, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-medium">{n}</td>
                  <td className="py-3 text-muted-foreground">{c}</td>
                  <td className="py-3">{cap}</td>
                  <td className="py-3">{util}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

const ALL_TRANSPORTERS = [
  { id: "T1", name: "Ravi Sharma",  reg: "MH-12-AB-4421", type: "Tipper",     cap: "8 t",  city: "Mumbai",    rating: 4.9, trips: 812, status: "Available" },
  { id: "T2", name: "Priya Naidu",  reg: "TN-11-XY-9081", type: "Container",  cap: "10 t", city: "Chennai",   rating: 4.8, trips: 604, status: "Available" },
  { id: "T3", name: "Suresh Kumar", reg: "DL-08-AB-1140", type: "Dumper",     cap: "6 t",  city: "Delhi",     rating: 4.7, trips: 390, status: "Busy" },
  { id: "T4", name: "Karan Meena",  reg: "MH-04-JK-2214", type: "Mini Truck", cap: "3 t",  city: "Pune",      rating: 4.7, trips: 421, status: "Available" },
  { id: "T5", name: "Ashwin Iyer",  reg: "KA-01-LM-4520", type: "Container",  cap: "12 t", city: "Bengaluru", rating: 4.6, trips: 302, status: "Available" },
  { id: "T6", name: "Divya Rao",    reg: "TS-09-GH-7702", type: "Mini Truck", cap: "3 t",  city: "Hyderabad", rating: 4.5, trips: 218, status: "Busy" },
];

type Transporter = typeof ALL_TRANSPORTERS[0];

function TransporterPickerModal({ onClose, onSelect }: { onClose: () => void; onSelect: (t: Transporter) => void }) {
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const cities = ["All", ...Array.from(new Set(ALL_TRANSPORTERS.map((t) => t.city)))];
  const types  = ["All", ...Array.from(new Set(ALL_TRANSPORTERS.map((t) => t.type)))];

  const filtered = ALL_TRANSPORTERS.filter((t) =>
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.reg.toLowerCase().includes(search.toLowerCase())) &&
    (filterCity   === "All" || t.city   === filterCity) &&
    (filterType   === "All" || t.type   === filterType) &&
    (filterStatus === "All" || t.status === filterStatus)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-card shadow-[var(--shadow-elevated)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Choose Transporter</h2>
            <p className="text-xs text-muted-foreground">Select a verified transporter for this request</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-6 py-3">
          <div className="relative min-w-[180px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or vehicle no…"
              className="h-8 w-full rounded-lg border border-border bg-muted/50 pl-8 pr-3 text-xs outline-none focus:border-ring" />
          </div>
          <select value={filterCity}   onChange={(e) => setFilterCity(e.target.value)}   className="h-8 rounded-lg border border-border bg-card px-2 text-xs outline-none">{cities.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={filterType}   onChange={(e) => setFilterType(e.target.value)}   className="h-8 rounded-lg border border-border bg-card px-2 text-xs outline-none">{types.map((t)  => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg border border-border bg-card px-2 text-xs outline-none">{["All","Available","Busy"].map((s) => <option key={s}>{s}</option>)}</select>
        </div>

        <div className="max-h-[380px] overflow-y-auto px-6 py-3">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No transporters match your filters.</div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-muted/40">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <StatusChip tone={t.status === "Available" ? "success" : "warning"}>{t.status}</StatusChip>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{t.reg} · {t.type} · {t.cap} · {t.city}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{t.rating}</span>
                      <span className="text-muted-foreground">· {t.trips} trips</span>
                    </div>
                  </div>
                  <button onClick={() => onSelect(t)} disabled={t.status === "Busy"}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type AdminRequest = { id: string; customer: string; driver: string; type: string; amount: string; stage: string; tone: "info" | "warning" | "success" | "destructive"; city: string; assignedVehicle: string };

function RequestsView() {
  const [reqs, setReqs] = useState<AdminRequest[]>([
    { id: "REQ-2841", customer: "BuildWorks",  driver: "",         type: "Concrete", amount: "₹2,400", stage: "Pending",        tone: "warning",     city: "Mumbai",    assignedVehicle: "" },
    { id: "REQ-2842", customer: "TataCon",     driver: "P. Naidu", type: "Bricks",   amount: "₹3,040", stage: "En Route",       tone: "info",        city: "Chennai",   assignedVehicle: "TN-11-XY-9081" },
    { id: "REQ-2843", customer: "Godrej Sites",driver: "K. Meena", type: "Mixed",    amount: "₹4,600", stage: "Heading to Dump",tone: "info",        city: "Pune",      assignedVehicle: "MH-04-JK-2214" },
    { id: "REQ-2844", customer: "L&T",         driver: "S. Iyer",  type: "Metal",    amount: "₹3,520", stage: "Completed",      tone: "success",     city: "Bengaluru", assignedVehicle: "DL-08-AB-1140" },
    { id: "REQ-2845", customer: "Prestige",    driver: "",         type: "Concrete", amount: "₹2,720", stage: "Pending",        tone: "warning",     city: "Hyderabad", assignedVehicle: "" },
    { id: "REQ-2846", customer: "Shapoorji",   driver: "",         type: "Wood",     amount: "₹1,800", stage: "Pending",        tone: "warning",     city: "Mumbai",    assignedVehicle: "" },
  ]);
  const [pickerForId, setPickerForId] = useState<string | null>(null);

  function handleAssign(t: Transporter) {
    if (!pickerForId) return;
    setReqs((prev) => prev.map((r) => r.id === pickerForId ? { ...r, driver: t.name, assignedVehicle: t.reg } : r));
    setPickerForId(null);
  }

  function sendToTransporter(id: string) {
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, stage: "Sent to Transporter", tone: "info" } : r));
  }

  return (
    <>
      {pickerForId && <TransporterPickerModal onClose={() => setPickerForId(null)} onSelect={handleAssign} />}
      <PageHeader title="Requests" description="Approve requests and assign transporters." />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Today" value="486" icon={ClipboardList} tone="primary" />
        <StatCard label="Pending" value={String(reqs.filter(r => r.stage === "Pending").length)} icon={Activity} tone="warning" />
        <StatCard label="In Progress" value={String(reqs.filter(r => ["En Route","Heading to Dump","Sent to Transporter"].includes(r.stage)).length)} icon={Truck} tone="accent" />
        <StatCard label="Completed" value={String(reqs.filter(r => r.stage === "Completed").length)} icon={CheckCircle2} tone="secondary" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">City</th>
                <th className="pb-3">Transporter</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reqs.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="py-3 font-mono text-xs">{r.id}</td>
                  <td className="py-3 font-medium">{r.customer}</td>
                  <td className="py-3 text-muted-foreground">{r.type}</td>
                  <td className="py-3 text-muted-foreground">{r.city}</td>
                  <td className="py-3">
                    {r.stage === "Pending" ? (
                      <button onClick={() => setPickerForId(r.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted ${
                          r.assignedVehicle ? "border-success/40 bg-success/10 text-success" : "border-border"
                        }`}>
                        <Truck className="h-3 w-3" />
                        {r.assignedVehicle ? `${r.driver} · ${r.assignedVehicle}` : "Choose Transporter"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">{r.driver || "—"}</span>
                    )}
                  </td>
                  <td className="py-3"><StatusChip tone={r.tone}>{r.stage}</StatusChip></td>
                  <td className="py-3 text-right">
                    {r.stage === "Pending" ? (
                      <button onClick={() => r.assignedVehicle && sendToTransporter(r.id)} disabled={!r.assignedVehicle}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">
                        <Send className="h-3 w-3" /> Send
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function PaymentsView() {
  return (
    <>
      <PageHeader title="Payments" description="Track transactions and payouts." actions={
        <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm"><option>All</option><option>Completed</option><option>Pending</option><option>Failed</option></select>
      } />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Revenue" value="₹31.2 L" icon={IndianRupee} tone="primary" />
        <StatCard label="Pending" value="₹2.4 L" icon={Activity} tone="warning" />
        <StatCard label="Completed" value="₹28.8 L" icon={CheckCircle2} tone="success" />
        <StatCard label="Failed" value="₹0.2 L" icon={XCircle} tone="destructive" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Invoice</th><th className="pb-3">Customer</th><th className="pb-3">Amount</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["INV-2841", "BuildWorks", "₹2,800", "Today", "Completed", "success"],
                ["INV-2842", "TataCon", "₹1,900", "Today", "Completed", "success"],
                ["INV-2843", "Godrej Sites", "₹4,600", "Yesterday", "Pending", "warning"],
                ["INV-2844", "L&T", "₹3,200", "Yesterday", "Completed", "success"],
                ["INV-2845", "Prestige", "₹2,100", "2 days ago", "Failed", "destructive"],
              ].map(([inv, cust, amt, date, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-mono text-xs font-medium">{inv}</td>
                  <td className="py-3 font-medium">{cust}</td>
                  <td className="py-3 font-semibold">{amt}</td>
                  <td className="py-3 text-muted-foreground">{date}</td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function ReportsView() {
  return (
    <>
      <PageHeader title="Reports" description="Generate and download business reports." actions={
        <button className="rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">+ Generate Report</button>
      } />
      <Panel>
        <div className="space-y-3">
          {[
            { name: "Monthly Revenue Report", date: "Aug 2024", size: "2.4 MB", status: "Ready" },
            { name: "Driver Performance Analysis", date: "Aug 2024", size: "1.8 MB", status: "Ready" },
            { name: "Customer Satisfaction Survey", date: "Jul 2024", size: "0.9 MB", status: "Ready" },
            { name: "Fleet Utilization Report", date: "Jul 2024", size: "3.2 MB", status: "Ready" },
            { name: "Waste Category Breakdown", date: "Jun 2024", size: "1.5 MB", status: "Archived" },
          ].map((report) => (
            <div key={report.name} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/40">
              <div>
                <div className="font-medium">{report.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{report.date} · {report.size}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusChip tone={report.status === "Ready" ? "success" : "info"}>{report.status}</StatusChip>
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Download</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function SupportView() {
  return (
    <>
      <PageHeader title="Support" description="Manage customer support tickets." actions={
        <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm"><option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option></select>
      } />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Tickets" value="284" icon={LifeBuoy} tone="primary" />
        <StatCard label="Open" value="42" icon={Activity} tone="warning" />
        <StatCard label="In Progress" value="18" icon={Activity} tone="info" />
        <StatCard label="Resolved" value="224" icon={CheckCircle2} tone="success" />
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Ticket ID</th><th className="pb-3">Customer</th><th className="pb-3">Subject</th><th className="pb-3">Priority</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["TKT-1001", "Aarav Patel", "Payment not received", "High", "Open", "destructive"],
                ["TKT-1002", "Meera Nair", "Driver delay issue", "Medium", "In Progress", "warning"],
                ["TKT-1003", "Rohan Desai", "App crash on login", "High", "In Progress", "destructive"],
                ["TKT-1004", "Priya Singh", "Invoice discrepancy", "Low", "Resolved", "success"],
                ["TKT-1005", "Karan Mehta", "Feature request", "Low", "Open", "info"],
              ].map(([id, cust, subj, pri, s, tone], i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="py-3 font-mono text-xs font-medium">{id}</td>
                  <td className="py-3 font-medium">{cust}</td>
                  <td className="py-3 text-muted-foreground">{subj}</td>
                  <td className="py-3"><StatusChip tone={pri === "High" ? "destructive" : pri === "Medium" ? "warning" : "info"}>{pri}</StatusChip></td>
                  <td className="py-3"><StatusChip tone={tone as any}>{s as string}</StatusChip></td>
                  <td className="py-3 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <PageHeader title="Settings" description="Configure system-wide settings and preferences." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="General Settings">
          <div className="space-y-4">
            {[
              { label: "Platform Name", value: "CleanHaul" },
              { label: "Support Email", value: "support@cleanhaul.io" },
              { label: "Commission Rate", value: "12%" },
              { label: "Min Order Value", value: "₹500" },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="text-sm font-medium">{setting.label}</div>
                  <div className="text-xs text-muted-foreground">{setting.value}</div>
                </div>
                <button className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">Edit</button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Feature Flags">
          <div className="space-y-3">
            {[
              { name: "Real-time Tracking", enabled: true },
              { name: "Driver Ratings", enabled: true },
              { name: "Scheduled Pickups", enabled: false },
              { name: "Subscription Plans", enabled: true },
            ].map((flag) => (
              <div key={flag.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium">{flag.name}</span>
                <button className={`relative h-6 w-11 rounded-full transition-colors ${
                  flag.enabled ? "bg-success" : "bg-muted-foreground/30"
                }`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    flag.enabled ? "left-6" : "left-0.5"
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function AnalyticsView() {
  return (
    <>
      <PageHeader title="Analytics" description="Revenue, cities, categories and driver performance." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Bookings by month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="b" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Top cities">
          <div className="space-y-3">
            {[["Mumbai", 92, 4820], ["Bengaluru", 76, 3960], ["Delhi", 68, 3610], ["Pune", 54, 2810], ["Hyderabad", 42, 2140]].map(([c, pct, amt]) => (
              <div key={c as string}>
                <div className="mb-1 flex items-center justify-between text-sm"><span className="font-medium">{c}</span><span className="text-muted-foreground">₹{(amt as number).toLocaleString()}k</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function LogsView() {
  const events = [
    { who: "neha@cleanhaul.io", action: "Approved driver", target: "Ravi Sharma", ip: "103.28.44.12", loc: "Mumbai", when: "2 min ago" },
    { who: "system", action: "Payment captured", target: "INV-2003", ip: "—", loc: "—", when: "8 min ago" },
    { who: "raj@cleanhaul.io", action: "Cancelled request", target: "REQ-2839", ip: "45.112.9.4", loc: "Delhi", when: "1 h ago" },
    { who: "neha@cleanhaul.io", action: "Updated pricing", target: "Tipper (5 t)", ip: "103.28.44.12", loc: "Mumbai", when: "3 h ago" },
    { who: "system", action: "Driver logged in", target: "P. Naidu", ip: "182.19.66.20", loc: "Chennai", when: "5 h ago" },
  ];
  return (
    <>
      <PageHeader title="Audit Logs" description="Every action, timestamped." actions={<button className="rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted">Download CSV</button>} />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Who</th><th className="pb-3">Action</th><th className="pb-3">Target</th><th className="pb-3">IP</th><th className="pb-3">Location</th><th className="pb-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((e, i) => (
                <tr key={i}>
                  <td className="py-3 font-medium">{e.who}</td>
                  <td className="py-3">{e.action}</td>
                  <td className="py-3 text-muted-foreground">{e.target}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{e.ip}</td>
                  <td className="py-3 text-muted-foreground">{e.loc}</td>
                  <td className="py-3 text-muted-foreground">{e.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Generic({ view }: { view: string }) {
  const items = nav.find(n => n.key === view);
  return (
    <>
      <PageHeader title={items?.label || view} description="Module preview." />
      <Panel>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted"><Bell className="h-5 w-5 text-muted-foreground" /></div>
          <div className="mt-4 text-sm font-medium">Full {items?.label.toLowerCase()} module</div>
          <div className="mt-1 text-xs text-muted-foreground">Wired up with the same design system.</div>
        </div>
      </Panel>
    </>
  );
}
