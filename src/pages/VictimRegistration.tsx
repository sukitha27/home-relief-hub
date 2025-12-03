import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

const damageTypes = [
  { value: "minor", label: "Minor Damage" },
  { value: "partial", label: "Partial Damage" },
  { value: "severe", label: "Severe Damage" },
  { value: "total_loss", label: "Total Loss" },
];

const needsOptions = [
  "Roof sheets",
  "Cement",
  "Wood",
  "Labour",
  "Bricks",
  "Electrical supplies",
  "Plumbing materials",
  "Tools",
];

type DamageType = "minor" | "partial" | "severe" | "total_loss";

export default function VictimRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    district: "",
    ds_division: "",
    gn_division: "",
    damage_type: "" as DamageType | "",
    family_members: 1,
    essential_needs: [] as string[],
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.damage_type) {
      toast.error("Please select a damage type");
      return;
    }

    setLoading(true);

    try {
      let photo_url = null;

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("victim-photos")
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("victim-photos")
          .getPublicUrl(fileName);
        
        photo_url = publicUrl;
      }

      const { error } = await supabase.from("victims").insert({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        district: formData.district,
        ds_division: formData.ds_division,
        gn_division: formData.gn_division,
        damage_type: formData.damage_type as DamageType,
        family_members: formData.family_members,
        essential_needs: formData.essential_needs,
        photo_url,
      });

      if (error) throw error;

      toast.success("Registration successful! We'll connect you with help soon.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit registration");
    } finally {
      setLoading(false);
    }
  };

  const toggleNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      essential_needs: prev.essential_needs.includes(need)
        ? prev.essential_needs.filter((n) => n !== need)
        : [...prev.essential_needs, need],
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Report Home Damage</h1>
            <p className="text-muted-foreground">
              Register your family to receive assistance for rebuilding your home.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="07X XXX XXXX"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g., Colombo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ds_division">DS Division *</Label>
                <Input
                  id="ds_division"
                  required
                  value={formData.ds_division}
                  onChange={(e) => setFormData({ ...formData, ds_division: e.target.value })}
                  placeholder="Divisional Secretariat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gn_division">GN Division *</Label>
                <Input
                  id="gn_division"
                  required
                  value={formData.gn_division}
                  onChange={(e) => setFormData({ ...formData, gn_division: e.target.value })}
                  placeholder="Grama Niladhari"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="damage_type">Type of Damage *</Label>
                <Select
                  value={formData.damage_type}
                  onValueChange={(value: DamageType) => setFormData({ ...formData, damage_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select damage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {damageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_members">Family Members *</Label>
                <Input
                  id="family_members"
                  type="number"
                  min={1}
                  required
                  value={formData.family_members}
                  onChange={(e) => setFormData({ ...formData, family_members: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Essential Needs</Label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {needsOptions.map((need) => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={formData.essential_needs.includes(need)}
                      onCheckedChange={() => toggleNeed(need)}
                    />
                    <Label htmlFor={need} className="text-sm font-normal cursor-pointer">
                      {need}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo of Damage (optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {photoFile && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {photoFile.name}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
