
// @ts-ignore - Edge function runtime types
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// @ts-ignore - Deno URL imports are valid in edge functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno URL imports are valid in edge functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Type declaration for Deno (needed for Edge Functions)
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { 
      amount, 
      email, 
      donorName, 
      phone, 
      currency = 'NGN', 
      isAnonymous = false, 
      showPublicly = true,
      church = '', 
      isChristian = '',
      donorType = 'individual',
      organizationName = '',
      organizationType = '',
      contactPerson = '',
      projectId
    } = await req.json()

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
          donor_type: donorType,
          organization_name: organizationName,
          organization_type: organizationType,
          contact_person: contactPerson,
          project_id: projectId, // Add project_id to metadata
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
        donor_name: donorType === 'individual' ? donorName : organizationName, // Always save the name for admin use
        donor_email: email,
        donor_phone: phone,
        is_anonymous: false, // Never anonymous from user submissions, only admins can change this
        show_publicly: showPublicly, // Respect user's privacy choice for public display
        status: 'pending',
        donor_type: donorType,
        organization_name: donorType === 'organization' ? organizationName : null,
        contact_person: donorType === 'organization' ? contactPerson : null,
        organization_type: donorType === 'organization' ? organizationType : null,
        church_name: church || null,
        belongs_to_church: isChristian || null,
        project_id: projectId || null, // Link donation to specific project if provided
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
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
