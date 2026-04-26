import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Sparkles, Activity, Shield, MessageCircle, Sun, Moon } from "lucide-react";
import { IndiaMap } from "@/components/india-map";
import { CountUp } from "@/components/count-up";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resourcify — AI-Powered Disaster & Resource Coordination" },
      { name: "description", content: "From WhatsApp message to real-world impact in minutes. Resourcify converts incident reports into AI-prioritized, geo-mapped tasks for NGOs." },
      { property: "og:title", content: "Resourcify — From WhatsApp to real-world impact" },
      { property: "og:description", content: "Reducing NGO response time from days to minutes." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Nav */}
      <header className="relative z-20">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Resourcify</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#features">Features</a>
            <a className="hover:text-foreground transition-colors" href="#impact">Impact</a>
            <Link to="/whatsapp" className="hover:text-foreground transition-colors">WhatsApp</Link>
            <Link to="/analytics" className="hover:text-foreground transition-colors">Analytics</Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-9 h-9 grid place-items-center rounded-xl hover:bg-muted transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
              Open Console <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 gradient-mesh opacity-80" />
        <div className="absolute inset-x-0 top-0 h-[800px]" style={{ background: "var(--gradient-glow)" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Live coordination across 18 Indian states
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.05] tracking-tight"
            >
              AI-Powered Disaster &<br />
              <span className="gradient-text">Resource Coordination</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              From WhatsApp message to real-world impact in minutes. Resourcify turns incident reports
              into AI-prioritized, geo-mapped tasks and auto-assigns the best nearby volunteers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/whatsapp" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-strong font-medium hover:bg-card transition-colors">
                <MessageCircle className="w-4 h-4" /> Report Incident
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-4 max-w-lg"
            >
              {[
                { v: 1284, l: "Incidents resolved", s: "" },
                { v: 17,   l: "Avg response (min)", s: "" },
                { v: 96,   l: "Match accuracy", s: "%" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-display font-bold gradient-text">
                    <CountUp to={s.v} suffix={s.s} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Map preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-square rounded-3xl glass-strong shadow-elegant p-4 overflow-hidden">
              <IndiaMap />
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -left-4 top-12 hidden md:block glass-strong rounded-2xl p-3 shadow-elegant w-56 animate-float"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-critical animate-pulse" />
                <span className="font-semibold">Critical incident</span>
                <span className="text-muted-foreground ml-auto">2m</span>
              </div>
              <p className="text-sm mt-1.5 leading-snug">Family of 6 stranded · Chennai</p>
              <div className="mt-2 text-[10px] text-success font-medium">→ Auto-assigned to Aarav M.</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -right-2 bottom-10 hidden md:block glass-strong rounded-2xl p-3 shadow-elegant w-56"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Match Score
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-display font-bold gradient-text">96%</span>
                <span className="text-[10px] text-muted-foreground">Skills · Distance · Reliability</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tagline strip */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground/80">
            <span className="gradient-text font-semibold">Reducing response time from days to minutes.</span>
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Trusted by 42 NGOs</span>
            <span>·</span>
            <span>3.2M+ people reached</span>
            <span>·</span>
            <span>Powered by Lovable AI</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            From chaos to coordinated response, instantly.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: MessageCircle, title: "WhatsApp Intake", desc: "Citizens send a photo, message and location. Our AI parses needs, severity and urgency in seconds." },
            { icon: Sparkles, title: "AI Prioritisation", desc: "Vision + language models classify incidents, score severity, and surface critical cases first." },
            { icon: Activity, title: "Auto-assign Volunteers", desc: "Best-match by distance, skills, and reliability. Volunteers get a one-tap accept on WhatsApp." },
            { icon: Shield, title: "Proof of Work", desc: "On-ground photos and timestamps verify resolution, building trust and reliability scores." },
            { icon: Zap, title: "Live Coordination", desc: "NGO commanders see every incident, every volunteer, every status — on a single live map." },
            { icon: ArrowRight, title: "Outcome Analytics", desc: "Heatmaps and response trends turn each disaster into a learning loop for the next one." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl gradient-primary grid place-items-center shadow-glow mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="impact" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 lg:p-16 text-primary-foreground shadow-elegant">
          <div className="absolute inset-0 grid-pattern opacity-15" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
                Every minute matters.<br />Make every one count.
              </h2>
              <p className="mt-3 opacity-90 max-w-md">
                Stand up a coordinated, AI-powered field operation in under an hour.
              </p>
            </div>
            <div className="md:justify-self-end flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-background text-foreground font-medium hover:scale-[1.02] transition-transform">
                Launch Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/whatsapp" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm font-medium hover:bg-white/25 transition-colors">
                See WhatsApp Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Resourcify · Built for impact.</span>
          <span>Hackathon prototype · UI demo with simulated data</span>
        </div>
      </footer>
    </div>
  );
}
