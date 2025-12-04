import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Users, Shield, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";

const getNavItems = (t: (key: string) => string) => [
  { path: "/", label: t("nav.home"), icon: Home },
  { path: "/victim-registration", label: t("nav.reportDamage"), icon: Home },
  { path: "/donor-registration", label: t("nav.donate"), icon: Heart },
  { path: "/volunteer-registration", label: t("nav.volunteer"), icon: Users },
  { path: "/auth", label: t("nav.adminLogin"), icon: Shield },
];

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const navItems = getNavItems(t);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Placeholder content */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/20"></div>
              <div className="h-6 w-32 rounded bg-foreground/10"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-foreground/10"></div>
              <div className="h-10 w-10 rounded-lg bg-foreground/10"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 dark:bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-colors">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HomeRelief</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle - Always Visible */}
            <div className="flex items-center">
              <LanguageToggle />
            </div>

            {/* Theme Toggle - Always Visible */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <div className="relative h-5 w-5">
                <Sun className={cn(
                  "h-5 w-5 absolute transition-all duration-300",
                  theme === "light" 
                    ? "rotate-0 scale-100 opacity-100 text-yellow-500" 
                    : "rotate-90 scale-0 opacity-0"
                )} />
                <Moon className={cn(
                  "h-5 w-5 absolute transition-all duration-300",
                  theme === "dark" 
                    ? "rotate-0 scale-100 opacity-100 text-blue-400" 
                    : "-rotate-90 scale-0 opacity-0"
                )} />
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Only contains menu items, NOT toggles */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}