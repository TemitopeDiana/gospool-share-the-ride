
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DownloadReportSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownloadRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your verified email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const requestData = {
        requester_email: email,
        requester_name: name || null,
        organization: organization || null,
        report_type: 'impact_report',
        purpose: purpose || 'Impact report download request',
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
            type: 'impact_report_request',
            data: requestData
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the form submission if email fails
      }
      
      toast({
        title: "Report Request Submitted",
        description: "If your email is verified as a donor/sponsor, you'll receive the impact report within 24 hours.",
      });
      
      setEmail("");
      setName("");
      setOrganization("");
      setPurpose("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-light-mint/10 via-white to-brand-mint/5 dark:from-gray-900 dark:via-gray-800 dark:to-brand-dark-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-mint dark:from-brand-mint dark:to-brand-light-mint bg-clip-text text-transparent mb-3 sm:mb-4">
            Impact Report
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-ibm-plex leading-relaxed">
            Verified donors and sponsors can request detailed reports on contributions and their impact.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <Card className="p-4 sm:p-6 dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-lg border border-brand-light-mint/30 dark:border-brand-mint/30 shadow-xl rounded-xl mx-4 sm:mx-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white font-playfair flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                Download Impact Report
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-ibm-plex">
                Enter your verified email to receive our latest impact report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDownloadRequest} className="space-y-4">
                <div>
                  <Label htmlFor="reportName" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 font-poppins">
                    Name (Optional)
                  </Label>
                  <Input
                    id="reportName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 h-10 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-lg text-sm sm:text-base touch-manipulation"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reportEmail" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 font-poppins">
                    Verified Email Address *
                  </Label>
                  <Input
                    id="reportEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-10 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-lg text-sm sm:text-base touch-manipulation"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="reportOrganization" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 font-poppins">
                    Organization (Optional)
                  </Label>
                  <Input
                    id="reportOrganization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="mt-2 h-10 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-lg text-sm sm:text-base touch-manipulation"
                    placeholder="Enter your organization name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reportPurpose" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 font-poppins">
                    Purpose (Optional)
                  </Label>
                  <Input
                    id="reportPurpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="mt-2 h-10 sm:h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-2 border-brand-light-mint/50 focus:border-brand-mint rounded-lg text-sm sm:text-base touch-manipulation"
                    placeholder="Brief description of intended use"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-2 sm:py-3 text-sm sm:text-base font-poppins font-semibold shadow-lg rounded-lg touch-manipulation"
                >
                  {isLoading ? "Processing..." : "Request Report"}
                </Button>
                
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center font-ibm-plex">
                  Reports are only sent to verified donor/sponsor email addresses
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DownloadReportSection;
