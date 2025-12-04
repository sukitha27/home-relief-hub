import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

type SupportType = "materials" | "money" | "labour";

export default function DonorRegistration() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    support_type: "" as SupportType | "",
    description: "",
  });

  const supportTypes = [
    { value: "materials", label: t("donorForm.materials") },
    { value: "money", label: t("donorForm.money") },
    { value: "labour", label: t("donorForm.labour") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.support_type) {
      toast.error(t("donorForm.selectSupportType"));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("donors").insert({
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
        support_type: formData.support_type as SupportType,
        description: formData.description || null,
      });

      if (error) throw error;

      toast.success(t("donorForm.successMessage"));
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || t("donorForm.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
              <Heart className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t("donorForm.title")}</h1>
            <p className="text-muted-foreground">
              {t("donorForm.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
            <div className="space-y-2">
              <Label htmlFor="name">{t("donorForm.name")} *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("donorForm.namePlaceholder")}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("donorForm.phoneNumber")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t("donorForm.phoneNumberPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("donorForm.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("donorForm.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_type">{t("donorForm.supportType")} *</Label>
              <Select
                value={formData.support_type}
                onValueChange={(value: SupportType) => setFormData({ ...formData, support_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("donorForm.selectSupportType")} />
                </SelectTrigger>
                <SelectContent>
                  {supportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("donorForm.description")}</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("donorForm.descriptionPlaceholder")}
              />
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("donorForm.submitting")}
                </>
              ) : (
                t("donorForm.submitRegistration")
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
