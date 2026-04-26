import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Volunteer } from "@/lib/mock-data";

interface VolunteerCardProps {
  volunteer: Volunteer;
  best?: boolean;
  index?: number;
  onAssign?: () => void;
}

export function VolunteerCard({ volunteer, best, index = 0, onAssign }: VolunteerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative rounded-2xl border bg-card p-4 shadow-card transition-all hover:shadow-elegant ${
        best ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
      }`}
    >
      {best && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider gradient-primary text-primary-foreground shadow-glow">
          ★ Best Match
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl gradient-primary grid place-items-center text-primary-foreground font-semibold shrink-0 shadow-card">
          {volunteer.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h5 className="font-semibold text-sm">{volunteer.name}</h5>
            <span className="text-[11px] text-muted-foreground">{volunteer.distanceKm} km</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.round(volunteer.reliability) ? "fill-warning text-warning" : "text-muted"}`}
              />
            ))}
            <span className="text-[11px] text-muted-foreground ml-1">{volunteer.reliability.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {volunteer.skills.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground">{volunteer.completed} tasks completed</span>
        <button
          onClick={onAssign}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Assign
        </button>
      </div>
    </motion.div>
  );
}
