import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { IncidentCard } from "@/components/incident-card";
import { incidents, priorityStyles, type Priority } from "@/lib/mock-data";
import { Filter, Search, Upload } from "lucide-react";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Incidents — Resourcify" }, { name: "description", content: "Browse and triage all reported incidents." }] }),
  component: IncidentsPage,
});

const filters: ("all" | Priority)[] = ["all", "critical", "high", "medium", "low"];

function IncidentsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const list = filter === "all" ? incidents : incidents.filter((i) => i.priority === filter);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Incidents</h1>
            <p className="text-sm text-muted-foreground mt-1">All AI-classified incidents from WhatsApp intake</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" /> Bulk import
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-border bg-card p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search by ID, location, or keyword…" className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/50 border border-transparent focus:border-border focus:bg-background outline-none text-sm" />
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
            <IncidentCard key={inc.id} incident={inc} index={i} />
          ))}
        </div>

        {list.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-sm text-muted-foreground">No incidents match this filter.</p>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
