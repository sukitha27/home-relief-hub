import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Home, Heart, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Victim {
  id: string;
  full_name: string;
  phone_number: string;
  district: string;
  ds_division: string;
  gn_division: string;
  damage_type: string;
  family_members: number;
  essential_needs: string[] | null;
  created_at: string;
}

interface Donor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  support_type: string;
  description: string | null;
  created_at: string;
}

interface Volunteer {
  id: string;
  full_name: string;
  phone_number: string;
  skills: string[];
  availability_start: string | null;
  availability_end: string | null;
  created_at: string;
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

export default function Admin() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [victimsRes, donorsRes, volunteersRes] = await Promise.all([
        supabase.from("victims").select("*").order("created_at", { ascending: false }),
        supabase.from("donors").select("*").order("created_at", { ascending: false }),
        supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
      ]);

      if (victimsRes.data) setVictims(victimsRes.data);
      if (donorsRes.data) setDonors(donorsRes.data);
      if (volunteersRes.data) setVolunteers(volunteersRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">View all registrations</p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="victims" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="victims" className="gap-2">
                <Home className="h-4 w-4" />
                Victims ({victims.length})
              </TabsTrigger>
              <TabsTrigger value="donors" className="gap-2">
                <Heart className="h-4 w-4" />
                Donors ({donors.length})
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="gap-2">
                <Users className="h-4 w-4" />
                Volunteers ({volunteers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="victims">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Damage</TableHead>
                      <TableHead>Family</TableHead>
                      <TableHead>Needs</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {victims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No victims registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      victims.map((victim) => (
                        <TableRow key={victim.id}>
                          <TableCell className="font-medium">{victim.full_name}</TableCell>
                          <TableCell>{victim.phone_number}</TableCell>
                          <TableCell className="text-sm">
                            {victim.district}, {victim.ds_division}
                          </TableCell>
                          <TableCell>
                            <Badge className={damageColors[victim.damage_type] || ""}>
                              {victim.damage_type.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{victim.family_members}</TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="flex flex-wrap gap-1">
                              {victim.essential_needs?.slice(0, 3).map((need) => (
                                <Badge key={need} variant="outline" className="text-xs">
                                  {need}
                                </Badge>
                              ))}
                              {(victim.essential_needs?.length || 0) > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(victim.essential_needs?.length || 0) - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(victim.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="donors">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Support Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No donors registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      donors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.name}</TableCell>
                          <TableCell className="text-sm">
                            {donor.phone && <div>{donor.phone}</div>}
                            {donor.email && <div className="text-muted-foreground">{donor.email}</div>}
                          </TableCell>
                          <TableCell>
                            <Badge className={supportColors[donor.support_type] || ""}>
                              {donor.support_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate text-sm">
                            {donor.description || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(donor.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="volunteers">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No volunteers registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      volunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell className="font-medium">{volunteer.full_name}</TableCell>
                          <TableCell>{volunteer.phone_number}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {volunteer.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {volunteer.availability_start && volunteer.availability_end
                              ? `${format(new Date(volunteer.availability_start), "MMM d")} - ${format(
                                  new Date(volunteer.availability_end),
                                  "MMM d"
                                )}`
                              : "Flexible"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(volunteer.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
