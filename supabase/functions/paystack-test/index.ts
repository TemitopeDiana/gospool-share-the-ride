
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaystackTestRequest {
  test: boolean;
  amount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { test, amount }: PaystackTestRequest = await req.json();
    
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    
    if (!paystackSecretKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Paystack secret key not configured",
        details: "PAYSTACK_SECRET_KEY environment variable is missing"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Test Paystack API connectivity
    const testResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        amount: amount * 100, // Convert to kobo
        callback_url: "https://example.com/callback",
      }),
    });

    const testResult = await testResponse.json();

    if (testResponse.ok && testResult.status) {
      return new Response(JSON.stringify({
        success: true,
        message: "Paystack API is accessible",
        details: {
          status: testResult.status,
          reference: testResult.data?.reference,
          authorization_url: testResult.data?.authorization_url
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Paystack API error",
        details: testResult.message || "Unknown Paystack error"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Paystack test error:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: "Test failed",
      details: error.message || "Unknown error occurred"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
