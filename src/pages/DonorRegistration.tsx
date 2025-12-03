import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

const supportTypes = [
  { value: "materials", label: "Materials (roof sheets, cement, wood, etc.)" },
  { value: "money", label: "Financial Donation" },
  { value: "labour", label: "Labour / Manpower" },
];

type SupportType = "materials" | "money" | "labour";

export default function DonorRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    support_type: "" as SupportType | "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.support_type) {
      toast.error("Please select a support type");
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

      toast.success("Thank you for your generosity! Your offer has been recorded.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit registration");
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
            <h1 className="mb-2 text-3xl font-bold text-foreground">Donate Support</h1>
            <p className="text-muted-foreground">
              Your generosity helps families rebuild their homes and lives.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
            <div className="space-y-2">
              <Label htmlFor="name">Name or Organization *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name or organization name"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07X XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_type">Type of Support *</Label>
              <Select
                value={formData.support_type}
                onValueChange={(value: SupportType) => setFormData({ ...formData, support_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select what you can offer" />
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
              <Label htmlFor="description">Description of Support</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe what you can offer in more detail (e.g., quantity of materials, amount of donation, availability for labour...)"
              />
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register as Donor"
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
