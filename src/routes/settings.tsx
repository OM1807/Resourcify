import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Bell, Globe, Shield, Zap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Resourcify" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [prefs, setPrefs] = useState({
    criticalAlerts: true,
    volunteerEvents: true,
    dailyDigest: false,
    autoAssign: true,
    requireApproval: true,
    twoFA: false,
  });

  const update = (key: keyof typeof prefs, label: string) => {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      toast.success(`${label} ${next[key] ? "enabled" : "disabled"}`);
      return next;
    });
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your NGO console preferences</p>
        </div>

        <Section icon={Globe} title="Appearance" desc="Light, dark or follow system">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Theme</div>
              <div className="text-xs text-muted-foreground">Currently: {theme}</div>
            </div>
            <button onClick={toggle} className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted">
              Toggle theme
            </button>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications" desc="Critical alerts via WhatsApp + Email">
          <Toggle label="Critical incidents" on={prefs.criticalAlerts} onChange={() => update("criticalAlerts", "Critical alerts")} />
          <Toggle label="Volunteer accept/decline" on={prefs.volunteerEvents} onChange={() => update("volunteerEvents", "Volunteer events")} />
          <Toggle label="Daily digest" on={prefs.dailyDigest} onChange={() => update("dailyDigest", "Daily digest")} />
        </Section>

        <Section icon={Zap} title="Auto-assignment" desc="Let AI auto-route low-priority cases">
          <Toggle label="Enable auto-assign" on={prefs.autoAssign} onChange={() => update("autoAssign", "Auto-assign")} />
          <Toggle label="Require manual approval for critical" on={prefs.requireApproval} onChange={() => update("requireApproval", "Manual approval")} />
        </Section>

        <Section icon={Shield} title="Security" desc="Account & data protection">
          <Toggle label="Two-factor authentication" on={prefs.twoFA} onChange={() => update("twoFA", "Two-factor authentication")} />
          <div className="text-xs text-muted-foreground mt-2">All data encrypted at rest. SOC 2 Type II compliant.</div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-glow">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="space-y-2 pl-14">{children}</div>
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={on}
        className={`w-10 h-6 rounded-full transition-colors relative ${on ? "gradient-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
