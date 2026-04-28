import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppStoreProvider } from "@/lib/app-store";
import { AuthProvider } from "@/lib/auth-store";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Resourcify — AI-Powered NGO Resource Coordination" },
      { name: "description", content: "From WhatsApp message to real-world impact in minutes. Adaptive resource allocation for NGOs." },
      { name: "author", content: "Resourcify" },
      { property: "og:title", content: "Resourcify — AI-Powered NGO Resource Coordination" },
      { property: "og:description", content: "From WhatsApp message to real-world impact in minutes. Adaptive resource allocation for NGOs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Resourcify — AI-Powered NGO Resource Coordination" },
      { name: "twitter:description", content: "From WhatsApp message to real-world impact in minutes. Adaptive resource allocation for NGOs." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/df0f2e73-667a-4b9d-ac0e-7b0d3bdca08f/id-preview-a857b559--bcf341fb-9398-47ab-8d5a-c5abce0ce5f3.lovable.app-1777271236037.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/df0f2e73-667a-4b9d-ac0e-7b0d3bdca08f/id-preview-a857b559--bcf341fb-9398-47ab-8d5a-c5abce0ce5f3.lovable.app-1777271236037.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStoreProvider>
          <Outlet />
          <Toaster />
        </AppStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
