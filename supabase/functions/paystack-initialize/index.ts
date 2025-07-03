
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { amount, email, donorName, phone, currency = 'NGN', isAnonymous = false, church = '', isChristian = '' } = await req.json()

    if (!amount || !email) {
      throw new Error('Missing required fields: amount and email')
    }

    // Generate unique reference
    const reference = `gospool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Initialize transaction with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference,
        amount: Math.round(amount * 100), // Convert to kobo
        email,
        currency,
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-verify`,
        metadata: {
          donor_name: donorName,
          phone,
          is_anonymous: isAnonymous,
          church,
          is_christian: isChristian,
        }
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Failed to initialize payment')
    }

    // Create donation record without requiring user authentication
    const { data: donation, error: donationError } = await supabaseClient
      .from('donations')
      .insert({
        user_id: null, // Allow anonymous donations
        amount,
        currency,
        donor_name: isAnonymous ? null : donorName,
        donor_email: email,
        donor_phone: phone,
        is_anonymous: isAnonymous,
        status: 'pending',
      })
      .select()
      .single()

    if (donationError) {
      console.error('Donation creation error:', donationError)
      throw donationError
    }

    // Create Paystack transaction record
    const { error: transactionError } = await supabaseClient
      .from('paystack_transactions')
      .insert({
        donation_id: donation.id,
        reference,
        amount,
        currency,
        status: 'pending',
        paystack_response: paystackData,
      })

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
      throw transactionError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          authorization_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code,
          reference,
          donation_id: donation.id,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
