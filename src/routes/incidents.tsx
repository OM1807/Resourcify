import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { IncidentCard } from "@/components/incident-card";
import { AssignDialog } from "@/components/assign-dialog";
import { priorityStyles, type Priority, type Incident, type NeedType } from "@/lib/mock-data";
import { useAppStore } from "@/lib/app-store";
import { Filter, Search, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Incidents — Resourcify" }, { name: "description", content: "Browse and triage all reported incidents." }] }),
  component: IncidentsPage,
});

const filters: ("all" | Priority)[] = ["all", "critical", "high", "medium", "low"];

const SAMPLE_LOCATIONS: { city: string; location: string; x: number; y: number }[] = [
  { city: "Pune", location: "Kothrud, Pune", x: 42, y: 62 },
  { city: "Bengaluru", location: "Whitefield, Bengaluru", x: 50, y: 75 },
  { city: "Lucknow", location: "Hazratganj, Lucknow", x: 58, y: 38 },
  { city: "Kolkata", location: "Salt Lake, Kolkata", x: 78, y: 50 },
];
const SAMPLE_NEEDS: NeedType[] = ["Medical", "Food", "Shelter", "Rescue", "Water"];

function IncidentsPage() {
  const { incidents, addIncident, searchQuery, setSearchQuery } = useAppStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [localSearch, setLocalSearch] = useState("");
  const [assignFor, setAssignFor] = useState<Incident | null>(null);

  const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

  const list = useMemo(() => {
    let l = filter === "all" ? incidents : incidents.filter((i) => i.priority === filter);
    if (effectiveSearch) {
      l = l.filter(
        (i) =>
          i.id.toLowerCase().includes(effectiveSearch) ||
          i.title.toLowerCase().includes(effectiveSearch) ||
          i.location.toLowerCase().includes(effectiveSearch) ||
          i.needType.toLowerCase().includes(effectiveSearch),
      );
    }
    return l;
  }, [incidents, filter, effectiveSearch]);

  const handleBulkImport = () => {
    const count = 3;
    const baseId = 2042 + Math.floor(Math.random() * 100);
    for (let i = 0; i < count; i++) {
      const loc = SAMPLE_LOCATIONS[i % SAMPLE_LOCATIONS.length];
      const need = SAMPLE_NEEDS[Math.floor(Math.random() * SAMPLE_NEEDS.length)];
      const sev = 30 + Math.floor(Math.random() * 65);
      const priority: Priority = sev > 85 ? "critical" : sev > 65 ? "high" : sev > 45 ? "medium" : "low";
      addIncident({
        id: `INC-${baseId + i}`,
        title: `${need} request — ${loc.city}`,
        summary: `Newly imported incident from field WhatsApp batch. Severity ${sev}/100. Awaiting triage.`,
        location: loc.location,
        city: loc.city,
        x: loc.x,
        y: loc.y,
        priority,
        needType: need,
        peopleAffected: 10 + Math.floor(Math.random() * 200),
        severity: sev,
        time: "just now",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=70",
        status: "reported",
        reporter: `+91 9${Math.floor(1000000000 + Math.random() * 8999999999)}`.slice(0, 14),
      });
    }
    toast.success(`Imported ${count} new incidents`, { description: "Batch ingested from WhatsApp helpline" });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Incidents</h1>
            <p className="text-sm text-muted-foreground mt-1">All AI-classified incidents from WhatsApp intake</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBulkImport} className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" /> Bulk import
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-border bg-card p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setSearchQuery(e.target.value); }}
              placeholder="Search by ID, location, or keyword…"
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/50 border border-transparent focus:border-border focus:bg-background outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : priorityStyles[f as Priority].label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((inc, i) => (
            <IncidentCard key={inc.id} incident={inc} index={i} onClick={() => setAssignFor(inc)} onAssign={() => setAssignFor(inc)} />
          ))}
        </div>

        {list.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-sm text-muted-foreground">No incidents match this filter.</p>
          </motion.div>
        )}
      </div>
      <AssignDialog incident={assignFor} onClose={() => setAssignFor(null)} />
    </AppShell>
  );
}
