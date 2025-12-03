import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";

const skillsOptions = [
  { value: "carpentry", label: "Carpentry" },
  { value: "electrical", label: "Electrical Work" },
  { value: "plumbing", label: "Plumbing" },
  { value: "masonry", label: "Masonry" },
  { value: "general", label: "General Labour" },
];

type VolunteerSkill = "carpentry" | "electrical" | "plumbing" | "masonry" | "general";

export default function VolunteerRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    skills: [] as VolunteerSkill[],
    availability_start: "",
    availability_end: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("volunteers").insert({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        skills: formData.skills,
        availability_start: formData.availability_start || null,
        availability_end: formData.availability_end || null,
      });

      if (error) throw error;

      toast.success("Thank you for volunteering! We'll contact you when help is needed.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit registration");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: VolunteerSkill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSkillClick = (skill: VolunteerSkill, e: React.MouseEvent) => {
    // Prevent the checkbox's own handler from firing
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }
    toggleSkill(skill);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Volunteer Registration</h1>
            <p className="text-muted-foreground">
              Share your skills to help families rebuild their homes.
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

            <div className="space-y-3">
              <Label>Skills *</Label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {skillsOptions.map((skill) => (
                  <div
                    key={skill.value}
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      formData.skills.includes(skill.value as VolunteerSkill)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={(e) => handleSkillClick(skill.value as VolunteerSkill, e)}
                  >
                    <Checkbox
                      id={skill.value}
                      checked={formData.skills.includes(skill.value as VolunteerSkill)}
                      onCheckedChange={() => toggleSkill(skill.value as VolunteerSkill)}
                      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                    />
                    <Label 
                      htmlFor={skill.value} 
                      className="cursor-pointer font-normal flex-1"
                    >
                      {skill.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Availability (optional)</Label>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="availability_start" className="text-sm text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="availability_start"
                    type="date"
                    value={formData.availability_start}
                    onChange={(e) => setFormData({ ...formData, availability_start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability_end" className="text-sm text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="availability_end"
                    type="date"
                    value={formData.availability_end}
                    onChange={(e) => setFormData({ ...formData, availability_end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register as Volunteer"
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}