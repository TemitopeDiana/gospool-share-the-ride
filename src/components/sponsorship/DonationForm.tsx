import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PaystackPayment from "./PaystackPayment";

interface DonationFormProps {
  selectedCountry: string;
  selectedCurrency: string;
  onClose: () => void;
}

const DonationForm = ({ selectedCountry, selectedCurrency, onClose }: DonationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isChristian, setIsChristian] = useState("");
  const [church, setChurch] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

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
    
    if (!fullName || !email || !phone || !amount || !isChristian) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isChristian === "yes" && !church) {
      toast({
        title: "Missing Information",
        description: "Please specify your church.",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Donation Successful!",
      description: "Thank you for your generous donation. You will receive a confirmation email shortly.",
    });
    onClose();
  };

  const handlePaymentError = (error: string) => {
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
            donorName={fullName}
            phone={phone}
            currency={selectedCurrency.split(' ')[0]} // Extract currency code (NGN from "NGN (₦)")
            isAnonymous={isAnonymous}
            church={church}
            isChristian={isChristian}
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
          Donating from {selectedCountry} in {selectedCurrency}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
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
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter your email address"
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
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter your phone number"
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
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Are you a Christian? *
            </Label>
            <Select onValueChange={setIsChristian} required>
              <SelectTrigger className="mt-2 h-12 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-base sm:text-lg touch-manipulation">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="yes" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">Yes</SelectItem>
                <SelectItem value="no" className="dark:text-white text-base sm:text-lg py-3 touch-manipulation">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isChristian === "yes" && (
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
                required={isChristian === "yes"}
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="border-2 border-brand-light-mint/50 data-[state=checked]:bg-brand-mint"
            />
            <Label htmlFor="anonymous" className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-poppins">
              Display my donation anonymously on the website
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-3 sm:py-4 text-lg sm:text-xl font-poppins font-semibold shadow-2xl rounded-xl sm:rounded-2xl touch-manipulation"
            >
              Continue to Payment
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-3 sm:py-4 text-lg sm:text-xl font-poppins font-semibold rounded-xl sm:rounded-2xl touch-manipulation"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
