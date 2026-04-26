import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Send, MapPin, Image as ImageIcon, Check, CheckCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp Simulator — Resourcify" }, { name: "description", content: "See how citizens report incidents via WhatsApp." }] }),
  component: WhatsAppPage,
});

interface Msg {
  id: number;
  from: "user" | "system";
  kind: "text" | "image" | "location" | "card";
  body?: string;
  delay?: number;
}

const SCRIPT: Msg[] = [
  { id: 1, from: "user",   kind: "image",    body: "incident.jpg" },
  { id: 2, from: "user",   kind: "text",     body: "Flood in our colony, water rising fast. 6 of us on the roof. Please help." },
  { id: 3, from: "user",   kind: "location", body: "Mylapore, Chennai · 13.0339°N, 80.2619°E" },
  { id: 4, from: "system", kind: "text",     body: "✅ Incident received. AI is analysing your report…" },
  { id: 5, from: "system", kind: "card",     body: "AI Analysis Complete" },
  { id: 6, from: "system", kind: "text",     body: "🚨 Critical · Rescue required. Volunteer Aarav Mehta is being assigned (1.2 km away)." },
  { id: 7, from: "system", kind: "text",     body: "🟢 Aarav has accepted. ETA 8 minutes. Stay where you are. Help is on the way." },
];

function WhatsAppPage() {
  const [step, setStep] = useState(0);
  const visible = SCRIPT.slice(0, step);

  const playNext = () => {
    if (step < SCRIPT.length) setStep((s) => s + 1);
    else setStep(0);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">WhatsApp Intake</h1>
            <p className="text-sm text-muted-foreground mt-1">See an incident report flow from citizen to resolution</p>
          </div>
          <button
            onClick={playNext}
            className="px-4 py-2 rounded-xl text-sm font-medium gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
          >
            {step === 0 ? "▶ Play simulation" : step >= SCRIPT.length ? "↻ Replay" : "→ Next message"}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Phone mockup */}
          <div className="mx-auto w-full max-w-sm">
            <div className="relative rounded-[2.5rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-elegant">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-foreground/95 z-10" />
              <div className="rounded-[2rem] overflow-hidden h-[640px] flex flex-col" style={{ background: "oklch(0.18 0.03 150)" }}>
                {/* Chat header */}
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: "oklch(0.25 0.05 165)" }}>
                  <div className="w-9 h-9 rounded-full gradient-primary grid place-items-center text-primary-foreground text-xs font-bold">RS</div>
                  <div className="flex-1 min-w-0 text-white">
                    <div className="font-medium text-sm">Resourcify Helpline</div>
                    <div className="text-[10px] opacity-70 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> Online · Auto-respond
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ backgroundImage: "radial-gradient(oklch(0.25 0.04 150 / 0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                  <AnimatePresence>
                    {visible.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <Bubble msg={m} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div className="p-2 flex items-center gap-2" style={{ background: "oklch(0.22 0.03 150)" }}>
                  <div className="flex-1 h-9 rounded-full px-4 flex items-center text-xs text-white/50" style={{ background: "oklch(0.3 0.04 150)" }}>
                    Type a message
                  </div>
                  <button className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "oklch(0.5 0.18 152)" }}>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side: explanation */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> What's happening
              </div>
              <h3 className="font-display font-semibold text-lg mt-2">From WhatsApp to Field in Minutes</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                A citizen sends a photo, message and live location. Resourcify's AI extracts need-type,
                severity, and people affected — then matches the closest, most reliable volunteer.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { t: "T+0s", l: "Citizen submits incident via WhatsApp" },
                  { t: "T+3s", l: "AI parses image, classifies need & severity" },
                  { t: "T+8s", l: "Best-match volunteer identified & notified" },
                  { t: "T+15s", l: "Volunteer accepts, ETA shared with citizen" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground w-14 text-center">{row.t}</span>
                    <span>{row.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="font-display font-semibold">Why WhatsApp?</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                530M+ Indians use WhatsApp daily. Zero install friction — and works on the lowest-end
                phones. We meet citizens where they already are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.from === "user";
  const base = `max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
    isUser ? "rounded-br-sm" : "rounded-bl-sm"
  }`;
  const style = isUser
    ? { background: "oklch(0.42 0.12 150)", color: "white" }
    : { background: "oklch(0.95 0.01 150)", color: "oklch(0.2 0.05 150)" };

  if (msg.kind === "image") {
    return (
      <div className={base} style={style}>
        <div className="w-48 h-32 rounded-lg overflow-hidden mb-1">
          <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=70" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1">
          <span>11:42</span><CheckCheck className="w-3 h-3" />
        </div>
      </div>
    );
  }
  if (msg.kind === "location") {
    return (
      <div className={base} style={style}>
        <div className="w-48 rounded-lg overflow-hidden mb-1 bg-muted h-24 grid place-items-center" style={{ background: "oklch(0.85 0.02 150)" }}>
          <MapPin className="w-6 h-6 text-critical" />
        </div>
        <div className="text-[11px] font-medium">📍 {msg.body}</div>
        <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1">
          <span>11:42</span><CheckCheck className="w-3 h-3" />
        </div>
      </div>
    );
  }
  if (msg.kind === "card") {
    return (
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm overflow-hidden shadow-md" style={{ background: "oklch(0.95 0.01 150)" }}>
        <div className="p-3 gradient-primary text-primary-foreground flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">AI Analysis</span>
        </div>
        <div className="p-3 space-y-1.5 text-[11px]" style={{ color: "oklch(0.2 0.05 150)" }}>
          <Row k="Need type" v="Rescue + Medical" />
          <Row k="Severity" v="94/100 (Critical)" />
          <Row k="People affected" v="6" />
          <Row k="Suggested volunteer" v="Aarav M. · 1.2 km" />
        </div>
      </div>
    );
  }
  return (
    <div className={base} style={style}>
      <div>{msg.body}</div>
      <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1">
        <span>11:42</span>
        {isUser ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="opacity-60">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
