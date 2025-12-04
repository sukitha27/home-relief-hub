import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, MapPin, AlertTriangle, ShieldAlert } from "lucide-react";

const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    district: "",
    ds_division: "",
    gn_division: "",
    damage_type: "" as DamageType | "",
    family_members: 1,
    essential_needs: [] as string[],
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const damageTypes = [
    { value: "minor", label: t("victimForm.minor") },
    { value: "partial", label: t("victimForm.partial") },
    { value: "severe", label: t("victimForm.severe") },
    { value: "total_loss", label: t("victimForm.totalLoss") },
  ];

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        toast.success(t("victimForm.locationCaptured"));
        setGettingLocation(false);
      },
      (error) => {
        toast.error("Unable to get location: " + error.message);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acknowledged) {
      toast.error("Please acknowledge the privacy notice before submitting");
      return;
    }
    
    if (!formData.damage_type) {
      toast.error(t("victimForm.selectDamageType"));
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
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      if (error) throw error;

      toast.success(t("victimForm.successMessage"));
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || t("victimForm.errorMessage"));
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
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t("victimForm.title")}</h1>
            <p className="text-muted-foreground">
              {t("victimForm.subtitle")}
            </p>
          </div>

          {/* Privacy Notice Section */}
          <div className="mb-8 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Important Privacy Notice
                  </h3>
                  <div className="mt-3 space-y-3 text-sm text-amber-700 dark:text-amber-400">
                    <p>
                      <strong>Due to the emergency nature of this situation, all personal information submitted through this form (including name, phone number, and location) will be publicly visible to relief groups, volunteers, and anyone accessing this platform.</strong> This enables fast coordination during the crisis.
                    </p>
                    <p>
                      <strong>If you do not want your details to be shared publicly, please do not submit this form.</strong>
                    </p>
                    <p>
                      It is the sole responsibility of donors and volunteers to verify the authenticity of help requests before providing assistance. This platform serves only as a coordination tool and assumes no responsibility for any damages, losses, or outcomes arising from interactions facilitated through this service.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 pt-4 border-t border-amber-200 dark:border-amber-800">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="acknowledge" className="text-sm font-medium text-amber-800 dark:text-amber-300 cursor-pointer">
                      I understand and acknowledge that my personal information will be publicly visible
                    </Label>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                      You must check this box to proceed with registration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t("victimForm.fullName")} *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={t("victimForm.fullNamePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">{t("victimForm.phoneNumber")} *</Label>
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
                <Label htmlFor="district">{t("victimForm.district")} *</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("victimForm.selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ds_division">{t("victimForm.dsDivision")} *</Label>
                <Input
                  id="ds_division"
                  required
                  value={formData.ds_division}
                  onChange={(e) => setFormData({ ...formData, ds_division: e.target.value })}
                  placeholder={t("victimForm.dsDivisionPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gn_division">{t("victimForm.gnDivision")} *</Label>
                <Input
                  id="gn_division"
                  required
                  value={formData.gn_division}
                  onChange={(e) => setFormData({ ...formData, gn_division: e.target.value })}
                  placeholder={t("victimForm.gnDivisionPlaceholder")}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="damage_type">{t("victimForm.damageType")} *</Label>
                <Select
                  value={formData.damage_type}
                  onValueChange={(value: DamageType) => setFormData({ ...formData, damage_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("victimForm.selectDamageType")} />
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
                <Label htmlFor="family_members">{t("victimForm.familyMembers")} *</Label>
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
              <Label>{t("victimForm.essentialNeeds")}</Label>
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

            {/* GPS Location */}
            <div className="space-y-2">
              <Label>{t("victimForm.gpsLocation")}</Label>
              <p className="text-sm text-muted-foreground">{t("victimForm.gpsHelp")}</p>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getGPSLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("victimForm.gettingLocation")}
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      {t("victimForm.getLocation")}
                    </>
                  )}
                </Button>
                {formData.latitude && formData.longitude && (
                  <span className="text-sm text-success flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {t("victimForm.locationCaptured")}
                  </span>
                )}
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-muted-foreground">
                  Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">{t("victimForm.propertyPhoto")}</Label>
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

            <Button type="submit" className="w-full" size="lg" disabled={loading || !acknowledged}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("victimForm.submitting")}
                </>
              ) : (
                t("victimForm.submitReport")
              )}
            </Button>
            
            {!acknowledged && (
              <p className="text-center text-sm text-destructive">
                Please acknowledge the privacy notice above to submit your registration
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
