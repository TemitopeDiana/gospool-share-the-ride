
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Paystack verify function started")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not found')
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    console.log('Request body:', body)

    const { reference } = body
    
    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, error: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Verifying payment for reference: ${reference}`)

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!paystackResponse.ok) {
      console.error('Paystack API error:', paystackResponse.status)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify with Paystack' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paystackData = await paystackResponse.json()
    console.log('Paystack verification response:', paystackData.status, paystackData.data?.status)

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Failed to verify payment')
    }

    const transactionData = paystackData.data
    const paystackStatus = transactionData.status
    const transactionStatus = paystackStatus === 'success' ? 'success' : 'failed'

    // Update Paystack transaction record with enhanced tracking
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('paystack_transactions')
      .update({
        status: transactionStatus,
        paystack_response: paystackData.data,
        verification_attempts: 1,
        last_verification_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('reference', reference)
      .select()
      .single()

    if (transactionError) {
      console.error('Transaction update error:', transactionError)
      throw transactionError
    }

    console.log('Updated transaction:', transaction.id, 'to status:', transactionStatus)

    // Update donation status and get donation details
    let donation = null
    if (transaction.donation_id) {
      const donationStatus = transactionStatus === 'success' ? 'completed' : 'failed'
      
      const { data: donationData, error: donationError } = await supabaseClient
        .from('donations')
        .update({
          status: donationStatus,
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
      console.log('Updated donation:', donation.id, 'to status:', donationStatus)
    }

    // Send success email if payment was successful and we have donation details
    if (transactionStatus === 'success' && donation) {
      try {
        await supabaseClient.functions.invoke('send-donation-success-email', {
          body: { donationId: donation.id }
        })
        console.log('Success email sent for donation:', donation.id)
      } catch (emailError) {
        console.error('Failed to send success email:', emailError)
        // Don't fail the transaction if email fails
      }
      
      // Send admin notification for completed donations
      try {
        await supabaseClient.functions.invoke('send-admin-notifications', {
          body: {
            donationId: donation.id,
            type: 'donation_completed'
          }
        })
        console.log('Admin notification sent for donation:', donation.id)
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError)
        // Don't fail the transaction if admin email fails
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
          donation_id: transaction.donation_id
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
