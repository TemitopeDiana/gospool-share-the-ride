
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BoardMemberFormProps {
  onClose: () => void;
}

const BoardMemberForm = ({ onClose }: BoardMemberFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [churchDenomination, setChurchDenomination] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [memberType, setMemberType] = useState("individual");
  const [organizationName, setOrganizationName] = useState("");
  const { toast } = useToast();

  const currencies = [
    { value: "NGN", label: "Nigerian Naira (₦)", minimum: "5,000,000" },
    { value: "USD", label: "US Dollar ($)", minimum: "5,000" },
    { value: "GBP", label: "British Pound (£)", minimum: "4,000" },
    { value: "EUR", label: "Euro (€)", minimum: "4,500" },
    { value: "CAD", label: "Canadian Dollar ($)", minimum: "6,500" },
  ];

  const getMinimumAmount = (selectedCurrency: string) => {
    const currencyData = currencies.find(c => c.value === selectedCurrency);
    return currencyData?.minimum || "5,000";
  };

  const validateAmount = (amount: string, currency: string) => {
    if (!currency) return false;
    
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const minimumAmounts: { [key: string]: number } = {
      'NGN': 5000000,
      'USD': 5000,
      'GBP': 4000,
      'EUR': 4500,
      'CAD': 6500
    };
    
    return numericAmount >= minimumAmounts[currency];
  };

  const submitApplication = useMutation({
    mutationFn: async (data: any) => {
      console.log('Submitting sponsorship application:', data);
      
      const { data: result, error } = await supabase
        .from('sponsorship_applications')
        .insert([data])
        .select();

      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }
      
      console.log('Application inserted successfully:', result);
      
      // Send admin notification
      try {
        console.log('Sending admin notification...');
        const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('send-admin-notifications', {
          body: {
            type: 'sponsorship_application',
            data: data
          }
        });
        
        if (notificationError) {
          console.error('Notification error:', notificationError);
        } else {
          console.log('Notification sent successfully:', notificationResult);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the form submission if email fails
      }
      
      return result;
    },
    onSuccess: (data) => {
      console.log('Form submission successful:', data);
      toast({
        title: "Application Submitted",
        description: "Thank you for your impact sponsorship application! We'll contact you soon.",
      });
      onClose();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !amount || !currency || !preferredContact || (memberType === "organization" && !organizationName)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateAmount(amount, currency)) {
      const selectedCurrency = currencies.find(c => c.value === currency);
      toast({
        title: "Invalid Amount",
        description: `Minimum amount for impact sponsorship is ${selectedCurrency?.label} ${getMinimumAmount(currency)}.`,
        variant: "destructive",
      });
      return;
    }

    const applicationData = {
      sponsor_type: memberType,
      organization_name: memberType === "organization" ? organizationName : null,
      contact_person: fullName,
      email: email,
      phone: phone,
      sponsor_amount: parseFloat(amount.replace(/,/g, '')),
      sponsor_duration: currency, // Using currency as placeholder for duration
      motivation: `Church: ${churchDenomination || 'Not specified'}, Contact: ${preferredContact}`,
      address: null,
      profile_picture_url: null,
      status: 'pending'
    };

    submitApplication.mutate(applicationData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-4 sm:p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 sm:mx-auto">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-playfair">Impact Sponsorship Application</CardTitle>
        <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
          Join our founding community of impact sponsors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Sponsor Type *
            </Label>
            <Select onValueChange={setMemberType} value={memberType} required>
              <SelectTrigger className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                <SelectValue placeholder="Select sponsor type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="individual" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Individual</SelectItem>
                <SelectItem value="organization" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {memberType === "organization" && (
            <div>
              <Label htmlFor="organizationName" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Organization Name *
              </Label>
              <Input
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                placeholder="Enter organization name"
                required={memberType === "organization"}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="fullName" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="phone" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="profilePicture" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                {memberType === "organization" ? "Profile Picture / Logo *" : "Profile Picture *"}
              </Label>
              {memberType === "organization" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-ibm-plex">
                  You can use your organization's logo for this field
                </p>
              )}
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="churchDenomination" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Church Denomination (Optional)
            </Label>
            <Input
              id="churchDenomination"
              value={churchDenomination}
              onChange={(e) => setChurchDenomination(e.target.value)}
              className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter your church denomination"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Currency *
              </Label>
              <Select onValueChange={setCurrency} required>
                <SelectTrigger className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value} className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Amount {currency ? `(Min: ${getMinimumAmount(currency)})` : ''} *
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
                placeholder={currency ? getMinimumAmount(currency) : "Select currency first"}
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Preferred Mode of Contact *
            </Label>
            <Select onValueChange={setPreferredContact} required>
              <SelectTrigger className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                <SelectValue placeholder="Select preferred contact method" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="email" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Email</SelectItem>
                <SelectItem value="phone" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Phone</SelectItem>
                <SelectItem value="whatsapp" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              type="submit"
              disabled={submitApplication.isPending}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white px-8 py-4 text-base sm:text-lg font-poppins font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
            >
              {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-4 text-base sm:text-lg font-poppins font-semibold rounded-xl touch-manipulation"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BoardMemberForm;
