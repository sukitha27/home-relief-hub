import { Link } from "react-router-dom";
import { Home, Heart, Users, ArrowRight, MapPin, Mail, Phone, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PublicListings } from "@/components/home/PublicListings";
import { StatsSection } from "@/components/home/StatsSection";
import { ExternalLink } from "lucide-react";

const actions = [
  {
    title: "Report Damage",
    description: "Register your family if your home was affected by disaster. We'll connect you with help.",
    icon: Home,
    path: "/victim-registration",
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "Donate Support",
    description: "Offer materials, money, or labor to help families rebuild their homes.",
    icon: Heart,
    path: "/donor-registration",
    color: "bg-secondary/20 text-secondary",
  },
  {
    title: "Volunteer",
    description: "Share your skills — carpentry, electrical, plumbing, or masonry — to help rebuild.",
    icon: Users,
    path: "/volunteer-registration",
    color: "bg-primary/10 text-primary",
  },
];

export default function Index() {
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
              Rebuilding Homes,{" "}
              <span className="text-primary">Restoring Hope</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
              HomeRelief connects disaster-affected families with donors and volunteers
              to rebuild their homes and lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="gap-2">
                <Link to="/victim-registration">
                  Report Damage
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/donor-registration">
                  <Heart className="h-4 w-4" />
                  Donate Now
                </Link>
              </Button>
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
            How Can We Help You?
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
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
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
            <p className="text-sm text-muted-foreground">Rebuilding hope, one home at a time</p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-lg">
          Connecting disaster-affected families with donors and volunteers 
          who want to help rebuild homes and restore hope across Sri Lanka.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/victim-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Home className="h-4 w-4" />
              Need Help
            </Link>
          </li>
          <li>
            <Link to="/donor-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </li>
          <li>
            <Link to="/volunteer-registration" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Users className="h-4 w-4" />
              Volunteer
            </Link>
          </li>
          <li>
            <Link to="/public-listings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Shield className="h-4 w-4" />
              View Projects
            </Link>
          </li>
          {/* New External Links */}
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
        <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
        <ul className="space-y-4">
          <li>
            <a href="mailto:help@homerelief.lk" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" />
              help@homerelief.lk
            </a>
          </li>
          <li>
            <a href="tel:+94761148054" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +94 761148054
            </a>
          </li>
        </ul>
        
        <div className="mt-8 pt-6 border-t border-border">
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
          © 2025 HomeRelief Sri Lanka. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="px-3 py-1">
            Serving all 25 districts
          </Badge>
        </div>
      </div>
    </div>
  </div>
</footer>
    </Layout>
  );
}