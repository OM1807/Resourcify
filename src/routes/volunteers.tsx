import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { VolunteerCard } from "@/components/volunteer-card";
import { useAppStore } from "@/lib/app-store";
import { Award, Search, Users, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/volunteers")({
  head: () => ({ meta: [{ title: "Volunteers — Resourcify" }, { name: "description", content: "Manage and rank field volunteers with reliability scoring." }] }),
  component: VolunteersPage,
});

function VolunteersPage() {
  const { volunteers, incidents, assignments, assignVolunteer } = useAppStore();
  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {
    let arr = [...volunteers].sort((a, b) => b.reliability - a.reliability);
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.skills.join(" ").toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q),
      );
    }
    return arr;
  }, [volunteers, search]);

  const top = sorted[0] ?? volunteers[0];

  // Find next unassigned reported incident, used when clicking Assign
  const handleAssign = (volunteerId: string, name: string) => {
    const next = incidents.find((i) => i.status === "reported" && !assignments[i.id]);
    if (!next) {
      toast.info("No open incidents", { description: "All reported incidents already have a volunteer." });
      return;
    }
    assignVolunteer(next.id, volunteerId);
    toast.success(`Assigned ${name}`, { description: `→ ${next.id} · ${next.location}` });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Volunteers</h1>
            <p className="text-sm text-muted-foreground mt-1">Ranked by AI reliability score, distance and skills match</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search volunteers, skills…"
              className="h-10 pl-9 pr-4 rounded-xl bg-muted/60 border border-transparent focus:bg-background focus:border-border outline-none text-sm w-72"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Available now", v: volunteers.filter((v) => v.status === "available").length, icon: Users, color: "text-success" },
            { label: "On active task", v: volunteers.filter((v) => v.status === "on_task").length,   icon: MapPin, color: "text-primary" },
            { label: "Avg reliability", v: (volunteers.reduce((a, v) => a + v.reliability, 0) / volunteers.length).toFixed(2), icon: Award, color: "text-warning" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-card">
                <div className={`w-12 h-12 rounded-xl bg-muted grid place-items-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top volunteer */}
        {top && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl gradient-primary p-1 shadow-glow">
            <div className="rounded-[20px] bg-card p-6 flex flex-wrap items-center gap-6">
              <div className="w-20 h-20 rounded-2xl gradient-primary grid place-items-center text-primary-foreground text-2xl font-display font-bold shadow-glow">
                {top.initials}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full gradient-primary text-primary-foreground">Top Performer</span>
                </div>
                <h2 className="text-2xl font-display font-bold mt-1">{top.name}</h2>
                <p className="text-sm text-muted-foreground">{top.completed} tasks · {top.reliability.toFixed(2)} reliability · {top.city}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {top.skills.map((s) => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full bg-muted">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((v, i) => (
            <VolunteerCard key={v.id} volunteer={v} index={i} best={i === 0} onAssign={() => handleAssign(v.id, v.name)} />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
            No volunteers match your search.
          </div>
        )}
      </div>
    </AppShell>
  );
}
