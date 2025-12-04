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
  MoreVertical,
  Phone,
  Calendar,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  minor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  severe: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  total_loss: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function Admin() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  // data + UI state
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // filters / search / sort / pagination
  const [query, setQuery] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string | null>(null);
  const [filterDamage, setFilterDamage] = useState<string | null>(null);
  const [filterVerified, setFilterVerified] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<{ col: string; asc: boolean }>({
    col: "created_at",
    asc: false,
  });
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;

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

  // realtime subscription
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

  // handle sorting by column
  const handleSort = (col: string) => {
    setSortBy((prev) => {
      if (prev.col === col) return { col, asc: !prev.asc };
      return { col, asc: false };
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">{t("admin.title") || "Admin Dashboard"}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("admin.analytics") || "Manage victims, donors & volunteers"}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate max-w-[200px]">
              {user?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setPage(1); fetchVictims(); }} 
              disabled={loading}
              className="h-9 px-2 sm:px-4"
            >
              <RefreshCw className={`h-4 w-4 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="h-9 px-2 sm:px-4"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone or district..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="pl-10 h-10"
            />
          </div>

          {/* Filters Toggle Button (Mobile) */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {showFilters ? "(Hide)" : "(Show)"}
            </Button>

            {/* Bulk Actions Dropdown (Mobile) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={selectAllOnPage}>
                  Select All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearSelection}>
                  Clear Selection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkVerify(true)}>
                  Verify Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkVerify(false)}>
                  Unverify Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportSelectedCSV}>
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filters (Responsive) */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select
                onValueChange={(v) => {
                  setFilterDistrict(v === "all" ? null : v);
                  setPage(1);
                }}
                value={filterDistrict ?? "all"}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-10">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) => {
                  setFilterDamage(v === "all" ? null : v);
                  setPage(1);
                }}
                value={filterDamage ?? "all"}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <SelectValue placeholder="Damage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Damage</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="total_loss">Total Loss</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) => {
                  setFilterVerified(v === "all" ? null : v);
                  setPage(1);
                }}
                value={filterVerified ?? "all"}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              {/* Bulk Actions (Desktop) */}
              <div className="hidden sm:flex gap-2 ml-auto">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAllOnPage}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => bulkVerify(true)} 
                    disabled={selectedIds.size === 0}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => bulkVerify(false)} 
                    disabled={selectedIds.size === 0}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Unverify
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportSelectedCSV}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Home className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Total</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold">{victims.length}</div>
              <p className="text-xs text-muted-foreground truncate">
                {victims.filter(v => v.verified).length} verified
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {victims.filter(v => !v.verified).length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Families</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                {victims.reduce((acc, v) => acc + (v.family_members || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Members</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Mapped</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                {victims.filter(v => v.latitude && v.longitude).length}
              </div>
              <p className="text-xs text-muted-foreground">With GPS</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[800px] sm:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 px-2">
                        <input
                          type="checkbox"
                          checked={victims.length > 0 && victims.every((v) => selectedIds.has(v.id))}
                          onChange={(e) => (e.target.checked ? selectAllOnPage() : clearSelection())}
                          className="h-4 w-4"
                        />
                      </TableHead>
                      <TableHead className="px-2 sm:px-4">Status</TableHead>
                      <TableHead className="px-2 sm:px-4">Photo</TableHead>
                      <TableHead className="px-2 sm:px-4">Name</TableHead>
                      <TableHead className="hidden sm:table-cell px-2 sm:px-4">Phone</TableHead>
                      <TableHead className="px-2 sm:px-4">Location</TableHead>
                      <TableHead className="hidden md:table-cell px-2 sm:px-4">GPS</TableHead>
                      <TableHead className="px-2 sm:px-4">Damage</TableHead>
                      <TableHead className="hidden md:table-cell px-2 sm:px-4">Family</TableHead>
                      <TableHead className="hidden lg:table-cell px-2 sm:px-4">Date</TableHead>
                      <TableHead className="px-2 sm:px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {victims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          No victims found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      victims.map((victim) => (
                        <TableRow key={victim.id} className={selectedIds.has(victim.id) ? "bg-muted/30" : ""}>
                          <TableCell className="px-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(victim.id)}
                              onChange={() => toggleSelect(victim.id)}
                              className="h-4 w-4"
                            />
                          </TableCell>

                          <TableCell className="px-2 sm:px-4">
                            <Badge 
                              variant={victim.verified ? "default" : "outline"} 
                              className="text-xs"
                            >
                              {victim.verified ? "✓" : "Pending"}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-2 sm:px-4">
                            {victim.photo_url ? (
                              <div className="w-12 h-12 sm:w-16 sm:h-12 overflow-hidden rounded cursor-pointer" onClick={() => openDetail(victim)}>
                                <img
                                  src={victim.photo_url}
                                  alt="damage"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          <TableCell className="px-2 sm:px-4 font-medium">
                            <button 
                              onClick={() => openDetail(victim)}
                              className="text-left hover:text-primary transition-colors"
                            >
                              <div className="truncate max-w-[100px] sm:max-w-[150px]">
                                {victim.full_name}
                              </div>
                            </button>
                          </TableCell>

                          <TableCell className="hidden sm:table-cell px-2 sm:px-4">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[120px]">{victim.phone_number}</span>
                            </div>
                          </TableCell>

                          <TableCell className="px-2 sm:px-4">
                            <div className="text-xs sm:text-sm">
                              <div className="truncate max-w-[80px] sm:max-w-[120px]">{victim.district}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]">
                                {victim.ds_division}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="hidden md:table-cell px-2 sm:px-4">
                            {victim.latitude && victim.longitude ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openGoogleMaps(victim.latitude!, victim.longitude!)}
                                className="h-8 px-2"
                              >
                                <MapPin className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">Map</span>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>

                          <TableCell className="px-2 sm:px-4">
                            <Badge 
                              className={`text-xs ${damageColors[victim.damage_type] || "bg-gray-100 text-gray-800"}`}
                            >
                              <span className="hidden sm:inline">
                                {victim.damage_type?.replace("_", " ") || "-"}
                              </span>
                              <span className="sm:hidden">
                                {victim.damage_type?.charAt(0).toUpperCase() || "-"}
                              </span>
                            </Badge>
                          </TableCell>

                          <TableCell className="hidden md:table-cell px-2 sm:px-4">
                            {victim.family_members || "-"}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell px-2 sm:px-4">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {victim.created_at ? format(new Date(victim.created_at), "MMM d") : "-"}
                            </div>
                          </TableCell>

                          <TableCell className="px-2 sm:px-4">
                            <div className="flex gap-1">
                              {victim.verified ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => verifyVictim(victim.id, false)}
                                  className="h-8 px-2"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={() => verifyVictim(victim.id, true)}
                                  className="h-8 px-2"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openDetail(victim)}
                                className="h-8 px-2"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Page {page} • Showing {victims.length} of many
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage((p) => p + 1)} 
              disabled={victims.length < PAGE_SIZE}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Detail Modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Victim Details</DialogTitle>
            </DialogHeader>

            {activeVictim ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  {activeVictim.photo_url ? (
                    <div className="relative w-full h-48 md:h-64">
                      <img 
                        src={activeVictim.photo_url} 
                        alt="damage" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 md:h-64 bg-muted rounded-lg flex items-center justify-center">
                      No image available
                    </div>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{activeVictim.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{activeVictim.phone_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">District</p>
                      <p className="text-sm">{activeVictim.district}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">DS Division</p>
                      <p className="text-sm">{activeVictim.ds_division}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GN Division</p>
                      <p className="text-sm">{activeVictim.gn_division}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Damage</p>
                      <Badge className={damageColors[activeVictim.damage_type]}>
                        {activeVictim.damage_type?.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Family Members</p>
                      <p className="text-sm">{activeVictim.family_members || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant={activeVictim.verified ? "default" : "outline"}>
                        {activeVictim.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Essential Needs</p>
                    <p className="text-sm">
                      {Array.isArray(activeVictim.essential_needs) 
                        ? activeVictim.essential_needs.join(", ") 
                        : (activeVictim.essential_needs ?? "None specified")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Reported</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activeVictim.created_at), "PPP")}
                      </p>
                    </div>
                    {activeVictim.latitude && activeVictim.longitude && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Coordinates</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openGoogleMaps(activeVictim!.latitude!, activeVictim!.longitude!)}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Open in Maps
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {activeVictim.verified ? (
                      <Button 
                        variant="ghost" 
                        onClick={() => { verifyVictim(activeVictim.id, false); setDetailModalOpen(false); }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Unverify
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        onClick={() => { verifyVictim(activeVictim.id, true); setDetailModalOpen(false); }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      onClick={() => { 
                        navigator.clipboard.writeText(activeVictim.phone_number); 
                        toast.success("Phone number copied"); 
                      }}
                    >
                      Copy Phone
                    </Button>

                    {activeVictim.photo_url && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(activeVictim.photo_url!, "_blank")}
                      >
                        Open Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}