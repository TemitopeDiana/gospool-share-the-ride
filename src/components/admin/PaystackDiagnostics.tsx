
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const PaystackDiagnostics = () => {
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  const { data: recentTransactions } = useQuery({
    queryKey: ['recent-paystack-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paystack_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      // Test Paystack connectivity and configuration
      const response = await fetch('/api/paystack-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          amount: 100, // Test with ₦1
        }),
      });

      const result = await response.json();
      setDiagnosticResults(result);
    } catch (error) {
      setDiagnosticResults({
        success: false,
        error: 'Failed to run diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paystack Diagnostics</h2>
        <p className="text-gray-600">Diagnose and troubleshoot Paystack integration issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Check</CardTitle>
          <CardDescription>Run comprehensive diagnostics on the Paystack integration</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={runDiagnostics}
            disabled={isRunningDiagnostics}
            className="mb-4"
          >
            {isRunningDiagnostics && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Diagnostics
          </Button>

          {diagnosticResults && (
            <Alert className={diagnosticResults.success ? 'border-green-200' : 'border-red-200'}>
              <div className="flex items-center">
                {diagnosticResults.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="ml-2">
                  {diagnosticResults.success ? 'All systems operational' : diagnosticResults.error}
                  {diagnosticResults.details && (
                    <div className="mt-2 text-sm text-gray-600">
                      Details: {diagnosticResults.details}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Monitor recent Paystack transaction activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions && recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">₦{Number(transaction.amount).toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{transaction.reference}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(transaction.status)} variant="secondary">
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Production Issues</CardTitle>
          <CardDescription>Quick fixes for common Paystack production problems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> "Invalid public key" error
              <br />
              <strong>Fix:</strong> Ensure you're using the live public key (pk_live_...) in production, not the test key (pk_test_...).
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> Webhook verification failures
              <br />
              <strong>Fix:</strong> Verify that your webhook URL is accessible and using HTTPS. Check that the secret key matches.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> CORS errors on payment initialization
              <br />
              <strong>Fix:</strong> Ensure your domain is added to Paystack's allowed origins in your dashboard settings.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> Transactions not updating after payment
              <br />
              <strong>Fix:</strong> Check webhook delivery logs in Paystack dashboard. Ensure your webhook endpoint is processing requests correctly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
