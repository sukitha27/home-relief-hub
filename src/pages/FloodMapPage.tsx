import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Home, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FloodMapPage() {
  const [loading, setLoading] = useState(true);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sri Lanka Flood Risk Map</h1>
                <p className="text-muted-foreground">
                  Real-time flood risk visualization and disaster management information
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  About this map
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  This interactive map provides flood risk visualization and disaster management information 
                  across Sri Lanka. Data is sourced from the Disaster Management Centre (DMC) and visualized 
                  by Nuuuwan. The map shows flood-prone areas, evacuation zones, and other critical information 
                  for disaster preparedness and response.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden h-[70vh] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="text-center space-y-4">
                <Skeleton className="h-64 w-full max-w-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              </div>
            </div>
          )}
          
          <iframe
            src="https://nuuuwan.github.io/lk_dmc_vis"
            title="Sri Lanka Flood Risk Map"
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            allowFullScreen
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-foreground">Map Controls</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use mouse to pan around the map</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Click on markers for detailed information</li>
              <li>• Use layer controls to toggle different data layers</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-foreground">Data Sources</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Disaster Management Centre (DMC) Sri Lanka</li>
              <li>• Department of Meteorology</li>
              <li>• Irrigation Department</li>
              <li>• Real-time flood gauge data</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 text-foreground">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you are in a flood-affected area and need assistance:
            </p>
            <div className="space-y-2">
              <Button asChild size="sm" className="w-full">
                <Link to="/victim-registration">Report for Assistance</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="tel:117" target="_blank" rel="noopener noreferrer">
                  Emergency Hotline: 117
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}