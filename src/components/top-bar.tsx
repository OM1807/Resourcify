import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function TopBar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="h-16 border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6">
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search incidents, volunteers, locations…"
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/60 border border-transparent focus:bg-background focus:border-border outline-none text-sm transition-all"
        />
        <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-5 px-1.5 items-center text-[10px] font-mono text-muted-foreground bg-background/60 border border-border rounded">⌘K</kbd>
      </div>

      <button
        onClick={toggle}
        className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <button className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted transition-colors relative" aria-label="Notifications">
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-critical animate-pulse" />
      </button>

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
