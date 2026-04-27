import { Bell, Search, Moon, Sun, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/app-store";
import { useNavigate } from "@tanstack/react-router";

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { searchQuery, setSearchQuery, notifications, markNotificationsRead } = useAppStore();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate({ to: "/incidents" });
  };

  return (
    <header className="h-16 border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6">
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search incidents, volunteers, locations…"
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/60 border border-transparent focus:bg-background focus:border-border outline-none text-sm transition-all"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      <button
        onClick={toggle}
        className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="relative" ref={bellRef}>
        <button
          onClick={() => { setBellOpen((v) => !v); if (!bellOpen) setTimeout(markNotificationsRead, 600); }}
          className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 grid place-items-center text-[9px] font-bold rounded-full bg-critical text-white animate-pulse">
              {unread}
            </span>
          )}
        </button>

        {bellOpen && (
          <div className="absolute right-0 top-12 w-80 rounded-2xl border border-border bg-card shadow-elegant overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-sm">Notifications</span>
              <span className="text-[10px] text-muted-foreground">{notifications.length} total</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">You're all caught up.</div>
              )}
              {notifications.map((n) => {
                const Icon = n.kind === "critical" ? AlertTriangle : n.kind === "success" ? CheckCircle2 : Info;
                const color = n.kind === "critical" ? "text-critical" : n.kind === "success" ? "text-success" : "text-primary";
                const mins = Math.max(1, Math.floor((Date.now() - n.time) / 60000));
                return (
                  <div key={n.id} className={`flex gap-3 p-3 border-b border-border last:border-0 hover:bg-muted/40 ${!n.read ? "bg-primary/5" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg bg-muted grid place-items-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{n.body}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)} hr ago`}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pl-3 border-l border-border">
        <div className="hidden md:block text-right leading-tight">
          <div className="text-sm font-medium">Anika Rao</div>
          <div className="text-[11px] text-muted-foreground">Field Coordinator</div>
        </div>
        <div className="w-9 h-9 rounded-full gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm shadow-glow">
          AR
        </div>
      </div>
    </header>
  );
}
