import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Home, Heart, Users, RefreshCw, Check, X, MapPin, LogOut, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
}

interface Donor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  support_type: string;
  description: string | null;
  created_at: string;
  verified: boolean;
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
  const { user, signOut } = useAuth();
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

  const verifyVictim = async (id: string, verified: boolean) => {
    const { error } = await supabase
      .from("victims")
      .update({ verified })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update verification status");
    } else {
      toast.success(verified ? "Victim verified" : "Verification removed");
      setVictims((prev) =>
        prev.map((v) => (v.id === id ? { ...v, verified } : v))
      );
    }
  };

  const verifyDonor = async (id: string, verified: boolean) => {
    const { error } = await supabase
      .from("donors")
      .update({ verified })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update verification status");
    } else {
      toast.success(verified ? "Donor verified" : "Verification removed");
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, verified } : d))
      );
    }
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage registrations and verifications</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4" />
                Total Victims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{victims.length}</div>
              <p className="text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3 inline mr-1" />
                {victims.filter(v => v.verified).length} verified
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donors.length}</div>
              <p className="text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3 inline mr-1" />
                {donors.filter(d => d.verified).length} verified
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{volunteers.length}</div>
              <p className="text-xs text-muted-foreground">
                {volunteers.reduce((acc, v) => acc + v.skills.length, 0)} skills registered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {victims.filter(v => !v.verified).length + donors.filter(d => !d.verified).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
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
              <div className="rounded-xl border border-border bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>GPS</TableHead>
                      <TableHead>Damage</TableHead>
                      <TableHead>Family</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {victims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No victims registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      victims.map((victim) => (
                        <TableRow key={victim.id}>
                          <TableCell>
                            <Badge variant={victim.verified ? "default" : "secondary"}>
                              {victim.verified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {victim.photo_url ? (
                              <a href={victim.photo_url} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={victim.photo_url} 
                                  alt="Damage" 
                                  className="w-16 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                                />
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{victim.full_name}</TableCell>
                          <TableCell>{victim.phone_number}</TableCell>
                          <TableCell className="text-sm">
                            {victim.district}, {victim.ds_division}
                          </TableCell>
                          <TableCell>
                            {victim.latitude && victim.longitude ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openGoogleMaps(victim.latitude!, victim.longitude!)}
                              >
                                <MapPin className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={damageColors[victim.damage_type] || ""}>
                              {victim.damage_type.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{victim.family_members}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(victim.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {victim.verified ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => verifyVictim(victim.id, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Unverify
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => verifyVictim(victim.id, true)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="donors">
              <div className="rounded-xl border border-border bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Support Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No donors registered yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      donors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>
                            <Badge variant={donor.verified ? "default" : "secondary"}>
                              {donor.verified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
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
                          <TableCell>
                            {donor.verified ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => verifyDonor(donor.id, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Unverify
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => verifyDonor(donor.id, true)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="volunteers">
              <div className="rounded-xl border border-border bg-card overflow-x-auto">
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
