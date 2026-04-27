import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type Role } from "@/lib/auth-store";
import { Zap } from "lucide-react";

interface Props {
  children: ReactNode;
  role?: Role; // required role; if omitted, just needs to be authed
}

export function AuthGuard({ children, role }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    } else if (role && user.role !== role) {
      // Redirect to user's correct home
      navigate({ to: user.role === "admin" ? "/dashboard" : "/volunteer" });
    }
  }, [user, role, navigate]);

  if (!user || (role && user.role !== role)) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary grid place-items-center shadow-glow animate-pulse">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">Verifying session…</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
