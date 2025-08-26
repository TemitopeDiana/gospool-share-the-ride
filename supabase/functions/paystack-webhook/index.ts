import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Paystack webhook function started")

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

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not found')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('x-paystack-signature')
    
    const body = await req.text()
    console.log('Webhook received:', body)
    
    let event
    try {
      event = JSON.parse(body)
    } catch (e) {
      console.error('Invalid JSON in webhook body:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Webhook event:', event.event, 'Reference:', event.data?.reference)

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { reference, status, amount, currency } = event.data
      
      if (!reference) {
        console.error('No reference in webhook data')
        return new Response(
          JSON.stringify({ error: 'No reference provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Processing webhook for reference: ${reference}, status: ${status}`)

      // Find the transaction by reference
      const { data: transaction, error: fetchError } = await supabaseClient
        .from('paystack_transactions')
        .select('*')
        .eq('reference', reference)
        .single()

      if (fetchError || !transaction) {
        console.error('Transaction not found for reference:', reference, fetchError)
        return new Response(
          JSON.stringify({ error: 'Transaction not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Found transaction:', transaction.id, 'Current status:', transaction.status)

      // Update transaction status and webhook info
      const { error: updateError } = await supabaseClient
        .from('paystack_transactions')
        .update({
          status: status === 'success' ? 'success' : 'failed',
          webhook_received_at: new Date().toISOString(),
          webhook_payload: event,
          paystack_response: event.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id)

      if (updateError) {
        console.error('Error updating transaction:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update transaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update donation status if there's an associated donation
      if (transaction.donation_id) {
        const { error: donationError } = await supabaseClient
          .from('donations')
          .update({
            status: status === 'success' ? 'completed' : 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.donation_id)

        if (donationError) {
          console.error('Error updating donation:', donationError)
        } else {
          console.log('Updated donation status for:', transaction.donation_id)
        }

        // Send success email if payment succeeded
        if (status === 'success') {
          try {
            await supabaseClient.functions.invoke('send-donation-success-email', {
              body: { donationId: transaction.donation_id }
            })
            console.log('Success email sent for donation:', transaction.donation_id)
          } catch (emailError) {
            console.error('Error sending success email:', emailError)
          }

          // Send admin notification
          try {
            await supabaseClient.functions.invoke('send-admin-notifications', {
              body: { 
                donationId: transaction.donation_id,
                type: 'donation_completed'
              }
            })
            console.log('Admin notification sent for donation:', transaction.donation_id)
          } catch (notifError) {
            console.error('Error sending admin notification:', notifError)
          }
        }
      }

      console.log(`Successfully processed webhook for reference: ${reference}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook processed successfully',
          reference,
          status: status === 'success' ? 'success' : 'failed'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle other webhook events if needed
    console.log('Unhandled webhook event:', event.event)
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received but not processed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})