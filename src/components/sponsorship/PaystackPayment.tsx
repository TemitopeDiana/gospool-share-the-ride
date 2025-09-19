/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useCallback, useRef, useState } from 'react';
import { usePaystackPayment } from '@/hooks/usePaystackPayment';
import { useToast } from '@/hooks/use-toast';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  donorName: string;
  phone: string;
  currency: string;
  isAnonymous: boolean; // Keep for backward compatibility but always false from form
  showPublicly: boolean;
  church: string;
  isChristian: string;
  donorType?: string;
  organizationName?: string;
  organizationType?: string;
  contactPerson?: string;
  projectId?: string; // Add project_id support
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
  showPublicly,
  church,
  isChristian,
  donorType = 'individual',
  organizationName,
  organizationType,
  contactPerson,
  projectId,
  onSuccess,
  onError,
}: PaystackPaymentProps) => {
  const { initializePayment, verifyPayment, isLoading } = usePaystackPayment();
  const { toast } = useToast();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Initialize payment data when component mounts
  useEffect(() => {
    const initPaymentData = async () => {
      try {
        console.log('Initializing payment with data:', {
          amount,
          email,
          donorName,
          phone,
          currency,
          isAnonymous,
          church,
          isChristian,
          donorType,
          organizationName,
          organizationType,
          contactPerson,
        });
        
        const data = await initializePayment({
          amount,
          email,
          donorName,
          phone,
          currency,
          isAnonymous,
          showPublicly,
          church,
          isChristian,
          donorType,
          organizationName,
          organizationType,
          contactPerson,
          projectId,
        });
        
        console.log('Payment initialization successful:', data);
        setPaymentData(data);
      } catch (error) {
        console.error('Payment initialization error:', error);
        onError(error.message || 'Failed to initialize payment');
      }
    };

    initPaymentData();
  }, []);

  // Load Paystack script
  useEffect(() => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => onError('Failed to load payment processor');
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const handlePaymentSuccess = async (response: any) => {
    try {
      setProcessingPayment(true);
      await verifyPayment(response.reference);
      toast({
        title: "Payment Successful!",
        description: "Thank you for your donation. Your payment has been processed successfully.",
      });
      onSuccess();
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      onError('Payment verification failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You have cancelled the payment process.",
      variant: "destructive",
    });
    setProcessingPayment(false);
  };

  const openPaymentWindow = () => {
    if (!scriptLoaded || !paymentData || !window.PaystackPop) {
      onError('Payment system not ready. Please try again.');
      return;
    }

    try {
      setProcessingPayment(true);
      
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
          donor_type: donorType,
          organization_name: organizationName,
          organization_type: organizationType,
          contact_person: contactPerson,
          project_id: projectId,
        },
        callback: function(response: any) {
          handlePaymentSuccess(response);
        },
        onClose: function() {
          handlePaymentClose();
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error('Payment error:', error);
      setProcessingPayment(false);
      onError(error.message || 'Payment failed');
    }
  };

  if (isLoading || !paymentData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <span className="ml-3 text-lg">Initializing payment...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-center">
        <p className="text-lg mb-4">Ready to process your donation of {currency} {amount}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Click the button below to open the secure Paystack payment window
        </p>
      </div>
      
      <button
        onClick={openPaymentWindow}
        disabled={!scriptLoaded || processingPayment}
        className="w-full max-w-sm bg-gradient-to-r from-brand-primary to-brand-dark-teal hover:from-brand-dark-teal hover:to-brand-mint text-white py-4 px-8 text-lg font-poppins font-semibold shadow-2xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {processingPayment ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          'Make Payment'
        )}
      </button>
      
      {!scriptLoaded && (
        <p className="text-sm text-gray-500">Loading payment system...</p>
      )}
    </div>
  );
};

export default PaystackPayment;
