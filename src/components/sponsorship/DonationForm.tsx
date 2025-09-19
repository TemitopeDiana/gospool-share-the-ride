
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PaystackPayment from "./PaystackPayment";

interface DonationFormProps {
  selectedCountry: string;
  selectedCurrency: string;
  preSelectedProjectId?: string | null;
  preSelectedProjectTitle?: string | null;
  onClose: () => void;
}

const DonationForm = ({ selectedCountry, selectedCurrency, preSelectedProjectId, preSelectedProjectTitle, onClose }: DonationFormProps) => {
  const [donorType, setDonorType] = useState("individual");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(preSelectedProjectId || "");
  const [belongsToChurch, setBelongsToChurch] = useState("");
  const [church, setChurch] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [showPublicly, setShowPublicly] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const { trackDonationFunnel } = useAnalytics();

  // Fetch active projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Track donation funnel initiation
  useEffect(() => {
    trackDonationFunnel('initiated', undefined, {
      country: selectedCountry,
      currency: selectedCurrency,
    });
  }, [selectedCountry, selectedCurrency, trackDonationFunnel]);

  // Track form field completion
  const handleFieldChange = (field: string, value: string) => {
    const filledFields = [fullName, email, phone, amount].filter(Boolean).length;
    if (filledFields >= 2) {
      trackDonationFunnel('form_filled', undefined, {
        step: 'contact_details',
        completion_percentage: Math.round((filledFields / 4) * 100),
        donor_type: donorType,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCountry) {
      toast({
        title: "Country Required",
        description: "Please go back and select your country first.",
        variant: "destructive",
      });
      return;
    }
    
    // Validation for both donor types
    if (!email || !phone || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Individual-specific validation
    if (donorType === "individual") {
      if (!fullName || !belongsToChurch) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (belongsToChurch === "yes" && !church) {
        toast({
          title: "Missing Information",
          description: "Please specify your church.",
          variant: "destructive",
        });
        return;
      }
    }

    // Organization-specific validation
    if (donorType === "organization") {
      if (!organizationName || !contactPerson || !organizationType) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required organization fields.",
          variant: "destructive",
        });
        return;
      }
    }

    // Track payment initiation
    trackDonationFunnel('payment_started', parseFloat(amount), {
      donor_type: donorType,
      currency: selectedCurrency,
      country: selectedCountry,
      is_anonymous: false, // Always false for user submissions
    });

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Track successful donation
    trackDonationFunnel('completed', parseFloat(amount), {
      donor_type: donorType,
      currency: selectedCurrency,
      country: selectedCountry,
      is_anonymous: false, // Always false for user submissions
    });

    toast({
      title: "Donation Successful!",
      description: "Thank you for your generous donation. You will receive a confirmation email shortly.",
    });
    onClose();
  };

  const handlePaymentError = (error: string) => {
    // Track failed donation
    trackDonationFunnel('failed', parseFloat(amount) || 0, {
      donor_type: donorType,
      currency: selectedCurrency,
      country: selectedCountry,
      error: error,
    });

    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <Card className="max-w-2xl mx-auto p-4 sm:p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 sm:mx-auto">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white font-playfair">Complete Payment</CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
            Processing your donation of {selectedCurrency} {amount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaystackPayment
            amount={parseFloat(amount)}
            email={email}
            donorName={donorType === "individual" ? fullName : contactPerson}
            phone={phone}
            currency={selectedCurrency.split(' ')[0]}
            isAnonymous={false}
            showPublicly={showPublicly}
            church={church}
            isChristian={belongsToChurch}
            donorType={donorType}
            organizationName={organizationName}
            organizationType={organizationType}
            contactPerson={contactPerson}
            projectId={selectedProjectId || undefined}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPayment(false)}
              className="border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-3 px-6 text-lg font-poppins font-semibold rounded-xl touch-manipulation"
            >
              Cancel Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-4 sm:p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 sm:mx-auto">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white font-playfair">Complete Your Donation</CardTitle>
        <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
          Individuals and organizations can contribute from {selectedCountry} in {selectedCurrency}
        </CardDescription>
        {preSelectedProjectTitle && (
          <div className="mt-4 p-3 bg-gradient-to-r from-brand-light-mint/30 to-brand-mint/20 dark:from-brand-dark-teal/20 dark:to-brand-mint/10 rounded-lg border border-brand-mint/30">
            <p className="text-sm font-medium text-brand-primary dark:text-brand-mint font-poppins">
              🎯 Project Selected: {preSelectedProjectTitle}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Your donation will support this specific project
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Donor Type *
            </Label>
            <RadioGroup value={donorType} onValueChange={setDonorType} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="text-base text-gray-700 dark:text-gray-300 font-poppins">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization" className="text-base text-gray-700 dark:text-gray-300 font-poppins">Organization</Label>
              </div>
            </RadioGroup>
          </div>

          {donorType === "individual" ? (
            <>
              <div>
                <Label htmlFor="fullName" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    handleFieldChange('fullName', e.target.value);
                  }}
                  className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="organizationName" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                  Organization Name *
                </Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactPerson" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                  Contact Person *
                </Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              <div>
                <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                  Organization Type *
                </Label>
                <Select onValueChange={setOrganizationType} required>
                  <SelectTrigger className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="corporate" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Corporate</SelectItem>
                    <SelectItem value="ngo" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">NGO/Non-Profit</SelectItem>
                    <SelectItem value="church" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Church</SelectItem>
                    <SelectItem value="foundation" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Foundation</SelectItem>
                    <SelectItem value="other" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleFieldChange('email', e.target.value);
              }}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleFieldChange('phone', e.target.value);
              }}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Amount to Donate *
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                handleFieldChange('amount', e.target.value);
              }}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="project" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Support a Specific Project (Optional)
            </Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg">
                <SelectValue placeholder="Choose a project or donate to general fund" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">General Donation (No specific project)</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProjectId && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your donation will support this specific project
              </p>
            )}
          </div>

          {donorType === "individual" && (
            <>
              <div>
                <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                  Do you belong to a Church? *
                </Label>
                <Select onValueChange={setBelongsToChurch} required>
                  <SelectTrigger className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="yes" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Yes</SelectItem>
                    <SelectItem value="no" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {belongsToChurch === "yes" && (
                <div>
                  <Label htmlFor="church" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                    What Church? *
                  </Label>
                  <Input
                    id="church"
                    value={church}
                    onChange={(e) => setChurch(e.target.value)}
                    className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                    placeholder="Enter your church name"
                    required={belongsToChurch === "yes"}
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="showPublicly"
                checked={showPublicly}
                onCheckedChange={(checked) => setShowPublicly(checked as boolean)}
                className="border-2 border-brand-light-mint/50 data-[state=checked]:bg-brand-mint"
              />
              <Label htmlFor="showPublicly" className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-poppins">
                Show my donation in the public recent donors list
              </Label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-7 font-ibm-plex">
              {showPublicly 
                ? "Your donation will appear in our Recent Donors section to inspire others"
                : "Your donation will be kept private and won't appear in public donor lists"
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-3 sm:py-4 text-lg sm:text-xl font-poppins font-semibold rounded-xl sm:rounded-2xl touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-3 sm:py-4 text-lg sm:text-xl font-poppins font-semibold shadow-2xl rounded-xl sm:rounded-2xl touch-manipulation"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
