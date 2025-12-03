import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FloodMapProps {
  trigger?: React.ReactNode;
}

export function FloodMap({ trigger }: FloodMapProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            View Flood Map
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sri Lanka Flood Risk Map
            </DialogTitle>
            <div className="flex items-center gap-2">
              <a
                href="https://nuuuwan.github.io/lk_dmc_vis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Open in new tab
                <ExternalLink className="h-3 w-3" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="text-center space-y-4">
                  <Skeleton className="h-64 w-full" />
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
          
          <div className="p-4 border-t bg-muted/50 text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-muted-foreground">
                  <strong>Source:</strong> DMC Sri Lanka Flood Risk Visualization
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This map shows flood risk areas and disaster management information across Sri Lanka.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const iframe = document.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.location.reload();
                    }
                  }}
                >
                  Refresh Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}