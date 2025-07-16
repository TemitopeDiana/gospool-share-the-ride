
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PitchDeckFormProps {
  onClose: () => void;
}

const PitchDeckForm = ({ onClose }: PitchDeckFormProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        requester_email: email,
        requester_name: fullName,
        organization: organization || null,
        report_type: 'pitch_deck',
        purpose: purpose || 'Pitch deck access request',
        status: 'pending' as const
      };

      const { error } = await supabase
        .from('impact_reports_requests')
        .insert([requestData]);

      if (error) throw error;
      
      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notifications', {
          body: {
            type: 'pitch_deck_request',
            data: { ...requestData, full_name: fullName, role: role }
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the form submission if email fails
      }
      
      toast({
        title: "Success!",
        description: "Your pitch deck request has been submitted. We'll review it and send access if approved.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-playfair text-center">
            Access Gospool Pitch Deck
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="organization" className="text-sm font-medium">
                Organization (Optional)
              </Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-medium">
                Role (Optional)
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your role/position"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="purpose" className="text-sm font-medium">
                Purpose (Optional)
              </Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Brief description of intended use"
                className="mt-1"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your details to request access to our comprehensive pitch deck outlining current achievements and future plans for Gospool.
            </p>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Request Pitch Deck Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PitchDeckForm;
