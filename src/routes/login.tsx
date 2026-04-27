import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";
import {
  Zap, Mail, Lock, Phone, KeyRound, ArrowRight, Loader2, Check,
  ShieldCheck, Sparkles, Users, MessageCircle, Eye, EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Resourcify" },
      { name: "description", content: "Sign in to coordinate AI-powered field operations." },
    ],
  }),
  component: LoginPage,
});

type Tab = "admin" | "volunteer";

function LoginPage() {
  const [tab, setTab] = useState<Tab>("admin");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground overflow-hidden">
      {/* LEFT — brand panel */}
      <BrandPanel />

      {/* RIGHT — auth card */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
        <div className="absolute inset-0 gradient-mesh opacity-50 lg:opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md rounded-3xl glass-strong border border-border/60 shadow-elegant p-7"
        >
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Resourcify</span>
          </div>

          <h2 className="text-2xl font-display font-bold tracking-tight">Sign in to your console</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your role to continue. Demo access is one tap away.
          </p>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 p-1 rounded-xl bg-muted/60 border border-border/60">
            {(["admin", "volunteer"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-lg bg-card shadow-card"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {t === "admin" ? <ShieldCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  {t === "admin" ? "NGO Admin" : "Volunteer"}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {tab === "admin" ? <AdminLogin key="admin" /> : <VolunteerLogin key="volunteer" />}
            </AnimatePresence>
          </div>

          {/* Demo footer */}
          <div className="mt-6 pt-5 border-t border-border/60">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Continue as demo user
            </p>
            <DemoButtons />
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-5">
            By continuing, you agree to Resourcify's{" "}
            <a className="underline underline-offset-2">Terms</a> &{" "}
            <a className="underline underline-offset-2">Privacy</a>.
          </p>

          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors">
            ← Back to homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-10 xl:p-14 text-foreground">
      {/* animated backdrop */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* floating glow orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-10 w-72 h-72 rounded-full gradient-primary opacity-30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-primary opacity-20 blur-3xl"
      />

      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-xl tracking-tight">Resourcify</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">NGO Console</div>
          </div>
        </Link>
      </div>

      <div className="relative z-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          Live across 18 Indian states
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl xl:text-5xl font-display font-bold leading-[1.05] tracking-tight"
        >
          Welcome to <span className="gradient-text">Resourcify</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          AI-powered resource coordination for real-world impact. Reducing response time from days to minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-3 max-w-md"
        >
          {[
            { icon: Sparkles, k: "AI", v: "Prioritised" },
            { icon: MessageCircle, k: "WhatsApp", v: "Native intake" },
            { icon: ShieldCheck, k: "Verified", v: "Proof of work" },
          ].map((f) => {
            const I = f.icon;
            return (
              <div key={f.k} className="rounded-2xl glass p-3">
                <I className="w-4 h-4 text-primary mb-2" />
                <div className="text-xs font-semibold">{f.k}</div>
                <div className="text-[10px] text-muted-foreground">{f.v}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-10 text-xs text-muted-foreground">
        © 2026 Resourcify · Built for impact
      </div>
    </div>
  );
}

function AdminLogin() {
  const { loginAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);

  const fillDemo = () => {
    setEmail("anika@resourcify.org");
    setPassword("demo1234");
    toast.info("Demo credentials filled", { description: "Hit Sign In to continue" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    await loginAdmin(email, password);
    setSuccess(true);
    toast.success("Welcome back, Admin", { description: "Loading command center…" });
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      onSubmit={onSubmit}
      className="space-y-3"
    >
      <Field icon={Mail} label="Work email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@ngo.org"
          autoComplete="email"
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
      </Field>

      <Field icon={Lock} label="Password">
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle password visibility"
        >
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Field>

      <div className="flex items-center justify-between text-xs">
        <label className="inline-flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" defaultChecked className="rounded border-border" />
          Remember me
        </label>
        <a className="text-primary hover:underline cursor-pointer">Forgot password?</a>
      </div>

      <PrimaryButton loading={loading} success={success}>
        {success ? "Signed in" : "Sign in to dashboard"}
      </PrimaryButton>

      <button
        type="button"
        onClick={fillDemo}
        className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors"
      >
        ⚡ Use demo admin credentials
      </button>
    </motion.form>
  );
}

function VolunteerLogin() {
  const { loginVolunteer, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setStep(2);
    toast.success("OTP sent successfully", { description: "Use 123456 for demo" });
    setOtp("123456");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    await loginVolunteer(phone, otp);
    setSuccess(true);
    toast.success("Verified", { description: "Loading your tasks…" });
    setTimeout(() => navigate({ to: "/volunteer" }), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={sendOtp}
            className="space-y-3"
          >
            <Field icon={Phone} label="Mobile number">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00231"
                autoComplete="tel"
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
              />
            </Field>

            <PrimaryButton loading={sending}>
              Send OTP
            </PrimaryButton>

            <p className="text-[11px] text-muted-foreground text-center">
              Standard SMS rates may apply. We never share your number.
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={verify}
            className="space-y-3"
          >
            <div className="rounded-xl bg-success/10 border border-success/20 px-3 py-2 text-xs text-success font-medium flex items-center gap-2">
              <Check className="w-3.5 h-3.5" /> OTP sent to {phone || "+91 98•••••231"}
            </div>

            <Field icon={KeyRound} label="6-digit OTP">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full bg-transparent outline-none text-sm tracking-[0.5em] font-mono"
              />
            </Field>

            <PrimaryButton loading={loading} success={success}>
              {success ? "Verified" : "Verify & continue"}
            </PrimaryButton>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                ← Change number
              </button>
              <button type="button" onClick={() => { setOtp("123456"); toast.info("Demo OTP filled: 123456"); }} className="text-primary hover:underline">
                Use demo OTP
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DemoButtons() {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  const enter = (role: "admin" | "volunteer") => {
    loginDemo(role);
    toast.success(`Entered as Demo ${role === "admin" ? "Admin" : "Volunteer"}`);
    setTimeout(() => navigate({ to: role === "admin" ? "/dashboard" : "/volunteer" }), 200);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => enter("admin")}
        className="group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium"
      >
        <ShieldCheck className="w-4 h-4 text-primary" />
        Admin Demo
      </button>
      <button
        onClick={() => enter("volunteer")}
        className="group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium"
      >
        <Users className="w-4 h-4 text-primary" />
        Volunteer Demo
      </button>
    </div>
  );
}

/* ---------- shared bits ---------- */

function Field({
  icon: Icon, label, children,
}: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 px-3 h-11 rounded-xl border border-border bg-background/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        {children}
      </div>
    </label>
  );
}

function PrimaryButton({
  loading, success, children,
}: { loading?: boolean; success?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading || success}
      className="w-full h-11 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-90 disabled:hover:scale-100"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : success ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid place-items-center">
          <Check className="w-4 h-4" />
        </motion.span>
      ) : (
        <ArrowRight className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
