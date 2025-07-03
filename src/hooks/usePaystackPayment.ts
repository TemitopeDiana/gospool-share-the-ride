
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  amount: number;
  email: string;
  donorName: string;
  phone: string;
  currency?: string;
  isAnonymous?: boolean;
  church?: string;
  isChristian?: string;
}

export const usePaystackPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializePayment = async (paymentData: PaymentData) => {
    setIsLoading(true);
    
    try {
      // Remove authentication requirement for donations
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: paymentData,
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      return data.data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { reference },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      return data.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
  };
};
