import { Navigation } from "./Navigation";
import { Analytics } from "@vercel/analytics/next";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>

      {/* Vercel Analytics must be inside the component tree */}
      <Analytics />
    </div>
  );
}
