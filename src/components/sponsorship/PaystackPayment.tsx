
import { useEffect, useCallback, useRef } from 'react';
import { usePaystackPayment } from '@/hooks/usePaystackPayment';
import { useToast } from '@/hooks/use-toast';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  donorName: string;
  phone: string;
  currency: string;
  isAnonymous: boolean;
  church: string;
  isChristian: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

const PaystackPayment = ({
  amount,
  email,
  donorName,
  phone,
  currency,
  isAnonymous,
  church,
  isChristian,
  onSuccess,
  onError,
}: PaystackPaymentProps) => {
  const { initializePayment, verifyPayment, isLoading } = usePaystackPayment();
  const { toast } = useToast();
  const paymentInitialized = useRef(false);

  const handlePaymentSuccess = useCallback(async (response: any) => {
    try {
      await verifyPayment(response.reference);
      toast({
        title: "Payment Successful!",
        description: "Thank you for your donation. Your payment has been processed successfully.",
      });
      onSuccess();
    } catch (error) {
      console.error('Payment verification failed:', error);
      onError('Payment verification failed');
    }
  }, [verifyPayment, toast, onSuccess, onError]);

  const handlePaymentClose = useCallback(() => {
    toast({
      title: "Payment Cancelled",
      description: "You have cancelled the payment process.",
      variant: "destructive",
    });
  }, [toast]);

  const handlePayment = useCallback(async () => {
    if (paymentInitialized.current) return;
    
    try {
      paymentInitialized.current = true;
      
      const paymentData = await initializePayment({
        amount,
        email,
        donorName,
        phone,
        currency,
        isAnonymous,
        church,
        isChristian,
      });

      const handler = window.PaystackPop.setup({
        key: 'pk_live_1030aa73b63d2d22a4d02071a506a328de4ab853',
        email,
        amount: Math.round(amount * 100),
        currency,
        ref: paymentData.reference,
        metadata: {
          donor_name: donorName,
          phone,
          is_anonymous: isAnonymous,
          church,
          is_christian: isChristian,
        },
        callback: handlePaymentSuccess,
        onClose: handlePaymentClose,
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      paymentInitialized.current = false;
      onError(error.message || 'Payment failed');
    }
  }, [
    amount,
    email,
    donorName,
    phone,
    currency,
    isAnonymous,
    church,
    isChristian,
    initializePayment,
    handlePaymentSuccess,
    handlePaymentClose,
    onError
  ]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      // Wait a bit for Paystack to be fully initialized
      setTimeout(() => {
        if (window.PaystackPop && !paymentInitialized.current) {
          handlePayment();
        }
      }, 100);
    };
    script.onerror = () => {
      onError('Failed to load payment processor');
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handlePayment, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <span className="ml-3 text-lg">Initializing payment...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg mb-4">Redirecting to payment...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default PaystackPayment;
