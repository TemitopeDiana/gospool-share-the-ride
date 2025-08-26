import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Verify pending payments function started")

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

    // Get pending transactions older than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const { data: pendingTransactions, error: fetchError } = await supabaseClient
      .from('paystack_transactions')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', fiveMinutesAgo)
      .lt('verification_attempts', 5) // Don't retry more than 5 times
      .order('created_at', { ascending: true })
      .limit(50) // Process max 50 at a time

    if (fetchError) {
      console.error('Error fetching pending transactions:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pending transactions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${pendingTransactions?.length || 0} pending transactions to verify`)

    if (!pendingTransactions || pendingTransactions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No pending transactions to verify', verified: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let verifiedCount = 0
    let errorCount = 0
    const results: any[] = []

    for (const transaction of pendingTransactions) {
      try {
        console.log(`Verifying transaction: ${transaction.reference}`)

        // Update verification attempts
        await supabaseClient
          .from('paystack_transactions')
          .update({
            verification_attempts: (transaction.verification_attempts || 0) + 1,
            last_verification_at: new Date().toISOString()
          })
          .eq('id', transaction.id)

        // Verify with Paystack API
        const verifyResponse = await fetch(
          `https://api.paystack.co/transaction/verify/${transaction.reference}`,
          {
            headers: {
              Authorization: `Bearer ${paystackSecretKey}`,
            },
          }
        )

        if (!verifyResponse.ok) {
          console.error(`Paystack API error for ${transaction.reference}:`, verifyResponse.status)
          errorCount++
          results.push({
            reference: transaction.reference,
            success: false,
            error: `Paystack API error: ${verifyResponse.status}`
          })
          continue
        }

        const verifyData = await verifyResponse.json()
        console.log(`Paystack verification response for ${transaction.reference}:`, verifyData.status, verifyData.data?.status)

        if (!verifyData.status) {
          console.error(`Paystack verification failed for ${transaction.reference}:`, verifyData.message)
          errorCount++
          results.push({
            reference: transaction.reference,
            success: false,
            error: verifyData.message || 'Verification failed'
          })
          continue
        }

        const paystackStatus = verifyData.data?.status
        let newStatus = 'pending'

        if (paystackStatus === 'success') {
          newStatus = 'success'
        } else if (paystackStatus === 'failed' || paystackStatus === 'abandoned') {
          newStatus = 'failed'
        }

        // Update transaction status
        const { error: updateError } = await supabaseClient
          .from('paystack_transactions')
          .update({
            status: newStatus,
            paystack_response: verifyData.data,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id)

        if (updateError) {
          console.error(`Error updating transaction ${transaction.reference}:`, updateError)
          errorCount++
          results.push({
            reference: transaction.reference,
            success: false,
            error: 'Database update failed'
          })
          continue
        }

        // Update donation status if there's an associated donation and status changed
        if (transaction.donation_id && newStatus !== 'pending') {
          const donationStatus = newStatus === 'success' ? 'completed' : 'failed'
          
          const { error: donationError } = await supabaseClient
            .from('donations')
            .update({
              status: donationStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', transaction.donation_id)

          if (donationError) {
            console.error(`Error updating donation ${transaction.donation_id}:`, donationError)
          } else {
            console.log(`Updated donation ${transaction.donation_id} to ${donationStatus}`)
          }

          // Send success email and admin notification for successful payments
          if (newStatus === 'success') {
            try {
              await supabaseClient.functions.invoke('send-donation-success-email', {
                body: { donationId: transaction.donation_id }
              })
              console.log('Success email sent for donation:', transaction.donation_id)
            } catch (emailError) {
              console.error('Error sending success email:', emailError)
            }

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

        if (newStatus !== 'pending') {
          verifiedCount++
          results.push({
            reference: transaction.reference,
            success: true,
            oldStatus: 'pending',
            newStatus: newStatus
          })
          console.log(`Successfully updated transaction ${transaction.reference} from pending to ${newStatus}`)
        } else {
          results.push({
            reference: transaction.reference,
            success: true,
            oldStatus: 'pending',
            newStatus: 'pending',
            message: 'Still pending'
          })
        }

      } catch (error) {
        console.error(`Error processing transaction ${transaction.reference}:`, error)
        errorCount++
        results.push({
          reference: transaction.reference,
          success: false,
          error: error.message || 'Unknown error'
        })
      }
    }

    console.log(`Verification complete. Verified: ${verifiedCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${pendingTransactions.length} transactions`,
        verified: verifiedCount,
        errors: errorCount,
        results
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Verify pending payments error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})