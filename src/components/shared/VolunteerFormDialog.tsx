import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VolunteerFormDialogProps {
  children: React.ReactNode;
}

export const VolunteerFormDialog = ({ children }: VolunteerFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    preferred_areas: '',
    resume: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string) => {
    setForm(f => ({ ...f, preferred_areas: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, resume: e.target.files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicant_name || !form.email || !form.preferred_areas) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let resume_url = '';

      // Handle resume file upload
      if (form.resume) {
        try {
          const fileExt = form.resume.name.split('.').pop();
          const fileName = `resume-${Date.now()}.${fileExt}`;
          
          console.log("Attempting to upload file to volunteer-resumes bucket");
          
          const { data, error: uploadError } = await supabase.storage
            .from('volunteer-resumes')
            .upload(fileName, form.resume);

          if (uploadError) {
            console.error("Storage error:", uploadError);
            throw new Error(`File upload failed: ${uploadError.message}`);
          }
          
          console.log("File uploaded successfully, getting public URL");
          
          // Get the public URL for the uploaded file - simplified approach
          const { data: publicUrlData } = supabase.storage
            .from('volunteer-resumes')
            .getPublicUrl(fileName);
          
          resume_url = publicUrlData.publicUrl;
          console.log("Generated public URL:", resume_url);
        } catch (uploadErr) {
          console.error("File upload error:", uploadErr);
          // Continue with form submission even if file upload fails
          // This makes sure the application is submitted even without a resume
        }
      }

      // Insert application data into volunteer_applications table
      console.log("Submitting application to database");
      
      // Simplified data structure to avoid potential issues
      const applicationData = {
        applicant_name: form.applicant_name,
        email: form.email,
        phone: form.phone || '',
        preferred_areas: form.preferred_areas,
        resume_url: resume_url || '',
        status: 'pending'
      };
      
      console.log("Application data:", applicationData);
      
      const { error: dbError } = await supabase
        .from('volunteer_applications')
        .insert(applicationData);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Submission failed: ${dbError.message}`);
      }

      console.log("Application submitted successfully");
      toast({
        title: "Success!",
        description: "Your volunteer application has been submitted successfully.",
      });

      setForm({ applicant_name: '', email: '', phone: '', preferred_areas: '', resume: null });
      setOpen(false);
    } catch (err: any) {
      console.error("Form submission error:", err);
      let errorMessage = 'Submission failed';
      
      if (err.message) {
        if (err.message.includes('violates row-level security policies')) {
          errorMessage = 'Access denied. This form requires proper permissions to submit.';
        } else {
          errorMessage = err.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Volunteer Application</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4" />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="applicant_name" 
            value={form.applicant_name} 
            onChange={handleChange} 
            placeholder="Full Name" 
            required 
          />
          
          <Input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="Email Address" 
            required 
          />
          
          <Input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="Phone Number" 
          />
          
          <div className="space-y-2">
            <label htmlFor="preferred_areas" className="text-sm font-medium">
              Preferred Volunteer Areas *
            </label>
            <Select value={form.preferred_areas} onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Customer support">Customer support</SelectItem>
                <SelectItem value="Technical support">Technical support</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Legal and Compliance">Legal and Compliance</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="resume" className="text-sm font-medium">
              Upload Resume/CV (PDF, DOC, DOCX)
            </label>
            <Input 
              name="resume" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFile}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-mint/10 file:text-brand-primary hover:file:bg-brand-mint/20"
            />
            <p className="text-xs text-gray-500">
              Please upload your resume or CV to help us understand your background and skills.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
