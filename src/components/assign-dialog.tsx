import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Star, MapPin } from "lucide-react";
import { useAppStore, rankVolunteersForIncident } from "@/lib/app-store";
import { type Incident, priorityStyles } from "@/lib/mock-data";
import { toast } from "sonner";

interface AssignDialogProps {
  incident: Incident | null;
  onClose: () => void;
}

export function AssignDialog({ incident, onClose }: AssignDialogProps) {
  const { volunteers, assignments, assignVolunteer } = useAppStore();
  if (!incident) return null;
  const ranked = rankVolunteersForIncident(volunteers.filter((v) => v.status !== "off"));
  const currentAssignee = assignments[incident.id];
  const p = priorityStyles[incident.priority];

  const handleAssign = (volunteerId: string, name: string) => {
    assignVolunteer(incident.id, volunteerId);
    toast.success(`Assigned ${name}`, { description: `${incident.id} · ${incident.location}` });
    onClose();
  };

  return (
    <AnimatePresence>
      {incident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-card border border-border shadow-elegant overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gradient-mesh">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">Assign volunteer</h3>
                  <p className="text-xs text-muted-foreground">{incident.id} · {incident.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className={`px-2 py-1 rounded-md ${p.bg} ${p.text} font-semibold`}>{p.label}</span>
                <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{incident.location}</span>
                {currentAssignee && (
                  <span className="ml-auto text-success font-medium">
                    Currently: {volunteers.find((v) => v.id === currentAssignee)?.name}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {ranked.map((v, i) => {
                  const isAssigned = currentAssignee === v.id;
                  return (
                    <div
                      key={v.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        i === 0 ? "border-primary/40 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground font-semibold shrink-0">
                        {v.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{v.name}</span>
                          {i === 0 && (
                            <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full gradient-primary text-primary-foreground">★ AI Best</span>
                          )}
                          <span className="text-[11px] text-muted-foreground ml-auto">{v.distanceKm} km</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < Math.round(v.reliability) ? "fill-warning text-warning" : "text-muted"}`} />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-1">{v.reliability.toFixed(2)} · {v.completed} done</span>
                        </div>
                      </div>
                      <button
                        disabled={isAssigned}
                        onClick={() => handleAssign(v.id, v.name)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                          isAssigned
                            ? "bg-success/10 text-success cursor-default"
                            : "gradient-primary text-primary-foreground hover:scale-[1.03]"
                        }`}
                      >
                        {isAssigned ? "Assigned ✓" : "Assign"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
