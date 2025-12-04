// src/pages/admin.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Home,
  Heart,
  Users,
  RefreshCw,
  Check,
  X,
  MapPin,
  LogOut,
  ShieldCheck,
  Clock,
  Search as SearchIcon,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import Papa from "papaparse";

/**
 * Upgraded Admin dashboard for victims management
 * Features:
 *  - Search + Filters
 *  - Pagination
 *  - Sorting
 *  - Bulk actions
 *  - Detail modal
 *  - Realtime subscription
 *  - CSV export
 *
 * Uses only existing victim columns (safe writes only to verified & updated_at)
 */

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
  updated_at: string | null;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
}

const damageColors: Record<string, string> = {
  minor: "bg-success/20 text-success",
  partial: "bg-warning/20 text-warning",
  severe: "bg-destructive/20 text-destructive",
  total_loss: "bg-destructive text-destructive-foreground",
};

export default function Admin() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  // data + UI state
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // filters / search / sort / pagination
  const [query, setQuery] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string | null>(null);
  const [filterDamage, setFilterDamage] = useState<string | null>(null);
  const [filterVerified, setFilterVerified] = useState<string | null>(null); // "all" | "verified" | "unverified"
  const [sortBy, setSortBy] = useState<{ col: string; asc: boolean }>({
    col: "created_at",
    asc: false,
  });
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 12;

  // selection & modal
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeVictim, setActiveVictim] = useState<Victim | null>(null);

  // districts list (derived)
  const districts = useMemo(() => {
    const set = new Set<string>();
    victims.forEach((v) => v.district && set.add(v.district));
    return Array.from(set).sort();
  }, [victims]);

  // fetch with pagination, sorting, filtering, search
  const fetchVictims = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = page * PAGE_SIZE - 1;

      // base query
      let sb = supabase
        .from("victims")
        .select("*", { count: "exact" });

      // search by name, phone, district (simple)
      if (query && query.trim().length > 0) {
        const q = query.trim();
        // Use ilike for partial match on multiple columns
        sb = sb.or(
          `full_name.ilike.%${q}%,phone_number.ilike.%${q}%,district.ilike.%${q}%`
        );
      }

      // filters
      if (filterDistrict) {
        sb = sb.eq("district", filterDistrict);
      }
      if (filterDamage) {
        sb = sb.eq("damage_type", filterDamage as "minor" | "partial" | "severe" | "total_loss");
      }
      if (filterVerified === "verified") {
        sb = sb.eq("verified", true);
      } else if (filterVerified === "unverified") {
        sb = sb.eq("verified", false);
      }

      // sorting
      sb = sb.order(sortBy.col, { ascending: sortBy.asc });

      // range for pagination
      const resp = await sb.range(from, to);

      if (resp.error) {
        console.error("Supabase fetch error", resp.error);
        toast.error("Failed to load victims");
      } else {
        // resp.data is the current page array
        setVictims(resp.data ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error while fetching victims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVictims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, filterDistrict, filterDamage, filterVerified, query]);

  // realtime subscription to refresh when victims table changes
  useEffect(() => {
    const channel = supabase
      .channel("public:victims")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "victims",
        },
        (payload) => {
          // For simplicity, just re-fetch current page when any change happens
          fetchVictims();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, filterDistrict, filterDamage, filterVerified, query]);

  // toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      victims.forEach((v) => next.add(v.id));
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // single verify/unverify
  const verifyVictim = async (id: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from("victims")
        .update({ verified, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        toast.error("Failed to update verification");
      } else {
        toast.success(verified ? "Verified" : "Unverified");
        setVictims((prev) => prev.map((v) => (v.id === id ? { ...v, verified, updated_at: new Date().toISOString() } : v)));
        // optional: write an admin log to another table here
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error while updating verification");
    }
  };

  // bulk verify/unverify
  const bulkVerify = async (verified: boolean) => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one record");
      return;
    }
    const ids = Array.from(selectedIds);
    setLoading(true);
    try {
      const { error } = await supabase
        .from("victims")
        .update({ verified, updated_at: new Date().toISOString() })
        .in("id", ids);

      if (error) {
        toast.error("Bulk update failed");
      } else {
        toast.success(`Updated ${ids.length} records`);
        // update local state
        setVictims((prev) => prev.map((v) => (ids.includes(v.id) ? { ...v, verified, updated_at: new Date().toISOString() } : v)));
        clearSelection();
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected bulk update error");
    } finally {
      setLoading(false);
    }
  };

  // export selected (or all on page) to CSV
  const exportSelectedCSV = () => {
    const rows = victims.filter((v) => selectedIds.size === 0 ? true : selectedIds.has(v.id)).map((v) => ({
      id: v.id,
      full_name: v.full_name,
      phone_number: v.phone_number,
      district: v.district,
      ds_division: v.ds_division,
      gn_division: v.gn_division,
      damage_type: v.damage_type,
      family_members: v.family_members,
      essential_needs: Array.isArray(v.essential_needs) ? v.essential_needs.join("|") : v.essential_needs ?? "",
      verified: v.verified ? "yes" : "no",
      created_at: v.created_at,
      updated_at: v.updated_at ?? "",
      latitude: v.latitude ?? "",
      longitude: v.longitude ?? "",
      photo_url: v.photo_url ?? "",
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `victims_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started");
  };

  // open detail modal
  const openDetail = (v: Victim) => {
    setActiveVictim(v);
    setDetailModalOpen(true);
  };

  // Map: open google maps for given coords
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  // handle sorting by column (toggle asc/desc)
  const handleSort = (col: string) => {
    setSortBy((prev) => {
      if (prev.col === col) return { col, asc: !prev.asc };
      return { col, asc: false };
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t("admin.title") || "Admin"}</h1>
            <p className="text-sm text-muted-foreground">{t("admin.analytics") || "Manage victims, donors & volunteers"}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => { setPage(1); fetchVictims(); }} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Controls: Search / Filters / Bulk actions */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone or district..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* District filter */}
            <Select
              onValueChange={(v) => {
                setFilterDistrict(v === "all" ? null : v);
                setPage(1);
              }}
              value={filterDistrict ?? "all"}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All districts</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Damage type filter */}
            <Select
              onValueChange={(v) => {
                setFilterDamage(v === "all" ? null : v);
                setPage(1);
              }}
              value={filterDamage ?? "all"}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Damage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
                <SelectItem value="total_loss">Total Loss</SelectItem>
              </SelectContent>
            </Select>

            {/* Verification filter */}
            <Select
              onValueChange={(v) => {
                setFilterVerified(v === "all" ? null : v);
                setPage(1);
              }}
              value={filterVerified ?? "all"}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onClick={() => selectAllOnPage()}>
              Select page
            </Button>
            <Button variant="outline" onClick={() => clearSelection()}>
              Clear
            </Button>

            <Button variant="default" onClick={() => bulkVerify(true)} disabled={selectedIds.size === 0}>
              <Check className="mr-2 h-4 w-4" />
              Verify selected
            </Button>

            <Button variant="destructive" onClick={() => bulkVerify(false)} disabled={selectedIds.size === 0}>
              <X className="mr-2 h-4 w-4" />
              Unverify selected
            </Button>

            <Button variant="outline" onClick={exportSelectedCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" /> Total Victims
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" /> Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {victims.filter(v => !v.verified).length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> Families
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{victims.reduce((acc, v) => acc + (v.family_members || 0), 0)}</div>
              <p className="text-xs text-muted-foreground">Total family members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> Geo tagged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{victims.filter(v => v.latitude && v.longitude).length}</div>
              <p className="text-xs text-muted-foreground">With coordinates</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={victims.every((v) => selectedIds.has(v.id))}
                      onChange={(e) => (e.target.checked ? selectAllOnPage() : clearSelection())}
                    />
                  </TableHead>
                  <TableHead onClick={() => handleSort("verified")} className="cursor-pointer">
                    Status
                  </TableHead>
                  <TableHead onClick={() => handleSort("photo_url")} className="cursor-pointer">Photo</TableHead>
                  <TableHead onClick={() => handleSort("full_name")} className="cursor-pointer">Name</TableHead>
                  <TableHead onClick={() => handleSort("phone_number")} className="cursor-pointer">Phone</TableHead>
                  <TableHead onClick={() => handleSort("district")} className="cursor-pointer">Location</TableHead>
                  <TableHead>GPS</TableHead>
                  <TableHead onClick={() => handleSort("damage_type")} className="cursor-pointer">Damage</TableHead>
                  <TableHead>Family</TableHead>
                  <TableHead onClick={() => handleSort("created_at")} className="cursor-pointer">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {victims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No victims found
                    </TableCell>
                  </TableRow>
                ) : (
                  victims.map((victim) => (
                    <TableRow key={victim.id} className={selectedIds.has(victim.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(victim.id)}
                          onChange={() => toggleSelect(victim.id)}
                        />
                      </TableCell>

                      <TableCell>
                        <Badge variant={victim.verified ? "default" : "secondary"}>
                          {victim.verified ? (t("admin.verifiedBadge") || "Verified") : (t("admin.pendingBadge") || "Pending")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {victim.photo_url ? (
                          <img
                            src={victim.photo_url}
                            alt="damage"
                            className="w-16 h-12 object-cover rounded cursor-pointer"
                            onClick={() => openDetail(victim)}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      <TableCell className="font-medium cursor-pointer" onClick={() => openDetail(victim)}>
                        {victim.full_name}
                      </TableCell>

                      <TableCell>{victim.phone_number}</TableCell>

                      <TableCell className="text-sm">
                        {victim.district}, {victim.ds_division}
                      </TableCell>

                      <TableCell>
                        {victim.latitude && victim.longitude ? (
                          <Button variant="ghost" size="sm" onClick={() => openGoogleMaps(victim.latitude!, victim.longitude!)}>
                            <MapPin className="h-4 w-4 mr-1" /> View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge className={damageColors[victim.damage_type] || ""}>
                          {victim.damage_type?.replace("_", " ") ?? "-"}
                        </Badge>
                      </TableCell>

                      <TableCell>{victim.family_members ?? "-"}</TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {victim.created_at ? format(new Date(victim.created_at), "MMM d, yyyy") : "-"}
                      </TableCell>

                      <TableCell className="flex gap-2">
                        {victim.verified ? (
                          <Button variant="ghost" size="sm" onClick={() => verifyVictim(victim.id, false)}>
                            <X className="h-4 w-4 mr-1" /> Unverify
                          </Button>
                        ) : (
                          <Button variant="default" size="sm" onClick={() => verifyVictim(victim.id, true)}>
                            <Check className="h-4 w-4 mr-1" /> Verify
                          </Button>
                        )}

                        <Button variant="outline" size="sm" onClick={() => openDetail(victim)}>
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} • Showing up to {PAGE_SIZE} per page
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={victims.length < PAGE_SIZE}>
              Next
            </Button>
          </div>
        </div>

        {/* Detail modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Victim Details</DialogTitle>
            </DialogHeader>

            {activeVictim ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  {activeVictim.photo_url ? (
                    <img src={activeVictim.photo_url} alt="damage" className="w-full h-64 object-cover rounded" />
                  ) : (
                    <div className="w-full h-64 bg-muted rounded flex items-center justify-center">No image</div>
                  )}
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold">{activeVictim.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{activeVictim.phone_number}</p>

                  <div className="mt-3 space-y-2 text-sm">
                    <div><strong>Location:</strong> {activeVictim.district}, {activeVictim.ds_division}, {activeVictim.gn_division}</div>
                    <div><strong>Damage:</strong> {activeVictim.damage_type?.replace("_", " ")}</div>
                    <div><strong>Family members:</strong> {activeVictim.family_members}</div>
                    <div><strong>Needs:</strong> {Array.isArray(activeVictim.essential_needs) ? activeVictim.essential_needs.join(", ") : (activeVictim.essential_needs ?? "-")}</div>
                    <div><strong>Verified:</strong> {activeVictim.verified ? "Yes" : "No"}</div>
                    <div><strong>Reported:</strong> {format(new Date(activeVictim.created_at), "PPP p")}</div>
                    <div>
                      <strong>Coordinates:</strong>{" "}
                      {activeVictim.latitude && activeVictim.longitude ? (
                        <Button variant="link" onClick={() => openGoogleMaps(activeVictim.latitude!, activeVictim.longitude!)}>
                          Open in Maps
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">No GPS</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {activeVictim.verified ? (
                      <Button variant="ghost" onClick={() => { verifyVictim(activeVictim.id, false); setDetailModalOpen(false); }}>
                        <X className="mr-2 h-4 w-4" /> Unverify
                      </Button>
                    ) : (
                      <Button variant="default" onClick={() => { verifyVictim(activeVictim.id, true); setDetailModalOpen(false); }}>
                        <Check className="mr-2 h-4 w-4" /> Verify
                      </Button>
                    )}

                    <Button variant="outline" onClick={() => { navigator.clipboard.writeText(activeVictim.phone_number || ""); toast.success("Phone copied"); }}>
                      Copy Phone
                    </Button>

                    <Button variant="ghost" onClick={() => { window.open(activeVictim.photo_url ?? "#", "_blank"); }}>
                      Open Photo
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}

            <DialogFooter>
              <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
