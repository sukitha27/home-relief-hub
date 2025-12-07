// src/pages/Index.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Heart, Users, ArrowRight, MapPin, Mail, Phone, Shield, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PublicListings } from "@/components/home/PublicListings";
import { StatsSection } from "@/components/home/StatsSection";
import { ExternalLink } from "lucide-react";
import { FloodMap } from "@/components/home/FloodMap";

export default function Index() {
  const { t } = useTranslation();

  const actions = [
    {
      title: t("nav.reportDamage"),
      description: t("howItWorks.step1Desc"),
      icon: Home,
      path: "/victim-registration",
      color: "bg-destructive/10 text-destructive",
    },
    {
      title: t("nav.donate"),
      description: t("howItWorks.step3Desc"),
      icon: Heart,
      path: "/donor-registration",
      color: "bg-secondary/20 text-secondary",
    },
    {
      title: t("nav.volunteer"),
      description: t("howItWorks.step2Desc"),
      icon: Users,
      path: "/volunteer-registration",
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5">
              <MapPin className="h-3 w-3 mr-1" />
              Serving all 25 districts of Sri Lanka
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in">
              {t("hero.title").split(",")[0]},{" "}
              <span className="text-primary">{t("hero.title").split(",")[1] || "Restoring Hope"}</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="gap-2">
                <Link to="/victim-registration">
                  {t("hero.reportDamage")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/donor-registration">
                  <Heart className="h-4 w-4" />
                  {t("hero.offerHelp")}
                </Link>
              </Button>

              {/* Add Flood Map Button */}
              <FloodMap
                trigger={
                  <Button variant="outline" size="lg" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("floodMap.viewFullMap")}
                  </Button>
                }
              />
            </div>
            
            {/* River Monitor Button - New Section */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
                <Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Live River Monitoring</span>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
                Track real-time river levels and flood warnings across Sri Lanka
              </p>
              
              <a 
                href="https://rivermonitorsl.homerelieflk.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105"
              >
                <Waves className="h-5 w-5" />
                Open River Monitor Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Actions Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            {t("howItWorks.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${action.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {action.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* River Monitor Card - Add this below the actions section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10 p-8 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Waves className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Live River Monitoring System
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Track real-time river levels, rainfall data, and flood warnings across Sri Lanka. 
                    Get instant alerts and make informed decisions during flood situations.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="https://rivermonitorsl.homerelieflk.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                    >
                      <Waves className="h-4 w-4" />
                      Open River Monitor
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Listings */}
      <PublicListings />

      {/* Enhanced Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Home className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">HomeRelief Sri Lanka</h2>
                  <p className="text-sm text-muted-foreground">{t("hero.title")}</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-lg">
                {t("footer.description")}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.quickLinks")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/victim-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {t("nav.reportDamage")}
                  </Link>
                </li>
                <li>
                  <Link to="/donor-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t("nav.donate")}
                  </Link>
                </li>
                <li>
                  <Link to="/volunteer-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("nav.volunteer")}
                  </Link>
                </li>
                <li>
                  <Link to="/public-listings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    View Projects
                  </Link>
                </li>
                {/* River Monitor Link in Quick Links */}
                <li>
                  <a 
                    href="https://rivermonitorsl.homerelieflk.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Waves className="h-4 w-4" />
                    Live River Monitor
                  </a>
                </li>
                {/* Other External Links */}
                <li>
                  <a 
                    href="https://aid.floodsupport.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Flood Support Aid
                  </a>
                </li>
                <li>
                  <a 
                    href="https://floodsupport.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Flood Support Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{t("footer.contact")}</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:help@homerelieflk.org" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    help@homerelieflk.org
                  </a>
                </li>
                <li>
                  <a href="tel:+94761148054" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +94 761148054
                  </a>
                </li>
              </ul>
              
              {/* River Monitor Mini Widget in Footer */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Real-time Monitoring</h4>
                  <a 
                    href="https://rivermonitorsl.homerelieflk.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Waves className="h-4 w-4" />
                    View live river levels →
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Made with ❤️ for Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 HomeRelief Sri Lanka. {t("footer.allRightsReserved")}
              </p>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  Serving all 25 districts
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                  <Waves className="h-3 w-3 mr-1" />
                  Live River Monitoring
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}