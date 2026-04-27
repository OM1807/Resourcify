import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-store";
import { useAppStore } from "@/lib/app-store";
import { AuthGuard } from "@/components/auth-guard";
import { priorityStyles, type Incident } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Zap, MapPin, Clock, Sparkles, CheckCircle2, ArrowRight, Camera,
  Activity, Award, LogOut, Sun, Moon, Phone, Star, Upload, X,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "My Tasks — Resourcify Volunteer" },
      { name: "description", content: "Your assigned tasks, on-ground." },
    ],
  }),
  component: () => (
    <AuthGuard role="volunteer">
      <VolunteerHome />
    </AuthGuard>
  ),
});

function VolunteerHome() {
  const { user, logout } = useAuth();
  const { incidents, assignments, updateIncidentStatus, addProof, proofs, volunteers } = useAppStore();
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<Incident | null>(null);

  // Tasks assigned to this volunteer (use V-01 demo for prototype)
  const myId = user?.id ?? "V-01";
  const me = volunteers.find((v) => v.id === myId);
  const myIncidents = useMemo(
    () => incidents.filter((i) => assignments[i.id] === myId),
    [incidents, assignments, myId],
  );

  const open = myIncidents.filter((i) => i.status !== "resolved");
  const done = myIncidents.filter((i) => i.status === "resolved");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight">Resourcify</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Volunteer</div>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={toggle} className="w-9 h-9 grid place-items-center rounded-xl hover:bg-muted transition-colors" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={logout} className="w-9 h-9 grid place-items-center rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-critical" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-6 shadow-elegant"
        >
          <div className="absolute inset-0 grid-pattern opacity-15" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center font-display font-bold text-xl">
              {user?.initials ?? "V"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs opacity-80">Welcome back</div>
              <div className="font-display font-bold text-xl truncate">{user?.name}</div>
              <div className="text-xs opacity-80 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3" /> {user?.phone}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider opacity-80">Reliability</div>
              <div className="font-display font-bold text-2xl flex items-center gap-1 justify-end">
                {me?.reliability.toFixed(2) ?? "4.90"}
                <Star className="w-4 h-4 fill-white" />
              </div>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { l: "Open tasks", v: open.length, i: Activity },
              { l: "Completed", v: (me?.completed ?? 0) + done.length, i: CheckCircle2 },
              { l: "Tier", v: "Gold", i: Award },
            ].map((s) => {
              const I = s.i;
              return (
                <div key={s.l} className="rounded-2xl bg-white/15 backdrop-blur px-3 py-2.5">
                  <I className="w-3.5 h-3.5 mx-auto opacity-80" />
                  <div className="font-display font-bold text-lg leading-none mt-1">{s.v}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{s.l}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Open tasks */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-display font-semibold text-lg">Your active tasks</h2>
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              {open.length} open
            </span>
          </div>

          {open.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <Sparkles className="w-5 h-5 mx-auto mb-2 text-primary" />
              No active tasks. We'll notify you on WhatsApp when a match arrives.
            </div>
          )}

          <div className="space-y-3">
            {open.map((inc, i) => (
              <TaskCard key={inc.id} incident={inc} index={i} onOpen={() => setActive(inc)} />
            ))}
          </div>
        </section>

        {/* Completed */}
        {done.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-display font-semibold text-lg">Recently resolved</h2>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-success/10 text-success font-medium">
                {done.length} done
              </span>
            </div>
            <div className="space-y-2">
              {done.map((inc) => (
                <div key={inc.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{inc.title}</div>
                    <div className="text-[11px] text-muted-foreground">{inc.location} · {inc.id}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-success">+5 rel.</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Active task drawer */}
      {active && (
        <TaskDrawer
          incident={active}
          onClose={() => setActive(null)}
          onAdvance={(s) => updateIncidentStatus(active.id, s)}
          onProof={(name, dataUrl) => addProof(active.id, name, dataUrl)}
          proofs={proofs.filter((p) => p.incidentId === active.id)}
        />
      )}
    </div>
  );
}

function TaskCard({ incident, index, onOpen }: { incident: Incident; index: number; onOpen: () => void }) {
  const p = priorityStyles[incident.priority];
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onOpen}
      className="w-full text-left rounded-2xl border border-border bg-card p-4 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img src={incident.image} alt="" className="w-full h-full object-cover" />
          <span className={`absolute top-1 left-1 w-2 h-2 rounded-full ${p.dot} animate-pulse`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${p.bg} ${p.text}`}>{p.label}</span>
            <span className="text-[10px] text-muted-foreground">{incident.id}</span>
          </div>
          <div className="font-medium text-sm mt-1 truncate">{incident.title}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {incident.location}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {incident.time}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground self-center" />
      </div>
    </motion.button>
  );
}

function TaskDrawer({
  incident, onClose, onAdvance, onProof, proofs,
}: {
  incident: Incident;
  onClose: () => void;
  onAdvance: (s: "in_progress" | "resolved") => void;
  onProof: (name: string, dataUrl: string) => void;
  proofs: { id: string; name: string; dataUrl: string }[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const p = priorityStyles[incident.priority];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 4).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => onProof(f.name, reader.result as string);
      reader.readAsDataURL(f);
    });
    toast.success("Proof uploaded", { description: "Reliability score updated" });
  };

  const next = incident.status === "assigned" ? "in_progress" : "resolved";
  const nextLabel = incident.status === "assigned" ? "Start task" : "Mark resolved";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-elegant overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="relative h-44 shrink-0">
          <img src={incident.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 right-3">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${p.bg} ${p.text} backdrop-blur`}>{p.label}</span>
            <h3 className="font-display font-bold text-lg text-foreground mt-1">{incident.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {incident.location} · {incident.id}
            </p>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="rounded-xl bg-muted/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> AI brief
            </div>
            <p className="text-sm mt-1 leading-relaxed">{incident.summary}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Need" value={incident.needType} />
            <Stat label="People" value={String(incident.peopleAffected)} />
            <Stat label="Severity" value={`${incident.severity}`} accent />
          </div>

          {/* Proof of work */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Proof of work</h4>
              <button onClick={() => fileRef.current?.click()} className="text-xs font-medium text-primary inline-flex items-center gap-1">
                <Upload className="w-3 h-3" /> Add photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </div>
            {proofs.length === 0 ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-24 rounded-xl border-2 border-dashed border-border grid place-items-center text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <span className="flex flex-col items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Tap to capture from field
                </span>
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {proofs.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={p.dataUrl} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1 right-1 w-4 h-4 grid place-items-center rounded-full bg-success text-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-card sticky bottom-0 flex gap-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            Close
          </button>
          {incident.status !== "resolved" && (
            <button
              onClick={() => { onAdvance(next); toast.success(next === "resolved" ? "Task resolved 🎉" : "Task started"); if (next === "resolved") onClose(); }}
              className="flex-1 h-11 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-glow inline-flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
            >
              {next === "resolved" ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {nextLabel}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-muted p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-semibold text-sm mt-0.5 ${accent ? "text-critical" : ""}`}>{value}</div>
    </div>
  );
}
