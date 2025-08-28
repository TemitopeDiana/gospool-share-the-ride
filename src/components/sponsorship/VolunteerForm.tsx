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
  resume_file: z.any().optional(), // Accept any type for file upload
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

interface VolunteerFormProps {
  open: boolean;
  onClose: () => void;
}

export const VolunteerForm = ({ open, onClose }: VolunteerFormProps) => {
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState<string>('');
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
      let resume_url = '';

      // Handle resume file upload
      if (data.resume_file && data.resume_file instanceof File) {
        const fileExt = data.resume_file.name.split('.').pop();
        const fileName = `resume-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('volunteer-resumes')
          .upload(fileName, data.resume_file);

        if (uploadError) {
          throw new Error('Failed to upload resume. Please try again.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('volunteer-resumes')
          .getPublicUrl(fileName);

        resume_url = publicUrlData?.publicUrl || '';
      }

      // Insert application data into volunteer_applications table
      const applicationData = {
        applicant_name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        preferred_areas: preferredAreas.join(', '),
        motivation: data.motivation,
        resume_url,
        applied_date: new Date().toISOString(),
        status: 'pending',
      };

      const { error } = await supabase
        .from('volunteer_applications')
        .insert([applicationData]);

      if (error) {
        throw new Error('Failed to submit application. Please try again.');
      }

      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notifications', {
          body: {
            type: 'volunteer_application',
            data: applicationData,
          },
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Application submitted!',
        description: "Thank you for your interest in volunteering. We'll review your application and get back to you soon.",
      });
      reset();
      setPreferredAreas([]);
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
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

  const handleAddArea = () => {
    if (newArea.trim() && !preferredAreas.includes(newArea.trim())) {
      setPreferredAreas([...preferredAreas, newArea.trim()]);
      setNewArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setPreferredAreas(preferredAreas.filter(a => a !== area));
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
                  <Label htmlFor="resume_file">Resume/CV File</Label>
                  <Input
                    id="resume_file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    {...register('resume_file')}
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
                <div className="flex gap-2">
                  <Input
                    id="new_area"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="Enter a volunteer area"
                  />
                  <Button type="button" onClick={handleAddArea}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferredAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="bg-gray-200 px-2 py-1 rounded">{area}</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveArea(area)}>
                        Remove
                      </Button>
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
