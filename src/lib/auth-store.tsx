import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "volunteer";

export interface AuthUser {
  id: string;
  name: string;
  initials: string;
  role: Role;
  email?: string;
  phone?: string;
  title: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  loginAdmin: (email: string, _password: string) => Promise<AuthUser>;
  loginVolunteer: (phone: string, otp: string) => Promise<AuthUser>;
  loginDemo: (role: Role) => AuthUser;
  logout: () => void;
}

const Ctx = createContext<AuthStore | null>(null);
const STORAGE_KEY = "resourcify.auth";

const DEMO_ADMIN: AuthUser = {
  id: "U-ADMIN",
  name: "Anika Rao",
  initials: "AR",
  role: "admin",
  email: "anika@resourcify.org",
  title: "Field Coordinator",
};

const DEMO_VOLUNTEER: AuthUser = {
  id: "V-01",
  name: "Aarav Mehta",
  initials: "AM",
  role: "volunteer",
  phone: "+91 98000 00231",
  title: "Field Volunteer",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const loginAdmin = async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const u: AuthUser = {
      ...DEMO_ADMIN,
      email: email || DEMO_ADMIN.email,
      name: email && !email.includes("anika") ? email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : DEMO_ADMIN.name,
    };
    u.initials = u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    persist(u);
    setLoading(false);
    return u;
  };

  const loginVolunteer = async (phone: string, _otp: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const u: AuthUser = {
      ...DEMO_VOLUNTEER,
      phone: phone || DEMO_VOLUNTEER.phone,
    };
    persist(u);
    setLoading(false);
    return u;
  };

  const loginDemo = (role: Role) => {
    const u = role === "admin" ? DEMO_ADMIN : DEMO_VOLUNTEER;
    persist(u);
    return u;
  };

  const logout = () => persist(null);

  const value = useMemo<AuthStore>(
    () => ({ user, loading, loginAdmin, loginVolunteer, loginDemo, logout }),
    [user, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
