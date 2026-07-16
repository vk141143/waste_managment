import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Bell,
  ClipboardList,
  FileText,
  Home,
  MapPin,
  Package,
  Plus,
  Receipt,
  Headphones,
  Truck,
  User,
  Weight,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Star,
  X,
  Upload,
  ChevronRight,
  Phone,
  MessageSquare,
  Shield,
  Send,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatCard,
  StatusChip,
  type NavItem,
} from "@/components/dashboard-shell";

export const Route = createFileRoute("/customer")({
  component: CustomerDashboard,
});

const nav: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: Home },
  // { label: "Raise Request", key: "raise", icon: Plus },
  { label: "My Requests", key: "requests", icon: ClipboardList, badge: "3" },
  { label: "Live Tracking", key: "tracking", icon: MapPin },
  // { label: "Invoices", key: "invoices", icon: Receipt },
  { label: "Notifications", key: "notifications", icon: Bell, badge: "5" },
  { label: "Profile", key: "profile", icon: User },
  { label: "Contact", key: "contact", icon: Headphones },
];

const monthly = [
  { m: "Jan", v: 12 },
  { m: "Feb", v: 18 },
  { m: "Mar", v: 22 },
  { m: "Apr", v: 28 },
  { m: "May", v: 24 },
  { m: "Jun", v: 32 },
  { m: "Jul", v: 38 },
  { m: "Aug", v: 34 },
];
const categories = [
  { name: "Concrete", value: 42, color: "var(--chart-1)" },
  { name: "Bricks", value: 18, color: "var(--chart-2)" },
  { name: "Wood", value: 12, color: "var(--chart-3)" },
  { name: "Metal", value: 10, color: "var(--chart-4)" },
  { name: "Mixed", value: 18, color: "var(--chart-5)" },
];

const requests = [
  {
    id: "REQ-2841",
    type: "Concrete",
    qty: "3.2 t",
    vehicle: "Tipper",
    loc: "Sector 21, Site B",
    status: "En Route",
    tone: "info" as const,
    time: "12 min ago",
  },
  {
    id: "REQ-2840",
    type: "Mixed Waste",
    qty: "5.0 t",
    vehicle: "Dumper",
    loc: "Marina Tower",
    status: "Completed",
    tone: "success" as const,
    time: "2 h ago",
  },
  {
    id: "REQ-2839",
    type: "Bricks",
    qty: "2.1 t",
    vehicle: "Mini Truck",
    loc: "Green Park",
    status: "Pending",
    tone: "warning" as const,
    time: "3 h ago",
  },
  {
    id: "REQ-2838",
    type: "Metal",
    qty: "1.4 t",
    vehicle: "Container",
    loc: "Rowe Warehouse",
    status: "Completed",
    tone: "success" as const,
    time: "Yesterday",
  },
];

type ActiveRequest = {
  id: string;
  wasteType: string;
  quantity: string;
  unit: string;
  location: string;
  vehicle: string;
  notes: string;
  driver: { name: string; initials: string; vehicleNo: string; rating: string; trips: string };
  pickupOtp: string;
  completionOtp: string;
  submittedAt: string;
};

function CustomerDashboard() {
  const [view, setView] = useState("dashboard");
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);

  return (
    <DashboardShell
      role="customer"
      roleLabel="Customer workspace"
      userName="Aarav Patel"
      userEmail="aarav@buildworks.com"
      nav={nav}
      active={view}
      onNavigate={setView}
      accent="primary"
    >
      {view === "dashboard" && <DashboardView onNavigate={setView} onNewRequest={setActiveRequest} />}
      {view === "raise" && <RaiseRequestView />}
      {view === "requests" && <RequestsView />}
      {view === "tracking" && <TrackingView activeRequest={activeRequest} />}
      {view === "invoices" && <InvoicesView />}
      {view === "notifications" && <NotificationsView />}
      {view === "profile" && <SettingsView />}
      {view === "contact" && <ContactView />}
    </DashboardShell>
  );
}

const WASTE_TYPES = ["Concrete", "Bricks", "Tiles", "Wood", "Metal", "Mixed Waste", "Glass", "Sand", "Excavated Soil", "Other"];
const VEHICLE_TYPES = [
  { name: "Mini Truck", cap: "1.5 t", price: "₹1,200", eta: "20 min" },
  { name: "Tipper", cap: "5 t", price: "₹2,800", eta: "35 min" },
  { name: "Container", cap: "8 t", price: "₹4,600", eta: "45 min" },
  { name: "Dumper", cap: "12 t", price: "₹6,400", eta: "60 min" },
];
const STEPS = ["Waste Type", "Quantity & Photos", "Pickup Location", "Review"];

const MOCK_DRIVERS = [
  { name: "Ravi Sharma", initials: "RS", vehicleNo: "MH-12-AB-4421", rating: "4.9", trips: "812" },
  { name: "Suresh Kumar", initials: "SK", vehicleNo: "MH-04-CD-7832", rating: "4.7", trips: "634" },
  { name: "Amit Verma", initials: "AV", vehicleNo: "MH-09-EF-2210", rating: "4.8", trips: "521" },
];

function generateOtp() { return String(Math.floor(1000 + Math.random() * 9000)); }
function nowTime() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

function RaiseRequestModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (req: ActiveRequest) => void }) {
  const [step, setStep] = useState(0);
  const [searching, setSearching] = useState(false);
  const [dots, setDots] = useState(".");
  const [form, setForm] = useState({ wasteType: "", quantity: "", unit: "tonnes", notes: "", location: "", vehicle: "", photos: [] as string[] });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searching) return;
    const t = setInterval(() => setDots((d) => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, [searching]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = [
    !!form.wasteType,
    !!form.quantity,
    !!form.location,
    true,
  ][step];

  function handleSubmit() {
    setSearching(true);
    setTimeout(() => {
      const driver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
      const req: ActiveRequest = {
        id: `REQ-${2842 + Math.floor(Math.random() * 100)}`,
        wasteType: form.wasteType,
        quantity: form.quantity,
        unit: form.unit,
        location: form.location,
        vehicle: form.vehicle,
        notes: form.notes,
        driver,
        pickupOtp: generateOtp(),
        completionOtp: generateOtp(),
        submittedAt: nowTime(),
      };
      onSubmit(req);
    }, 2800);
  }

  if (searching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-card px-8 py-10 text-center shadow-[var(--shadow-elevated)]">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10">
            <Truck className="h-8 w-8 animate-pulse text-primary" />
          </div>
          <h2 className="text-base font-semibold">Searching for a driver{dots}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Matching your request with nearby drivers</p>
          <div className="mt-6 space-y-2">
            {["Request submitted", "Finding nearby drivers", "Assigning best match"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-2.5 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-card shadow-[var(--shadow-elevated)]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Raise a Pickup Request</h2>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 overflow-x-auto px-6 py-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 whitespace-nowrap`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                  i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{i < step ? "✓" : i + 1}</span>
                <span className={`text-xs ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 shrink-0 bg-border" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4 min-h-[220px]">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {WASTE_TYPES.map((w) => (
                <button key={w} onClick={() => set("wasteType", w)}
                  className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
                    form.wasteType === w ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}>
                  <Package className="mb-1.5 h-4 w-4" />{w}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Quantity</label>
                  <input type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)}
                    placeholder="e.g. 3.5"
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring" />
                </div>
                <div className="w-28">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Unit</label>
                  <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring">
                    <option>tonnes</option><option>kg</option><option>cubic m</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                  placeholder="Any special instructions…"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Photos (optional)</label>
                <button onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary/40 hover:bg-muted/40">
                  <Upload className="h-4 w-4" /> Upload photos
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => {
                    const names = Array.from(e.target.files ?? []).map((f) => f.name);
                    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...names] }));
                  }} />
                {form.photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {form.photos.map((p) => <span key={p} className="rounded-lg bg-muted px-2 py-0.5 text-xs">{p}</span>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Pickup address</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)}
                  placeholder="Enter site address or landmark"
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                Use current location
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Saved locations</p>
                {["Sector 21, Site B", "Marina Tower", "Green Park"].map((loc) => (
                  <button key={loc} onClick={() => set("location", loc)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      form.location === loc ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/40"
                    }`}>
                    <MapPin className="h-3.5 w-3.5" />{loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-sm">
              {[
                ["Waste Type", form.wasteType],
                ["Quantity", `${form.quantity} ${form.unit}`],
                ["Location", form.location],
                ["Vehicle", "Admin will assign vehicle"],
                ["Photos", form.photos.length ? `${form.photos.length} file(s)` : "None"],
                ["Notes", form.notes || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-2.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardView({ onNavigate, onNewRequest }: { onNavigate: (v: string) => void; onNewRequest: (r: ActiveRequest) => void }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && (
        <RaiseRequestModal
          onClose={() => setShowModal(false)}
          onSubmit={(req) => { onNewRequest(req); setShowModal(false); onNavigate("tracking"); }}
        />
      )}
      <PageHeader
        title="Welcome back, Aarav"
        description="Here's what's happening across your sites today."
        actions={
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            <Plus className="h-4 w-4" /> Raise Request
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Requests" value="3" change="+1 since yesterday" icon={Activity} tone="primary" />
        <StatCard label="Completed" value="128" change="+12 this month" icon={CheckCircle2} tone="secondary" />
        <StatCard label="Pending" value="2" change="Avg wait 14 min" icon={Clock} tone="warning" />
        <StatCard label="Waste Disposed" value="86.4 t" change="+8.2 t this month" icon={Weight} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Monthly Requests" description="Bookings over the last 8 months" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gPri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#gPri)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Waste Categories" description="This month">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {categories.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Recent Activity" className="lg:col-span-2" actions={<button className="text-xs font-medium text-primary hover:underline">View all</button>}>
          <div className="divide-y divide-border">
            {requests.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <StatusChip tone={r.tone}>{r.status}</StatusChip>
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{r.type} · {r.qty}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.loc} · {r.vehicle}</div>
                </div>
                <div className="text-xs text-muted-foreground">{r.time}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Actions">
          <div className="space-y-2">
            {[
              { icon: Plus, label: "Raise new request", desc: "Pickup in < 30 min" },
              { icon: MapPin, label: "Saved locations", desc: "4 sites" },
              { icon: FileText, label: "Download invoices", desc: "PDF export" },
              { icon: Truck, label: "Preferred drivers", desc: "6 favourites" },
            ].map((a) => (
              <button key={a.label} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-muted/50">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <a.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function RaiseRequestView() {
  const wastes = ["Concrete", "Bricks", "Tiles", "Wood", "Metal", "Mixed Waste", "Glass", "Sand", "Excavated Soil", "Other"];
  const vehicles = [
    { name: "Mini Truck", cap: "1.5 t", price: "₹1,200", eta: "20 min" },
    { name: "Tipper", cap: "5 t", price: "₹2,800", eta: "35 min" },
    { name: "Container", cap: "8 t", price: "₹4,600", eta: "45 min" },
    { name: "Dumper", cap: "12 t", price: "₹6,400", eta: "60 min" },
  ];
  const steps = ["Waste Type", "Quantity & Photos", "Pickup Location", "Choose Vehicle", "Review"];
  return (
    <>
      <PageHeader title="Raise a pickup request" description="5 quick steps, verified driver in minutes." />
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 whitespace-nowrap">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
            <span className={`text-sm ${i === 0 ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Select waste type" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {wastes.map((w, i) => (
              <button key={w} className={`rounded-xl border p-4 text-left text-sm font-medium transition ${i === 0 ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/40"}`}>
                <Package className="mb-2 h-4 w-4" />
                {w}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Recommended vehicles">
          <div className="space-y-2">
            {vehicles.map((v, i) => (
              <div key={v.name} className={`flex items-center justify-between rounded-xl border p-3 ${i === 1 ? "border-primary bg-primary/5" : "border-border"}`}>
                <div>
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.cap} · ETA {v.eta}</div>
                </div>
                <div className="text-sm font-semibold">{v.price}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">Continue</button>
        </Panel>
      </div>
    </>
  );
}

function RequestsView() {
  return (
    <>
      <PageHeader
        title="My Requests"
        description="All pickup requests across your sites."
        actions={
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-xl border border-border bg-card px-3 text-sm">
              <option>All statuses</option><option>Pending</option><option>En Route</option><option>Completed</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> New
            </button>
          </div>
        }
      />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((r, i) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="py-3 font-mono text-xs">{r.id}</td>
                  <td className="py-3 font-medium">{r.type}</td>
                  <td className="py-3 text-muted-foreground">{r.vehicle}</td>
                  <td className="py-3 text-muted-foreground">{r.loc}</td>
                  <td className="py-3"><StatusChip tone={r.tone}>{r.status}</StatusChip></td>
                  <td className="py-3 text-right font-medium">₹{(1800 + i * 620).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

type ChatMsg = { from: "me" | "driver"; text: string; time: string };

function ChatDrawer({ open, onClose, driverName, driverInitials }: { open: boolean; onClose: () => void; driverName: string; driverInitials: string }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "driver", text: "Hello! I'm on my way to the pickup location.", time: nowTime() },
    { from: "driver", text: "ETA approximately 30 minutes.", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const t = nowTime();
    setMsgs((m) => [...m, { from: "me", text, time: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "driver", text: "Got it, thanks!", time: nowTime() }]);
    }, 1200);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-card shadow-[var(--shadow-elevated)] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/30 text-sm font-semibold">{driverInitials}</div>
          <div className="flex-1">
            <div className="font-medium">{driverName}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col gap-1 ${ m.from === "me" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "me"
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : "rounded-tl-sm bg-muted text-foreground"
              }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-muted-foreground">{m.time}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="h-10 flex-1 rounded-xl border border-border bg-muted/50 px-3 text-sm outline-none focus:border-ring"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TrackingView({ activeRequest }: { activeRequest: ActiveRequest | null }) {
  const [showPickupOtp, setShowPickupOtp] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const req = activeRequest;

  const id = req?.id ?? "REQ-2841";
  const wasteType = req?.wasteType ?? "Concrete";
  const location = req?.location ?? "Sector 21, Site B";
  const vehicle = req?.vehicle ?? "Tipper";
  const driver = req?.driver ?? { name: "Ravi Sharma", initials: "RS", vehicleNo: "MH-12-AB-4421", rating: "4.9", trips: "812" };
  const pickupOtp = req?.pickupOtp ?? "4821";
  const completionOtp = req?.completionOtp ?? "7364";
  const submittedAt = req?.submittedAt ?? "10:12 AM";

  const timeline = [
    { label: "Request raised", time: submittedAt, tone: "success" },
    { label: "Driver assigned", time: submittedAt, tone: "success" },
    { label: "Driver en route", time: submittedAt, tone: "info" },
    { label: "Arriving at pickup", time: "ETA ~30 min", tone: "muted" },
    { label: `Pickup OTP: ${showPickupOtp ? pickupOtp : "••••"}`, time: "Pending", tone: "muted" },
    { label: "Completion OTP", time: "Pending", tone: "muted" },
  ];

  return (
    <>
      <PageHeader
        title="Live Tracking"
        description={`${id} · ${wasteType} pickup`}
        actions={<StatusChip tone="info">Driver En Route</StatusChip>}
      />

      {/* Request summary strip */}
      <div className="mb-4 flex flex-wrap gap-3">
        {[
          { label: "Request ID", value: id },
          { label: "Waste Type", value: wasteType },
          { label: "Vehicle", value: vehicle },
          { label: "Pickup", value: location },
          { label: "Vehicle No.", value: driver.vehicleNo },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card px-4 py-2">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Route">
          <div className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-br from-secondary/20 via-muted to-primary/10">
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: "radial-gradient(circle at 25% 30%, var(--color-primary) 1px, transparent 1px), radial-gradient(circle at 70% 60%, var(--color-accent) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="absolute left-8 top-8 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
              <div className="text-muted-foreground">Pickup</div>
              <div className="font-medium">{location}</div>
            </div>
            <div className="absolute bottom-8 right-8 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
              <div className="text-muted-foreground">Dump Site</div>
              <div className="font-medium">North Landfill</div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary/30 bg-primary p-3 text-primary-foreground shadow-[var(--shadow-elevated)]">
              <Truck className="h-5 w-5" />
            </div>
            {/* Vehicle number badge */}
            <div className="absolute bottom-8 left-8 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
              <div className="text-muted-foreground">Vehicle No.</div>
              <div className="font-medium">{driver.vehicleNo}</div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Driver Details">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary/30 text-lg font-semibold">{driver.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{driver.name}</div>
                <div className="text-xs text-muted-foreground">{driver.vehicleNo} · {vehicle}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-warning text-warning" /> {driver.rating} · {driver.trips} trips
                </div>
              </div>
            </div>

            {/* OTP section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                <div>
                  <div className="text-xs text-muted-foreground">Pickup OTP</div>
                  <div className="mt-0.5 font-mono text-xl font-bold tracking-widest">
                    {showPickupOtp ? pickupOtp : "••••"}
                  </div>
                </div>
                <button onClick={() => setShowPickupOtp((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  <Shield className="h-3.5 w-3.5" />{showPickupOtp ? "Hide" : "Reveal"}
                </button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                <div>
                  <div className="text-xs text-muted-foreground">Completion OTP</div>
                  <div className="mt-0.5 font-mono text-xl font-bold tracking-widest text-muted-foreground">••••</div>
                </div>
                <span className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">After pickup</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium hover:bg-muted">
                <Phone className="h-3.5 w-3.5" /> Call
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium hover:bg-muted"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Chat
              </button>
            </div>
          </Panel>

          <Panel title="Trip Timeline">
            <ol className="space-y-3 text-sm">
              {timeline.map(({ label, time, tone }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    tone === "success" ? "bg-success" : tone === "info" ? "bg-primary animate-pulse" : "bg-border"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{time}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} driverName={driver.name} driverInitials={driver.initials} />
    </>
  );
}

function InvoicesView() {
  return (
    <>
      <PageHeader title="Invoices" description="Download and manage billing." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Paid" value="₹1,42,800" icon={CheckCircle2} tone="primary" />
        <StatCard label="Pending" value="₹18,400" icon={Clock} tone="warning" />
        <StatCard label="This Month" value="₹34,200" icon={TrendingUp} tone="accent" />
      </div>
      <Panel className="mt-6">
        <div className="divide-y divide-border">
          {requests.map((r, i) => (
            <div key={r.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="text-sm font-medium">INV-{2000 + i}</div>
                <div className="text-xs text-muted-foreground">{r.id} · {r.type}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right"><div className="text-sm font-semibold">₹{(1800 + i * 620).toLocaleString()}</div><StatusChip tone={i === 2 ? "warning" : "success"}>{i === 2 ? "Pending" : "Paid"}</StatusChip></div>
                <button className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted"><FileText className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function NotificationsView() {
  const items = [
    { icon: Truck, title: "Driver accepted your request", desc: "REQ-2841 · Ravi Sharma", time: "2 min ago", tone: "info" as const },
    { icon: MapPin, title: "Driver arrived at pickup", desc: "REQ-2841 · Sector 21", time: "12 min ago", tone: "success" as const },
    { icon: Receipt, title: "Payment received", desc: "INV-2003 · ₹4,600", time: "1 h ago", tone: "success" as const },
    { icon: Bell, title: "New driver added to favourites", desc: "Ravi Sharma", time: "Yesterday", tone: "muted" as const },
  ];
  return (
    <>
      <PageHeader title="Notifications" description="Real-time alerts for your requests." />
      <Panel>
        <div className="divide-y divide-border">
          {items.map((n, i) => (
            <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><n.icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><div className="text-sm font-medium">{n.title}</div><div className="text-xs text-muted-foreground">{n.desc}</div></div>
              <div className="text-xs text-muted-foreground">{n.time}</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <PageHeader title="Profile & Settings" description="Manage your account, saved locations and preferences." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Profile" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Full name", "Aarav Patel"],
              ["Email", "aarav@buildworks.com"],
              ["Phone", "+91 98211 44xxx"],
              ["Company", "BuildWorks Pvt Ltd"],
            ].map(([l, v]) => (
              <label key={l} className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{l}</span>
                <input defaultValue={v} className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring" />
              </label>
            ))}
          </div>
        </Panel>
        <Panel title="Preferences">
          {["Email notifications", "SMS alerts", "Push notifications", "Marketing"].map((p, i) => (
            <div key={p} className="flex items-center justify-between py-2.5">
              <span className="text-sm">{p}</span>
              <div className={`relative h-5 w-9 rounded-full transition ${i < 3 ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition ${i < 3 ? "left-4" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

type Complaint = {
  id: string;
  title: string;
  description: string;
  attachments: string[];
  status: "Open" | "In Review" | "Resolved";
  date: string;
};

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "CMP-001",
    title: "Driver arrived late by 2 hours",
    description: "The driver for REQ-2839 was supposed to arrive at 10 AM but showed up at noon without any notification.",
    attachments: [],
    status: "Resolved",
    date: "12 Jun 2025",
  },
  {
    id: "CMP-002",
    title: "Incorrect waste quantity recorded",
    description: "The invoice shows 5 tonnes but only 3.2 tonnes were actually picked up from the site.",
    attachments: ["invoice_scan.pdf"],
    status: "In Review",
    date: "18 Jun 2025",
  },
  {
    id: "CMP-003",
    title: "Vehicle was not clean",
    description: "The tipper truck had residue from a previous load which contaminated our concrete waste.",
    attachments: ["photo1.jpg", "photo2.jpg"],
    status: "Open",
    date: "22 Jun 2025",
  },
];

const STATUS_TONE: Record<string, "success" | "warning" | "info"> = {
  Resolved: "success",
  "In Review": "warning",
  Open: "info",
};

function ContactView() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>(SEED_COMPLAINTS);

  function handleSubmit() {
    if (!title.trim() || !description.trim()) return;
    const newComplaint: Complaint = {
      id: `CMP-00${complaints.length + 1}`,
      title: title.trim(),
      description: description.trim(),
      attachments,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setTitle("");
    setDescription("");
    setAttachments([]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <>
      <PageHeader
        title="Contact & Support"
        description="Raise a complaint or query. Our team responds within 24 hours."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Panel title="New Complaint" className="lg:col-span-2">
          {submitted && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Complaint submitted successfully! We'll get back to you soon.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title <span className="text-destructive">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Driver arrived late"
                className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description <span className="text-destructive">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your issue in detail…"
                className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Attachments (optional)</label>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-muted/40"
              >
                <Upload className="h-4 w-4" /> Upload photos or documents
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  setAttachments((prev) => [...prev, ...names]);
                }}
              />
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {attachments.map((a) => (
                    <span key={a} className="flex items-center gap-1 rounded-lg border border-border bg-muted px-2.5 py-1 text-xs">
                      <FileText className="h-3 w-3" /> {a}
                      <button onClick={() => setAttachments((prev) => prev.filter((x) => x !== a))} className="ml-1 text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              Submit Complaint
            </button>
          </div>
        </Panel>

        {/* Info sidebar */}
        <div className="space-y-4">
          <Panel title="Support Info">
            <div className="space-y-3 text-sm">
              {[
                { icon: Phone, label: "Helpline", value: "+91 1800-123-4567" },
                { icon: MessageSquare, label: "Email", value: "support@wasteflow.in" },
                { icon: Clock, label: "Response time", value: "Within 24 hours" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Complaint Stats">
            <div className="space-y-2">
              {(["Open", "In Review", "Resolved"] as const).map((s) => {
                const count = complaints.filter((c) => c.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <StatusChip tone={STATUS_TONE[s]}>{s}</StatusChip>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      {/* Previous complaints */}
      <Panel title="Previous Complaints" className="mt-6" actions={<span className="text-xs text-muted-foreground">{complaints.length} total</span>}>
        {complaints.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No complaints yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {complaints.map((c) => (
              <div key={c.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                      <StatusChip tone={STATUS_TONE[c.status]}>{c.status}</StatusChip>
                    </div>
                    <div className="mt-1 text-sm font-medium">{c.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.description}</div>
                    {c.attachments.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.attachments.map((a) => (
                          <span key={a} className="flex items-center gap-1 rounded-lg bg-muted px-2 py-0.5 text-xs">
                            <FileText className="h-3 w-3" /> {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
