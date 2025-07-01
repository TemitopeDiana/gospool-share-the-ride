
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [preferredContact, setPreferredContact] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !amount || !preferredContact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountNumber = parseInt(amount.replace(/,/g, ''));
    if (amountNumber < 5000000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum amount for board membership is ₦5,000,000.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Thank you for your board membership application! We'll contact you soon.",
    });
    
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-2xl rounded-3xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl text-gray-900 dark:text-white font-playfair">Board Membership Application</CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-400 font-ibm-plex">
          Join our founding board of sponsors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="profilePicture" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
                Profile Picture *
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="churchDenomination" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Church Denomination (Optional)
            </Label>
            <Input
              id="churchDenomination"
              value={churchDenomination}
              onChange={(e) => setChurchDenomination(e.target.value)}
              className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
              placeholder="Enter your church denomination"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Amount (Minimum ₦5,000,000) *
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg"
              placeholder="₦5,000,000"
              required
            />
          </div>

          <div>
            <Label className="text-lg font-medium text-gray-700 dark:text-gray-300 font-poppins">
              Preferred Mode of Contact *
            </Label>
            <Select onValueChange={setPreferredContact} required>
              <SelectTrigger className="mt-2 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-xl text-lg">
                <SelectValue placeholder="Select preferred contact method" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="email" className="dark:text-white text-lg py-3">Email</SelectItem>
                <SelectItem value="phone" className="dark:text-white text-lg py-3">Phone</SelectItem>
                <SelectItem value="whatsapp" className="dark:text-white text-lg py-3">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white py-4 text-xl font-poppins font-semibold shadow-2xl rounded-2xl"
            >
              Submit Application
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

export default BoardMemberForm;
