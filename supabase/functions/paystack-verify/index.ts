
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

    const { reference } = await req.json()

    if (!reference) {
      throw new Error('Missing reference')
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Failed to verify payment')
    }

    const transactionData = paystackData.data
    const transactionStatus = transactionData.status === 'success' ? 'completed' : 'failed'

    // Update Paystack transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('paystack_transactions')
      .update({
        status: transactionStatus,
        paystack_response: paystackData,
        updated_at: new Date().toISOString(),
      })
      .eq('reference', reference)
      .select()
      .single()

    if (transactionError) {
      console.error('Transaction update error:', transactionError)
      throw transactionError
    }

    // Update donation status and get donation details
    let donation = null
    if (transaction.donation_id) {
      const { data: donationData, error: donationError } = await supabaseClient
        .from('donations')
        .update({
          status: transactionStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.donation_id)
        .select()
        .single()

      if (donationError) {
        console.error('Donation update error:', donationError)
        throw donationError
      }

      donation = donationData
    }

    // Send success email if payment was successful and we have donation details
    if (transactionStatus === 'completed' && donation) {
      try {
        await supabaseClient.functions.invoke('send-donation-success-email', {
          body: {
            donorEmail: donation.donor_email,
            donorName: donation.donor_name || donation.contact_person,
            amount: donation.amount,
            currency: donation.currency || 'NGN',
            reference: reference,
            donorType: donation.donor_type || 'individual',
            organizationName: donation.organization_name,
          },
        })
        console.log('Success email sent for donation:', donation.id)
      } catch (emailError) {
        console.error('Failed to send success email:', emailError)
        // Don't fail the transaction if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          status: transactionStatus,
          reference,
          amount: transactionData.amount / 100, // Convert from kobo
          currency: transactionData.currency,
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
