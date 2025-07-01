
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DonationFormProps {
  selectedCountry: string;
  selectedCurrency: string;
  onClose: () => void;
}

const DonationForm = ({ selectedCountry, selectedCurrency, onClose }: DonationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [isChristian, setIsChristian] = useState("");
  const [church, setChurch] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !amount || !isChristian) {
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

    toast({
      title: "Donation Submitted",
      description: "Thank you for your generous donation! We'll process it shortly.",
    });
    
    onClose();
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-3xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl text-gray-900 dark:text-white font-playfair">Complete Your Donation</CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
          Donating from {selectedCountry} in {selectedCurrency}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Amount to Donate *
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Are you a Christian? *
            </Label>
            <Select onValueChange={setIsChristian} required>
              <SelectTrigger className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="yes" className="dark:text-white text-lg py-3">Yes</SelectItem>
                <SelectItem value="no" className="dark:text-white text-lg py-3">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isChristian === "yes" && (
            <div>
              <Label htmlFor="church" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                What Church? *
              </Label>
              <Input
                id="church"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
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
            <Label htmlFor="anonymous" className="text-lg text-gray-700 dark:text-gray-300 font-poppins">
              Display my donation anonymously on the website
            </Label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-4 text-xl font-poppins font-semibold shadow-2xl rounded-2xl"
            >
              Submit Donation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-4 text-xl font-poppins font-semibold rounded-2xl"
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
