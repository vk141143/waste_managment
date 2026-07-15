import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Navigation,
  Phone,
  Settings,
  Star,
  Truck,
  User,
  Wallet,
  ArrowUpRight,
  Route as RouteIcon,
  IndianRupee,
  MessageSquare,
  Send,
  X,
  Shield,
  Power,
  BadgeCheck,
  Car,
  FileText,
  Edit2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell, PageHeader, Panel, StatCard, StatusChip, type NavItem } from "@/components/dashboard-shell";

export const Route = createFileRoute("/driver")({
  component: DriverDashboard,
});

const nav: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: Home },
  { label: "Nearby Jobs", key: "nearby", icon: MapPin, badge: "4" },
  { label: "Accepted Jobs", key: "accepted", icon: Truck },
  // { label: "Navigation", key: "nav", icon: Navigation },
  { label: "Trip History", key: "history", icon: RouteIcon },
  { label: "Wallet", key: "wallet", icon: Wallet },
  { label: "Notifications", key: "notifs", icon: Bell },
  { label: "Profile", key: "profile", icon: User },
  // { label: "Settings", key: "settings", icon: Settings },
];

const historyData = [
  { id: "REQ-2840", type: "Concrete", qty: "3.2 t", pickup: "Sector 21, Site B", customer: "Aarav Patel", pay: "₹2,800", date: "Today, 09:14 AM", duration: "42 min", rating: 5, status: "completed" },
  { id: "REQ-2835", type: "Bricks", qty: "2.1 t", pickup: "Green Park Ph 2", customer: "Meera Nair", pay: "₹1,900", date: "Today, 07:30 AM", duration: "35 min", rating: 4, status: "completed" },
  { id: "REQ-2821", type: "Mixed", qty: "5.0 t", pickup: "Marina Tower", customer: "Rohan Desai", pay: "₹4,600", date: "Yesterday, 04:10 PM", duration: "58 min", rating: 5, status: "completed" },
  { id: "REQ-2810", type: "Metal", qty: "1.4 t", pickup: "Rowe Warehouse", customer: "Priya Singh", pay: "₹2,200", date: "Yesterday, 01:22 PM", duration: "29 min", rating: 4, status: "completed" },
  { id: "REQ-2798", type: "Concrete", qty: "4.0 t", pickup: "Sunrise Colony", customer: "Karan Mehta", pay: "₹3,500", date: "22 Jul, 11:00 AM", duration: "50 min", rating: 5, status: "completed" },
  { id: "REQ-2785", type: "Wood", qty: "0.8 t", pickup: "Old Town Market", customer: "Divya Rao", pay: "₹900", date: "22 Jul, 08:45 AM", duration: "22 min", rating: 3, status: "cancelled" },
  { id: "REQ-2770", type: "Mixed", qty: "2.6 t", pickup: "Tech Park Gate 4", customer: "Suresh Kumar", pay: "₹2,400", date: "21 Jul, 03:30 PM", duration: "44 min", rating: 5, status: "completed" },
];

const earnings = [
  { d: "Mon", v: 2400 }, { d: "Tue", v: 3200 }, { d: "Wed", v: 2800 },
  { d: "Thu", v: 4100 }, { d: "Fri", v: 3600 }, { d: "Sat", v: 5200 }, { d: "Sun", v: 3800 },
];

const jobs = [
  { id: "REQ-2851", type: "Concrete · 3.2 t", pickup: "Sector 21, Site B", dist: "2.4 km", pay: "₹2,800", eta: "12 min" },
  { id: "REQ-2852", type: "Bricks · 2.1 t", pickup: "Green Park Ph 2", dist: "4.1 km", pay: "₹1,900", eta: "18 min" },
  { id: "REQ-2853", type: "Mixed · 5.0 t", pickup: "Marina Tower", dist: "6.8 km", pay: "₹4,600", eta: "26 min" },
  { id: "REQ-2854", type: "Metal · 1.4 t", pickup: "Rowe Warehouse", dist: "8.2 km", pay: "₹2,200", eta: "31 min" },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type ChatMsg = { from: "me" | "customer"; text: string; time: string };

function ChatDrawer({
  open,
  onClose,
  customerName,
  customerInitials,
}: {
  open: boolean;
  onClose: () => void;
  customerName: string;
  customerInitials: string;
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "customer", text: "Hi, I'm at the site. Please come to Gate 2.", time: nowTime() },
    { from: "customer", text: "The waste is already segregated and ready.", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "me", text, time: nowTime() }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "customer", text: "Got it, on my way!", time: nowTime() }]);
    }, 1200);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-card shadow-[var(--shadow-elevated)] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
            {customerInitials}
          </div>
          <div className="flex-1">
            <div className="font-medium">{customerName}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col gap-1 ${m.from === "me" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "me"
                    ? "rounded-tr-sm bg-accent text-accent-foreground"
                    : "rounded-tl-sm bg-muted text-foreground"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-muted-foreground">{m.time}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

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
              className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DriverDashboard() {
  const [view, setView] = useState("dashboard");
  const [online, setOnline] = useState(false);

  return (
    <DashboardShell
      role="driver"
      roleLabel="Driver workspace"
      userName="Ravi Sharma"
      userEmail="ravi.sharma@cleanhaul.io"
      nav={nav}
      active={view}
      onNavigate={setView}
      accent="accent"
    >
      {view === "dashboard" && <DriverHome online={online} setOnline={setOnline} />}
      {view === "nearby" && <NearbyJobs online={online} />}
      {view === "accepted" && <AcceptedJob />}
      {view === "wallet" && <WalletView />}
      {view === "history" && <TripHistory />}
      {view === "profile" && <DriverProfile online={online} setOnline={setOnline} />}
      {view !== "dashboard" && view !== "nearby" && view !== "accepted" && view !== "wallet" && view !== "history" && view !== "profile" && <Placeholder view={view} />}
    </DashboardShell>
  );
}

function GoOnlineToggle({ online, setOnline }: { online: boolean; setOnline: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setOnline(!online)}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        online
          ? "bg-success/20 text-success ring-1 ring-inset ring-success/40 hover:bg-success/30"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      <Power className={`h-4 w-4 ${online ? "text-success" : ""}`} />
      {online ? "Go Offline" : "Go Online"}
    </button>
  );
}

function DriverHome({ online, setOnline }: { online: boolean; setOnline: (v: boolean) => void }) {
  return (
    <>
      <PageHeader
        title="Good morning, Ravi"
        description={online ? "4 jobs available within 10 km." : "You are offline. Go online to receive job requests."}
        actions={<GoOnlineToggle online={online} setOnline={setOnline} />}
      />

      {!online && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4">
          <Power className="h-5 w-5 shrink-0 text-warning" />
          <div>
            <div className="text-sm font-semibold text-warning">You're currently offline</div>
            <div className="text-xs text-muted-foreground">Toggle "Go Online" to start receiving job requests from customers.</div>
          </div>
          <button
            onClick={() => setOnline(true)}
            className="ml-auto rounded-xl bg-warning/20 px-4 py-2 text-xs font-semibold text-warning hover:bg-warning/30"
          >
            Go Online
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Earnings" value="₹4,280" change="+12% vs yesterday" icon={IndianRupee} tone="primary" />
        <StatCard label="Today's Trips" value="6" change="2 in progress" icon={Truck} tone="secondary" />
        <StatCard label="Pending Jobs" value={online ? "4" : "0"} change={online ? "Within 10 km" : "Go online to see jobs"} icon={Clock} tone="warning" />
        <StatCard label="Rating" value="4.9" change="812 trips" icon={Star} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Weekly Earnings" description="Payouts by day" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Nearby Jobs" actions={<button className="text-xs font-medium text-primary hover:underline">See all</button>}>
          {online ? (
            <div className="space-y-3">
              {jobs.slice(0, 3).map((j) => (
                <div key={j.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{j.id}</div>
                      <div className="text-sm font-medium">{j.type}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">{j.pay}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {j.pickup} · {j.dist}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Power className="h-8 w-8 text-muted-foreground/40" />
              <div className="mt-2 text-xs text-muted-foreground">Go online to see nearby jobs</div>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

function NearbyJobs({ online }: { online: boolean }) {
  return (
    <>
      <PageHeader title="Nearby jobs" description={online ? "Accept or reject in one tap." : "Go online to see available jobs."} />
      {!online ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
          <Power className="h-10 w-10 text-muted-foreground/30" />
          <div className="mt-3 text-sm font-medium">You're offline</div>
          <div className="mt-1 text-xs text-muted-foreground">Switch to online mode from the dashboard to receive job requests.</div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{j.id}</div>
                  <div className="mt-1 text-lg font-semibold">{j.type}</div>
                </div>
                <StatusChip tone="info">{j.eta} ETA</StatusChip>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Distance</div><div className="font-medium">{j.dist}</div></div>
                <div><div className="text-xs text-muted-foreground">Pay</div><div className="font-medium">{j.pay}</div></div>
                <div><div className="text-xs text-muted-foreground">Vehicle</div><div className="font-medium">Tipper</div></div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {j.pickup}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted">Reject</button>
                <button className="rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">Accept</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AcceptedJob() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showCompletionOtp, setShowCompletionOtp] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const PICKUP_OTP = "4821";
  const COMPLETION_OTP = "7364";

  const customer = {
    name: "Aarav Patel",
    initials: "AP",
    company: "BuildWorks Pvt Ltd",
    phone: "+91 98211 44xxx",
    reqId: "REQ-2841",
    wasteType: "Concrete",
    quantity: "3.2 t",
    pickup: "Sector 21, Site B",
    vehicle: "Tipper",
  };

  function handleOtpInput(val: string, idx: number) {
    const digits = [...otpDigits];
    digits[idx] = val.slice(-1);
    setOtpDigits(digits);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
  }

  function verifyOtp() {
    if (otpDigits.join("") === PICKUP_OTP) setOtpVerified(true);
  }

  return (
    <>
      <PageHeader
        title="Current Job"
        description={`${customer.reqId} · In progress`}
        actions={<StatusChip tone="info">Heading to pickup</StatusChip>}
      />

      {/* Job summary strip */}
      <div className="mb-4 flex flex-wrap gap-3">
        {[
          { label: "Request ID", value: customer.reqId },
          { label: "Waste Type", value: customer.wasteType },
          { label: "Quantity", value: customer.quantity },
          { label: "Pickup", value: customer.pickup },
          { label: "Vehicle", value: customer.vehicle },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card px-4 py-2">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Route to pickup">
          <div className="relative h-80 overflow-hidden rounded-xl bg-gradient-to-br from-accent/20 via-muted to-primary/10">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, var(--color-primary) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute left-8 top-8 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
              <div className="text-muted-foreground">Pickup</div>
              <div className="font-medium">{customer.pickup}</div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent p-3 text-accent-foreground shadow-[var(--shadow-elevated)]">
              <Navigation className="h-5 w-5" />
            </div>
          </div>
          <button className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            Open in Maps
          </button>
        </Panel>

        <div className="space-y-4">
          {/* Customer details */}
          <Panel title="Customer">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
                {customer.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{customer.name}</div>
                <div className="text-xs text-muted-foreground">{customer.company}</div>
                <div className="text-xs text-muted-foreground">{customer.phone}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium hover:bg-muted">
                <Phone className="h-3.5 w-3.5" /> Call
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium hover:bg-muted"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Chat
              </button>
            </div>
          </Panel>

          {/* Pickup OTP */}
          <Panel title="Pickup OTP">
            {otpVerified ? (
              <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> OTP verified successfully!
              </div>
            ) : (
              <>
                <div className="mb-3 text-xs text-muted-foreground">Ask customer for the 4-digit OTP.</div>
                <div className="flex gap-2">
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      value={d}
                      maxLength={1}
                      onChange={(e) => handleOtpInput(e.target.value, i)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !d && i > 0) inputRefs.current[i - 1]?.focus();
                      }}
                      className="h-12 w-12 rounded-xl border border-border bg-card text-center text-lg font-semibold outline-none focus:border-ring"
                    />
                  ))}
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={otpDigits.join("").length < 4}
                  className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  Verify OTP
                </button>
              </>
            )}
          </Panel>

          {/* Completion OTP */}
          <Panel title="Completion OTP">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
              <div>
                <div className="text-xs text-muted-foreground">Share after dump</div>
                <div className="mt-0.5 font-mono text-xl font-bold tracking-widest">
                  {showCompletionOtp ? COMPLETION_OTP : "••••"}
                </div>
              </div>
              <button
                onClick={() => setShowCompletionOtp((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Shield className="h-3.5 w-3.5" />
                {showCompletionOtp ? "Hide" : "Reveal"}
              </button>
            </div>
          </Panel>

          {/* Photo Verification */}
          <Panel title="Photo Verification">
            {["Before pickup", "Loaded vehicle", "Dump site"].map((p, i) => (
              <button
                key={p}
                className="mb-2 flex w-full items-center gap-3 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary/50 hover:bg-muted/40"
              >
                <Camera className="h-4 w-4" /> {p}
                {i === 0 && <StatusChip tone="success">Uploaded</StatusChip>}
              </button>
            ))}
          </Panel>
        </div>
      </div>

      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        customerName={customer.name}
        customerInitials={customer.initials}
      />
    </>
  );
}

function TripHistory() {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");
  const filtered = filter === "all" ? historyData : historyData.filter((h) => h.status === filter);
  const totalEarnings = historyData.filter((h) => h.status === "completed").reduce((sum, h) => sum + parseInt(h.pay.replace(/[^0-9]/g, "")), 0);
  const avgRating = (historyData.filter((h) => h.status === "completed").reduce((s, h) => s + h.rating, 0) / historyData.filter((h) => h.status === "completed").length).toFixed(1);

  return (
    <>
      <PageHeader title="Trip History" description="All your accepted and completed jobs." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Trips" value={String(historyData.filter((h) => h.status === "completed").length)} icon={Truck} tone="primary" />
        <StatCard label="Total Earned" value={`₹${totalEarnings.toLocaleString()}`} icon={IndianRupee} tone="secondary" />
        <StatCard label="Avg Rating" value={avgRating} icon={Star} tone="accent" />
      </div>

      <Panel title="Job Records">
        <div className="mb-4 flex gap-2">
          {(["all", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((job) => (
            <div key={job.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{job.id}</span>
                    <StatusChip tone={job.status === "completed" ? "success" : "error"}>
                      {job.status}
                    </StatusChip>
                  </div>
                  <div className="mt-1 text-sm font-semibold">{job.type} · {job.qty}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {job.pickup}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-primary">{job.pay}</div>
                  <div className="text-xs text-muted-foreground">{job.duration}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3" /> {job.customer}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < job.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">{job.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function DriverProfile({ online, setOnline }: { online: boolean; setOnline: (v: boolean) => void }) {
  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your personal and vehicle details."
        actions={<GoOnlineToggle online={online} setOnline={setOnline} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — avatar + status */}
        <div className="space-y-4">
          <Panel>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary/15 text-2xl font-bold text-primary">RS</div>
                <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                  online ? "bg-success" : "bg-muted-foreground"
                }`} />
              </div>
              <div className="mt-3 text-base font-semibold">Ravi Sharma</div>
              <div className="text-xs text-muted-foreground">ravi.sharma@cleanhaul.io</div>
              <StatusChip tone={online ? "success" : "warning"} className="mt-2">
                {online ? "Online" : "Offline"}
              </StatusChip>
            </div>

            <div className="mt-2 grid grid-cols-3 divide-x divide-border border-t border-border text-center">
              {[{ label: "Trips", value: "812" }, { label: "Rating", value: "4.9" }, { label: "Exp", value: "3 yrs" }].map((s) => (
                <div key={s.label} className="py-3">
                  <div className="text-sm font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Go Online toggle card */}
          <Panel>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Availability</div>
                <div className="text-xs text-muted-foreground">{online ? "Receiving job requests" : "Not receiving requests"}</div>
              </div>
              <button
                onClick={() => setOnline(!online)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  online ? "bg-success" : "bg-muted-foreground/30"
                }`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  online ? "left-6" : "left-1"
                }`} />
              </button>
            </div>
          </Panel>
        </div>

        {/* Right — details */}
        <div className="space-y-4 lg:col-span-2">
          <Panel
            title="Personal Details"
            actions={
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", value: "Ravi Sharma", icon: User },
                { label: "Phone", value: "+91 98210 55xxx", icon: Phone },
                { label: "Email", value: "ravi.sharma@cleanhaul.io", icon: FileText },
                { label: "City", value: "Mumbai, Maharashtra", icon: MapPin },
                { label: "Driver ID", value: "DRV-00412", icon: BadgeCheck },
                { label: "Joined", value: "March 2022", icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Vehicle Details"
            actions={
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Vehicle Type", value: "Tipper Truck", icon: Truck },
                { label: "Registration No.", value: "MH 04 AB 1234", icon: Car },
                { label: "Model", value: "Tata LPT 1613", icon: Car },
                { label: "Capacity", value: "8 Tonnes", icon: BadgeCheck },
                { label: "Fuel Type", value: "Diesel", icon: FileText },
                { label: "Insurance Expiry", value: "Dec 2025", icon: Shield },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
              <BadgeCheck className="h-4 w-4 shrink-0 text-success" />
              <div className="text-xs text-success">Vehicle verified and approved by CleanHaul admin.</div>
            </div>
          </Panel>

          {/* Documents */}
          <Panel title="Documents">
            <div className="space-y-2">
              {[
                { name: "Driving Licence", status: "verified" },
                { name: "Vehicle RC", status: "verified" },
                { name: "Insurance Certificate", status: "verified" },
                { name: "Pollution Certificate", status: "pending" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-muted-foreground" /> {doc.name}
                  </div>
                  <StatusChip tone={doc.status === "verified" ? "success" : "warning"}>
                    {doc.status}
                  </StatusChip>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function WalletView() {
  return (
    <>
      <PageHeader title="Wallet & Earnings" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available Balance" value="₹18,240" icon={Wallet} tone="primary" />
        <StatCard label="This Week" value="₹24,100" change="+₹4,280 today" icon={IndianRupee} tone="secondary" />
        <StatCard label="Total Trips" value="812" icon={Truck} tone="accent" />
      </div>
      <Panel className="mt-6" title="Payout trend">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="v" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}

function Placeholder({ view }: { view: string }) {
  return (
    <>
      <PageHeader title={view.charAt(0).toUpperCase() + view.slice(1)} description="Coming soon." />
      <Panel>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted"><ArrowUpRight className="h-5 w-5 text-muted-foreground" /></div>
          <div className="mt-4 text-sm font-medium">This screen is a placeholder</div>
          <div className="mt-1 text-xs text-muted-foreground">Full flow available in the linked sub-modules.</div>
        </div>
      </Panel>
    </>
  );
}

// unused stubs kept for shape
void CheckCircle2;
