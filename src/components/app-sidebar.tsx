import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, AlertTriangle, Users, BarChart3, Settings, MessageCircle, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/app-store";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: false },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle, badge: true },
  { to: "/volunteers", label: "Volunteers", icon: Users, badge: false },
  { to: "/analytics", label: "Analytics", icon: BarChart3, badge: false },
  { to: "/lifecycle", label: "Lifecycle", icon: Activity, badge: false },
  { to: "/whatsapp", label: "WhatsApp Sim", icon: MessageCircle, badge: false },
  { to: "/settings", label: "Settings", icon: Settings, badge: false },
] as const;

export function AppSidebar() {
  const { pathname } = useLocation();
  const { incidents } = useAppStore();
  const criticalCount = incidents.filter((i) => i.priority === "critical" && i.status !== "resolved").length;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
        <div className="relative w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
          <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display font-bold text-lg tracking-tight">Resourcify</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">NGO Console</span>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full gradient-primary" />
              )}
              <Icon className={cn("w-4 h-4 transition-colors", active && "text-primary")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && criticalCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-critical/15 text-critical">
                  {criticalCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-4 rounded-2xl gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative">
          <div className="text-xs font-medium opacity-80 mb-1">Live coordination</div>
          <div className="text-2xl font-display font-bold">17 min</div>
          <div className="text-[11px] opacity-80 mt-1">Avg. response time today</div>
          <div className="mt-3 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-3/4 bg-white/80 animate-shimmer" />
          </div>
        </div>
      </div>
    </aside>
  );
}
