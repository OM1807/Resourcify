import { motion } from "framer-motion";
import { priorityStyles, type Incident } from "@/lib/mock-data";
import { MapPin, Clock, Users, ArrowRight, Sparkles } from "lucide-react";

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  selected?: boolean;
  index?: number;
}

export function IncidentCard({ incident, onClick, selected, index = 0 }: IncidentCardProps) {
  const p = priorityStyles[incident.priority];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`group w-full text-left rounded-2xl border bg-card shadow-card hover:shadow-elegant transition-all overflow-hidden relative ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      {incident.priority === "critical" && (
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-critical animate-pulse" />
      )}

      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img src={incident.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${p.bg} ${p.text} backdrop-blur-md`}>
            {p.label}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {incident.title}
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">{incident.id}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex items-start gap-1">
            <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
            <span>{incident.summary}</span>
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{incident.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{incident.time}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{incident.peopleAffected}</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{incident.needType}</span>
        <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
          Assign <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.button>
  );
}
