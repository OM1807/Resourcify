import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, AreaChart, Area } from "recharts";
import { responseTimeSeries, incidentsByType, reliabilityTrend, leaderboard } from "@/lib/mock-data";
import { TrendingDown, Award, Activity } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Resourcify" }, { name: "description", content: "Response time, heatmaps, leaderboard and reliability trends." }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance, response trends and volunteer impact</p>
        </div>

        {/* Top stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard icon={TrendingDown} title="Response Time" value="17 min" delta="-23% WoW" tone="success" />
          <StatCard icon={Activity} title="Resolution Rate" value="94.2%" delta="+4.1% WoW" tone="primary" />
          <StatCard icon={Award} title="Volunteer Score" value="4.78 / 5" delta="+0.2 trend" tone="warning" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Response time */}
          <ChartCard title="Avg Response Time" subtitle="Minutes from report to resolution">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={responseTimeSeries}>
                <defs>
                  <linearGradient id="grad-resp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 268)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 268)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.5 0.03 265 / 0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="minutes" stroke="oklch(0.65 0.22 268)" strokeWidth={2.5} fill="url(#grad-resp)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Incidents by type */}
          <ChartCard title="Incident Types" subtitle="Distribution across categories">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={incidentsByType}>
                <CartesianGrid stroke="oklch(0.5 0.03 265 / 0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="type" stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "oklch(0.5 0.03 265 / 0.05)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="oklch(0.65 0.22 268)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Heatmap */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4">
              <h3 className="font-display font-semibold">Incident Heatmap</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 weeks · darker = higher activity</p>
            </div>
            <Heatmap />
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold">Leaderboard</h3>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Top volunteers this month</p>
            <div className="space-y-2">
              {leaderboard.map((v, i) => (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className={`w-7 h-7 rounded-lg grid place-items-center text-xs font-bold ${
                    i === 0 ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{v.name}</div>
                    <div className="text-[11px] text-muted-foreground">{v.tasks} tasks · ⭐ {v.score}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Reliability trend */}
        <ChartCard title="Reliability Score Trend" subtitle="6-week rolling avg across all volunteers">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={reliabilityTrend}>
              <CartesianGrid stroke="oklch(0.5 0.03 265 / 0.15)" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[3.8, 5]} stroke="oklch(0.6 0.03 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="oklch(0.72 0.18 152)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.72 0.18 152)" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </AppShell>
  );
}

function StatCard({ icon: Icon, title, value, delta, tone }: { icon: any; title: string; value: string; delta: string; tone: "success" | "primary" | "warning" }) {
  const colors = { success: "text-success", primary: "text-primary", warning: "text-warning" };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-muted grid place-items-center ${colors[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="text-2xl font-display font-bold">{value}</div>
        <div className="text-[11px] text-success font-medium">{delta}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Heatmap() {
  const cols = 16;
  const rows = 7;
  const data = Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).map(() => Math.random())
  );
  return (
    <div className="space-y-1">
      {data.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((v, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (ri * cols + ci) * 0.005 }}
              className="flex-1 aspect-square rounded-md"
              style={{
                background: `oklch(${0.3 + v * 0.4} ${0.05 + v * 0.2} 268)`,
                opacity: 0.3 + v * 0.7,
              }}
              title={`Activity: ${Math.round(v * 100)}`}
            />
          ))}
        </div>
      ))}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3">
        <span>12 weeks ago</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
            <span key={o} className="w-3 h-3 rounded-sm" style={{ background: `oklch(${0.3 + o * 0.4} ${0.05 + o * 0.2} 268)`, opacity: 0.3 + o * 0.7 }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
