import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Heart, MapPin, Users, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Victim {
  id: string;
  full_name: string;
  district: string;
  ds_division: string;
  damage_type: string;
  family_members: number;
  essential_needs: string[] | null;
}

interface Donor {
  id: string;
  name: string;
  support_type: string;
  description: string | null;
}

const damageColors: Record<string, string> = {
  minor: "bg-success/20 text-success",
  partial: "bg-warning/20 text-warning",
  severe: "bg-destructive/20 text-destructive",
  total_loss: "bg-destructive text-destructive-foreground",
};

const supportColors: Record<string, string> = {
  materials: "bg-primary/20 text-primary",
  money: "bg-success/20 text-success",
  labour: "bg-secondary/20 text-secondary",
};

export function PublicListings() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [victimsRes, donorsRes] = await Promise.all([
        supabase
          .from("victims")
          .select("id, full_name, district, ds_division, damage_type, family_members, essential_needs")
          .eq("verified", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("donors")
          .select("id, name, support_type, description")
          .eq("verified", true)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (victimsRes.data) setVictims(victimsRes.data);
      if (donorsRes.data) setDonors(donorsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Verified Victims */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Families Needing Help</h2>
              <p className="text-muted-foreground">Verified disaster-affected families</p>
            </div>
          </div>

          {victims.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No verified victims yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {victims.map((victim) => (
                <Card key={victim.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{victim.full_name}</CardTitle>
                      <Badge className={damageColors[victim.damage_type]}>
                        {victim.damage_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {victim.district}, {victim.ds_division}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {victim.family_members} family member{victim.family_members > 1 ? "s" : ""}
                    </div>
                    {victim.essential_needs && victim.essential_needs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {victim.essential_needs.slice(0, 3).map((need) => (
                          <Badge key={need} variant="outline" className="text-xs">
                            {need}
                          </Badge>
                        ))}
                        {victim.essential_needs.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{victim.essential_needs.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Verified Donors */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Generous Donors</h2>
              <p className="text-muted-foreground">Verified supporters offering help</p>
            </div>
          </div>

          {donors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No verified donors yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <Card key={donor.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{donor.name}</CardTitle>
                      <Badge className={supportColors[donor.support_type]}>
                        {donor.support_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {donor.description || "Willing to help with " + donor.support_type}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
