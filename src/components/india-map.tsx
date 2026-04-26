import { motion } from "framer-motion";
import { incidents, priorityStyles, type Incident } from "@/lib/mock-data";

interface IndiaMapProps {
  selectedId?: string;
  onSelect?: (incident: Incident) => void;
  compact?: boolean;
  showLabels?: boolean;
}

// Stylised India outline (approximate). Coords scaled to viewBox 0 0 100 100.
const INDIA_PATH = "M40 8 L48 6 L55 9 L60 7 L66 10 L70 14 L74 12 L78 16 L82 14 L86 18 L88 22 L92 26 L94 32 L92 38 L88 42 L86 48 L82 50 L78 48 L76 52 L78 58 L74 62 L70 58 L66 62 L62 60 L60 64 L62 70 L66 74 L68 80 L66 86 L62 90 L58 92 L54 90 L52 86 L50 82 L46 80 L42 82 L40 86 L38 82 L36 76 L38 70 L36 64 L34 58 L32 52 L30 46 L28 40 L26 34 L24 28 L26 22 L30 18 L34 14 L38 10 Z";

export function IndiaMap({ selectedId, onSelect, compact = false, showLabels = true }: IndiaMapProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Background gradient + grid */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <svg
        viewBox="0 0 100 100"
        className="relative w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 268)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 220)" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="india-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.22 268)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 220)" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={INDIA_PATH}
          fill="url(#india-fill)"
          stroke="url(#india-stroke)"
          strokeWidth="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Connection lines between critical incidents */}
        {incidents
          .filter((i) => i.priority === "critical" || i.priority === "high")
          .map((i, idx, arr) => {
            const next = arr[(idx + 1) % arr.length];
            return (
              <motion.line
                key={`line-${i.id}`}
                x1={i.x} y1={i.y} x2={next.x} y2={next.y}
                stroke="oklch(0.65 0.22 268)"
                strokeOpacity="0.18"
                strokeWidth="0.2"
                strokeDasharray="0.8 0.8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 + idx * 0.1, duration: 0.8 }}
              />
            );
          })}

        {/* Incident pins */}
        {incidents.map((inc, idx) => {
          const colors: Record<string, string> = {
            critical: "oklch(0.62 0.25 22)",
            high:     "oklch(0.62 0.25 22)",
            medium:   "oklch(0.78 0.17 78)",
            low:      "oklch(0.68 0.17 152)",
          };
          const color = colors[inc.priority];
          const isPulsing = inc.priority === "critical" || inc.priority === "high";
          const isSelected = selectedId === inc.id;
          const r = compact ? 1.1 : 1.4;

          return (
            <g key={inc.id} style={{ cursor: onSelect ? "pointer" : "default" }} onClick={() => onSelect?.(inc)}>
              {isPulsing && (
                <>
                  <motion.circle
                    cx={inc.x} cy={inc.y} r={r}
                    fill={color} fillOpacity="0.4"
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: [0.5, 3, 3.5], opacity: [0.8, 0.1, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: `${inc.x}px ${inc.y}px` }}
                  />
                  <motion.circle
                    cx={inc.x} cy={inc.y} r={r}
                    fill={color} fillOpacity="0.3"
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: [0.5, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.3 + 0.6, ease: "easeOut" }}
                    style={{ transformOrigin: `${inc.x}px ${inc.y}px` }}
                  />
                </>
              )}
              <motion.circle
                cx={inc.x} cy={inc.y} r={isSelected ? r * 1.4 : r}
                fill={color}
                stroke="white" strokeWidth="0.25"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.4 }}
                style={{ transformOrigin: `${inc.x}px ${inc.y}px` }}
              />
              {showLabels && !compact && (
                <text
                  x={inc.x + r + 0.8} y={inc.y + 0.4}
                  fontSize="2"
                  fill="currentColor"
                  className="fill-foreground/70 select-none pointer-events-none"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {inc.city}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-critical animate-pulse" />
            <span className="text-foreground/80">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-foreground/80">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-foreground/80">Resolved</span>
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-3 right-3 glass rounded-full px-3 py-1.5 text-xs flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span className="font-medium text-foreground/90">LIVE</span>
        <span className="text-muted-foreground">· India</span>
      </div>
    </div>
  );
}
