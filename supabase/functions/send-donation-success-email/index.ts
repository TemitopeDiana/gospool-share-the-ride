
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  donorEmail: string
  donorName: string
  amount: number
  currency: string
  reference: string
  donorType: string
  organizationName?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      donorEmail, 
      donorName, 
      amount, 
      currency, 
      reference, 
      donorType,
      organizationName 
    }: EmailRequest = await req.json()

    const displayName = donorType === 'organization' && organizationName 
      ? organizationName 
      : donorName

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d3748; margin-bottom: 20px;">Thank You for Your Generous Donation to Gospool</h2>
        
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">Dear Gospool Partner,</p>
        
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">
          Thank you for your generous donation to Gospool! Your support helps us keep this platform free and accessible, connecting the Christian community through safe, reliable rides.
        </p>
        
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">
          We pray the Lord blesses you abundantly for your kindness. As Philippians 4:19 reminds us, 
          <em>"And my God will meet all your needs according to the riches of his glory in Christ Jesus."</em> 
          Your contribution is vital in allowing us to meet the needs of our community, enabling more faithful journeys.
        </p>
        
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-bottom: 12px;">Donation Details:</h3>
          <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Amount:</strong> ${currency} ${amount.toLocaleString()}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
            <li><strong>Reference:</strong> ${reference}</li>
            ${donorType === 'organization' ? `<li><strong>Organization:</strong> ${organizationName}</li>` : ''}
          </ul>
        </div>
        
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">
          Blessings,<br>
          <strong>The Gospool Team</strong>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #718096; font-size: 14px; text-align: center;">
          This email confirms your donation to Gospool. If you have any questions, please contact our support team.
        </p>
      </div>
    `

    const emailResponse = await resend.emails.send({
      from: "Gospool <noreply@gospool.com>",
      to: [donorEmail],
      subject: "Thank You for Your Generous Donation to Gospool",
      html: emailHtml,
    })

    console.log("Donation success email sent:", emailResponse)

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error sending donation success email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
