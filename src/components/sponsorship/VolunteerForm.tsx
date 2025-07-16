
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const volunteerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().min(20, 'Please tell us why you want to volunteer'),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal('')),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

interface VolunteerFormProps {
  open: boolean;
  onClose: () => void;
}

const VOLUNTEER_AREAS = [
  'Education & Tutoring',
  'Community Outreach',
  'Event Planning',
  'Social Media & Marketing',
  'Fundraising',
  'Administrative Support',
  'Technical Support',
  'Mentorship',
  'Content Creation',
  'Photography/Videography',
];

export const VolunteerForm = ({ open, onClose }: VolunteerFormProps) => {
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const submitApplication = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      // Use team_applications table for now with position_applied as "Volunteer"
      const applicationData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        experience: `${data.experience || ''}\n\nPreferred Areas: ${preferredAreas.join(', ')}`,
        motivation: data.motivation,
        position_applied: 'Volunteer',
        portfolio_url: data.portfolio_url || null,
        resume_url: data.resume_url || null,
      };

      const { error } = await supabase
        .from('team_applications')
        .insert([applicationData]);

      if (error) throw error;
      
      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notifications', {
          body: {
            type: 'volunteer_application',
            data: applicationData
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the form submission if email fails
      }
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Thank you for your interest in volunteering. We'll review your application and get back to you soon.",
      });
      reset();
      setPreferredAreas([]);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      console.error('Volunteer application error:', error);
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    if (preferredAreas.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one volunteer area.",
        variant: "destructive",
      });
      return;
    }
    submitApplication.mutate(data);
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setPreferredAreas([...preferredAreas, area]);
    } else {
      setPreferredAreas(preferredAreas.filter(a => a !== area));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Volunteer With Us</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <CardTitle>Join Our Community Impact Team</CardTitle>
            <CardDescription>
              Help us make a difference in our community. Fill out this form to apply as a volunteer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="Your full name"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="resume_url">Resume/CV URL</Label>
                  <Input
                    id="resume_url"
                    {...register('resume_url')}
                    placeholder="Link to your resume (optional)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Previous Volunteer Experience</Label>
                <Textarea
                  id="experience"
                  {...register('experience')}
                  placeholder="Tell us about any previous volunteer work or relevant experience..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                <Textarea
                  id="motivation"
                  {...register('motivation')}
                  placeholder="Share your motivation for volunteering..."
                  rows={3}
                />
                {errors.motivation && (
                  <p className="text-sm text-red-600 mt-1">{errors.motivation.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="portfolio_url">Portfolio/Website URL</Label>
                <Input
                  id="portfolio_url"
                  {...register('portfolio_url')}
                  placeholder="Link to your portfolio or website (optional)"
                />
              </div>

              <div>
                <Label>Preferred Volunteer Areas * (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {VOLUNTEER_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={preferredAreas.includes(area)}
                        onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                      />
                      <Label htmlFor={area} className="text-sm">{area}</Label>
                    </div>
                  ))}
                </div>
                {preferredAreas.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Please select at least one area</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitApplication.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
