// Supabase Edge Function for sending pitch deck approval emails
// This runs in Deno environment - TypeScript errors are expected in VS Code


// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

// @ts-ignore - Deno global
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to_email, requester_name, pitch_deck_url } = await req.json()

    if (!to_email || !pitch_deck_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailData = {
      from: 'Gospool Impact <noreply@gospoolimpact.com>',
      to: [to_email],
      subject: 'Your Pitch Deck Request Has Been Approved - Gospool Impact',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pitch Deck Access Approved</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2D5A5A; margin: 0;">Gospool Impact</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Sharing the Ride, Sharing the Faith</p>
            </div>
            
            <h2 style="color: #2D5A5A; margin-bottom: 20px;">Pitch Deck Access Approved! 🎉</h2>
            
            <p>Hello ${requester_name || 'there'},</p>
            
            <p>Great news! Your request for access to our pitch deck has been approved. We're excited to share our vision and progress with you.</p>
            
            <div style="background-color: #E8F4F4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2D5A5A;">
              <h3 style="color: #2D5A5A; margin-top: 0;">📊 Your Pitch Deck</h3>
              <p style="margin: 10px 0;">You can now access our comprehensive pitch deck which includes:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Our mission and vision for transforming Christian transportation</li>
                <li>Current achievements and impact metrics</li>
                <li>Future plans and growth strategy</li>
                <li>Financial projections and funding requirements</li>
                <li>Partnership opportunities</li>
              </ul>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${pitch_deck_url}" style="display: inline-block; background-color: #2D5A5A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  📎 Download Pitch Deck
                </a>
              </div>
            </div>
            
            <div style="background-color: #FFF8E1; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #F57F17;">
                <strong>📝 Please Note:</strong> This pitch deck contains confidential information. Please do not share it without our explicit permission.
              </p>
            </div>
            
            <h3 style="color: #2D5A5A;">What's Next?</h3>
            <p>After reviewing our pitch deck, we'd love to hear from you! Whether you're interested in:</p>
            <ul>
              <li>🤝 Partnership opportunities</li>
              <li>💰 Investment discussions</li>
              <li>🌟 Sponsorship arrangements</li>
              <li>📞 A deeper conversation about our mission</li>
            </ul>
            
            <p>Feel free to reach out to us at <a href="mailto:contact@gospoolimpact.com" style="color: #2D5A5A;">contact@gospoolimpact.com</a> or reply to this email.</p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #F0F8F0; border-radius: 8px;">
              <h4 style="color: #2D5A5A; margin-top: 0;">🚌 About Gospool Impact</h4>
              <p style="margin: 0; font-size: 14px; color: #555;">
                We're on a mission to transform how Christians access church services, events, and conferences by removing transportation barriers. Our platform connects church members for safe, reliable ride-sharing while strengthening community bonds.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Thank you for your interest in Gospool Impact!
              </p>
              <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
                This email was sent to ${to_email}. If you have any questions, please contact us at contact@gospoolimpact.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }


    // Use Deno's global fetch
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    if (res.ok) {
      const data = await res.json()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      const error = await res.text()
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
