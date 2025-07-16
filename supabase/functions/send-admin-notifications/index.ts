import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'sponsorship_application' | 'volunteer_application' | 'pitch_deck_request' | 'impact_report_request' | 'donation';
  data: any;
}

const getEmailTemplate = (type: string, data: any) => {
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@gospool.org";
  
  switch (type) {
    case 'sponsorship_application':
      return {
        subject: "New Sponsorship Application - Gospool Impact",
        html: `
          <h2>New Sponsorship Application</h2>
          <p><strong>Organization:</strong> ${data.organization_name || 'Individual'}</p>
          <p><strong>Contact Person:</strong> ${data.contact_person || data.email}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Sponsor Type:</strong> ${data.sponsor_type}</p>
          <p><strong>Amount:</strong> ${data.sponsor_amount ? `₦${data.sponsor_amount.toLocaleString()}` : 'Not specified'}</p>
          <p><strong>Duration:</strong> ${data.sponsor_duration || 'Not specified'}</p>
          <p><strong>Motivation:</strong> ${data.motivation || 'Not provided'}</p>
          <p><strong>Address:</strong> ${data.address || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Please review this application in the admin dashboard.</p>
        `
      };
    
    case 'volunteer_application':
      return {
        subject: "New Volunteer Application - Gospool Impact",
        html: `
          <h2>New Volunteer Application</h2>
          <p><strong>Name:</strong> ${data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Position:</strong> ${data.position_applied}</p>
          <p><strong>Experience:</strong> ${data.experience || 'Not provided'}</p>
          <p><strong>Motivation:</strong> ${data.motivation || 'Not provided'}</p>
          <p><strong>Resume:</strong> ${data.resume_url || 'Not provided'}</p>
          <p><strong>Portfolio:</strong> ${data.portfolio_url || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Please review this application in the admin dashboard.</p>
        `
      };
    
    case 'pitch_deck_request':
      return {
        subject: "New Pitch Deck Request - Gospool Impact",
        html: `
          <h2>New Pitch Deck Access Request</h2>
          <p><strong>Name:</strong> ${data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Organization:</strong> ${data.organization || 'Not provided'}</p>
          <p><strong>Role:</strong> ${data.role || 'Not provided'}</p>
          <p><strong>Purpose:</strong> ${data.purpose || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Please review this request and send the pitch deck if approved.</p>
        `
      };
    
    case 'impact_report_request':
      return {
        subject: "New Impact Report Request - Gospool Impact",
        html: `
          <h2>New Impact Report Request</h2>
          <p><strong>Name:</strong> ${data.requester_name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${data.requester_email}</p>
          <p><strong>Organization:</strong> ${data.organization || 'Not provided'}</p>
          <p><strong>Report Type:</strong> ${data.report_type || 'Not provided'}</p>
          <p><strong>Purpose:</strong> ${data.purpose || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Please review this request and send the impact report if approved.</p>
        `
      };
    
    case 'donation':
      return {
        subject: "New Donation Received - Gospool Impact",
        html: `
          <h2>New Donation Received</h2>
          <p><strong>Donor:</strong> ${data.is_anonymous ? 'Anonymous' : data.donor_name}</p>
          <p><strong>Email:</strong> ${data.donor_email}</p>
          <p><strong>Amount:</strong> ${data.currency || 'NGN'} ${data.amount.toLocaleString()}</p>
          <p><strong>Type:</strong> ${data.donor_type}</p>
          <p><strong>Organization:</strong> ${data.organization_name || 'Individual'}</p>
          <p><strong>Message:</strong> ${data.message || 'No message'}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Check the admin dashboard for full donation details.</p>
        `
      };
    
    default:
      return {
        subject: "New Request - Gospool Impact",
        html: `
          <h2>New Request Received</h2>
          <p>Type: ${type}</p>
          <p>Data: ${JSON.stringify(data, null, 2)}</p>
          <p>Submitted: ${new Date().toLocaleString()}</p>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    console.log(`Processing notification for type: ${type}`);
    
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (!adminEmail) {
      console.error("ADMIN_EMAIL not configured");
      return new Response(
        JSON.stringify({ error: "Admin email not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const emailTemplate = getEmailTemplate(type, data);
    
    const emailResponse = await resend.emails.send({
      from: "Gospool Impact <notifications@gospool.org>",
      to: [adminEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-admin-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);