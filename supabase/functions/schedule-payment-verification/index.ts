import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Schedule payment verification function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Setting up automatic verification schedule...')

    // Create cron job to run verify-pending-payments every 15 minutes
    const { data, error } = await supabaseClient.rpc('schedule_payment_verification')

    if (error) {
      console.error('Error setting up cron job:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to schedule verification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Payment verification scheduled successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verification scheduled every 15 minutes',
        data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Schedule verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})