import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { incidents, type IncidentStatus } from "@/lib/mock-data";
import { CheckCircle2, Clock, MessageSquare, Truck, Upload, Camera } from "lucide-react";

export const Route = createFileRoute("/lifecycle")({
  head: () => ({ meta: [{ title: "Task Lifecycle — Resourcify" }, { name: "description", content: "Visualize task progress from reported to resolved." }] }),
  component: LifecyclePage,
});

const stages: { key: IncidentStatus; label: string; icon: any }[] = [
  { key: "reported",    label: "Reported",    icon: MessageSquare },
  { key: "assigned",    label: "Assigned",    icon: Truck },
  { key: "in_progress", label: "In Progress", icon: Clock },
  { key: "resolved",    label: "Resolved",    icon: CheckCircle2 },
];

const stageIndex = (s: IncidentStatus) => stages.findIndex((x) => x.key === s);

function LifecyclePage() {
  const [selected] = useState(incidents[2]); // an in-progress one
  const counts = stages.map((s) => incidents.filter((i) => i.status === s.key).length);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Task Lifecycle</h1>
          <p className="text-sm text-muted-foreground mt-1">Track every incident from intake to resolution</p>
        </div>

        {/* Pipeline overview */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display font-semibold mb-6">Pipeline Overview</h2>
          <div className="relative">
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-border" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute top-6 left-6 h-0.5 gradient-primary"
            />
            <div className="grid grid-cols-4 gap-4 relative">
              {stages.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-12 h-12 mx-auto rounded-2xl grid place-items-center shadow-card ${
                      i < 3 ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="mt-3 font-semibold text-sm">{s.label}</div>
                    <div className="text-2xl font-display font-bold mt-1">{counts[i]}</div>
                    <div className="text-[11px] text-muted-foreground">incidents</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed example */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Active task</span>
                <h2 className="font-display font-semibold text-xl mt-1">{selected.title}</h2>
                <p className="text-sm text-muted-foreground">{selected.id} · {selected.location}</p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">In Progress</span>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {stages.map((s, i) => {
                const idx = stageIndex(selected.status);
                const done = i < idx;
                const active = i === idx;
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${
                        done ? "bg-success text-success-foreground" :
                        active ? "gradient-primary text-primary-foreground shadow-glow animate-glow" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {i < stages.length - 1 && <div className={`w-0.5 flex-1 my-1 ${done ? "bg-success" : "bg-border"}`} />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{s.label}</h4>
                        <span className="text-[11px] text-muted-foreground">
                          {done ? "Completed" : active ? "Now" : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {i === 0 && "WhatsApp message received from +91 96••• ••104. AI parsed images & coords."}
                        {i === 1 && "Aarav Mehta assigned (96% match). Notification sent via WhatsApp."}
                        {i === 2 && "Volunteer en route. ETA 12 min. Live location streaming."}
                        {i === 3 && "Awaiting on-ground proof of work upload."}
                      </p>
                      {active && (
                        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2 }} className="h-full gradient-primary animate-shimmer" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Proof of work upload */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold">Proof of Work</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Upload field photos to verify resolution and earn reliability points.</p>

            <label className="block rounded-2xl border-2 border-dashed border-border p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <div className="mt-3 text-sm font-medium">Drop photo here</div>
              <div className="text-[11px] text-muted-foreground mt-1">or click to browse</div>
              <input type="file" className="hidden" />
            </label>

            <div className="mt-4 space-y-2">
              {[
                { name: "before.jpg", time: "12 min ago", verified: true },
                { name: "during.jpg", time: "6 min ago", verified: true },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.time}</div>
                  </div>
                  {f.verified && <CheckCircle2 className="w-4 h-4 text-success" />}
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">+5</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-success">Reliability +5 pts</div>
                <div className="text-[10px] text-muted-foreground">For verified proof submission</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
