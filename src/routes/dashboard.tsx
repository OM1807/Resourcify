import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { IndiaMap } from "@/components/india-map";
import { IncidentCard } from "@/components/incident-card";
import { VolunteerCard } from "@/components/volunteer-card";
import { CountUp } from "@/components/count-up";
import { AssignDialog } from "@/components/assign-dialog";
import { kpis, priorityStyles, type Incident } from "@/lib/mock-data";
import { useAppStore, rankVolunteersForIncident, exportIncidentsCsv } from "@/lib/app-store";
import { AlertTriangle, Users, Clock, Flame, TrendingUp, TrendingDown, Sparkles, Camera, Upload, X, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Resourcify" },
      { name: "description", content: "Live NGO command center with real-time map and AI-prioritized incidents." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { incidents, volunteers, assignments, autoAssignAll, searchQuery } = useAppStore();
  const [selected, setSelected] = useState<Incident | null>(incidents[0] ?? null);
  const [assignFor, setAssignFor] = useState<Incident | null>(null);

  const q = searchQuery.trim().toLowerCase();
  const filteredFeed = q
    ? incidents.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.needType.toLowerCase().includes(q),
      )
    : incidents;

  const activeCount = incidents.filter((i) => i.status !== "resolved").length;
  const criticalCount = incidents.filter((i) => i.priority === "critical").length;

  const kpiCards = [
    { label: "Total Incidents",   value: kpis.totalIncidents,    icon: AlertTriangle, trend: "+12.4%", up: true,  color: "text-primary"     },
    { label: "Active Volunteers", value: volunteers.filter(v => v.status !== "off").length, icon: Users, trend: "+8.1%", up: true, color: "text-success" },
    { label: "Avg Response (min)",value: kpis.avgResponseMin,    icon: Clock,         trend: "-23%",   up: false, color: "text-warning"     },
    { label: "Critical Cases",    value: criticalCount,          icon: Flame,         trend: "+2",     up: true,  color: "text-critical"    },
  ];

  const handleAutoAssign = () => {
    const n = autoAssignAll();
    if (n === 0) toast.info("Nothing to assign", { description: "All open incidents already have a volunteer." });
    else toast.success(`Auto-assigned ${n} incidents`, { description: "AI matched closest, most reliable volunteers." });
  };

  const handleExport = () => {
    const csv = exportIncidentsCsv(incidents, assignments, volunteers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resourcify-incidents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export ready", { description: `${incidents.length} incidents exported as CSV` });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Command Center</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                Live · 18 states · {activeCount} active incidents
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={handleAutoAssign} className="px-4 py-2 rounded-xl text-sm font-medium gradient-primary text-primary-foreground shadow-glow flex items-center gap-2 hover:scale-[1.02] transition-transform">
              <Zap className="w-3.5 h-3.5" /> Auto-Assign All
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((k, i) => {
            const Icon = k.icon;
            const Trend = k.up ? TrendingUp : TrendingDown;
            return (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant transition-all relative overflow-hidden group"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-start justify-between relative">
                  <div className={`w-10 h-10 rounded-xl bg-muted grid place-items-center ${k.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-medium flex items-center gap-1 ${k.up ? "text-success" : "text-success"}`}>
                    <Trend className="w-3 h-3" />{k.trend}
                  </span>
                </div>
                <div className="mt-4 text-3xl font-display font-bold">
                  <CountUp to={Number(k.value)} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main grid: Map + Feed */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Live Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-3xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="font-display font-semibold text-lg">Live Incident Map</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Real-time, AI-prioritised pins across India</p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {(["critical","medium","low"] as const).map((p) => (
                  <span key={p} className={`px-2 py-1 rounded-lg ${priorityStyles[p].bg} ${priorityStyles[p].text} font-medium capitalize`}>{p}</span>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] lg:aspect-auto lg:h-[520px] p-3">
              <IndiaMap selectedId={selected?.id} onSelect={(i) => setSelected(i)} />
            </div>
          </motion.div>

          {/* Incident feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border bg-card shadow-card flex flex-col max-h-[680px]"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-lg">Incident Feed</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {q ? `${filteredFeed.length} match · "${searchQuery}"` : "Newest first · WhatsApp ingest"}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                {filteredFeed.length} of {incidents.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {filteredFeed.map((inc, i) => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  selected={selected?.id === inc.id}
                  onClick={() => setSelected(inc)}
                  onAssign={() => setAssignFor(inc)}
                  index={i}
                />
              ))}
              {filteredFeed.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">No incidents match your search.</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Details panel */}
        {selected && <AIDetailsPanel incident={selected} onClose={() => setSelected(null)} onOpenAssign={() => setAssignFor(selected)} />}
      </div>
      <AssignDialog incident={assignFor} onClose={() => setAssignFor(null)} />
    </AppShell>
  );
}

function AIDetailsPanel({ incident, onClose, onOpenAssign }: { incident: Incident; onClose: () => void; onOpenAssign: () => void }) {
  const { volunteers, assignments, assignVolunteer } = useAppStore();
  const p = priorityStyles[incident.priority];
  const ranked = rankVolunteersForIncident(volunteers.filter((v) => v.status !== "off"));
  const currentAssignee = assignments[incident.id];

  return (
    <motion.div
      key={incident.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border bg-card shadow-elegant overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gradient-mesh">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">AI Incident Analysis</h3>
            <p className="text-xs text-muted-foreground">{incident.id} · {incident.location}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-border">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
            <img src={incident.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1.5"><Camera className="w-3 h-3" /> WhatsApp photo</span>
              <span className={`px-2 py-0.5 rounded-md ${p.bg} ${p.text} backdrop-blur-md font-semibold`}>{p.label}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Need</div>
              <div className="font-semibold text-sm mt-1">{incident.needType}</div>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Severity</div>
              <div className="font-semibold text-sm mt-1 text-critical">{incident.severity}/100</div>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">People</div>
              <div className="font-semibold text-sm mt-1">{incident.peopleAffected}</div>
            </div>
          </div>
        </div>

        <div className="p-5 border-b lg:border-b-0 lg:border-r border-border">
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> AI Summary
          </h4>
          <p className="text-sm mt-2 leading-relaxed">{incident.summary}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">94%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ duration: 1 }} className="h-full gradient-primary" />
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">Recommended Action</div>
            <p className="text-xs leading-relaxed">
              Dispatch {ranked[0]?.name} ({ranked[0]?.distanceKm} km) with first-aid kit. Coordinate boat support via local fire station.
            </p>
          </div>

          {currentAssignee && (
            <div className="mt-3 p-3 rounded-xl bg-success/10 border border-success/20 text-xs">
              <span className="font-semibold text-success">Currently assigned: </span>
              {volunteers.find((v) => v.id === currentAssignee)?.name}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Top Matches</h4>
            <button
              onClick={() => {
                if (!ranked[0]) return;
                assignVolunteer(incident.id, ranked[0].id);
                toast.success(`Assigned ${ranked[0].name} to ${incident.id}`, { description: `Best AI match · ${ranked[0].distanceKm} km away` });
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
            >
              ⚡ Auto-assign best
            </button>
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {ranked.slice(0, 4).map((v, i) => (
              <VolunteerCard
                key={v.id}
                volunteer={v}
                best={i === 0}
                index={i}
                onAssign={() => {
                  assignVolunteer(incident.id, v.id);
                  toast.success(`Assigned ${v.name} to ${incident.id}`);
                }}
              />
            ))}
          </div>
          <button onClick={onOpenAssign} className="mt-3 w-full text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            See all volunteers →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
