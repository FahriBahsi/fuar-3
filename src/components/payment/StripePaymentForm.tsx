'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  totalAmount: number;
  onSuccess: (orderId: string, amount: number) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ clientSecret, orderId, totalAmount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}&amount=${totalAmount}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess(orderId, totalAmount);
      } else {
        setMessage('Payment is being processed...');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessage(`Error: ${errorMessage}`);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-element-container mb-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postalCode: 'auto',
                },
              },
            },
          }}
        />
      </div>
      
      {message && (
        <div className={`alert ${message.includes('succeeded') ? 'alert-success' : 'alert-danger'} mb-3`}>
          <i className={`la ${message.includes('succeeded') ? 'la-check-circle' : 'la-exclamation-triangle'} me-2`}></i>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="btn btn-primary btn-lg w-100"
      >
        {isProcessing ? (
          <>
            <i className="la la-spinner la-spin me-2"></i>
            Processing Payment...
          </>
        ) : (
          <>
            <i className="la la-credit-card me-2"></i>
            Pay ${totalAmount.toFixed(2)}
          </>
        )}
      </button>

      <div className="stripe-security-notice mt-3">
        <small className="text-muted">
          <i className="la la-shield me-1"></i>
          Secured by Stripe • Your payment information is encrypted and secure
        </small>
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#667eea',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          border: '2px solid #e1e5e9',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '16px',
          transition: 'border-color 0.2s ease',
        },
        '.Input:focus': {
          borderColor: '#667eea',
          boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px',
        },
        '.Tab': {
          border: '2px solid #e1e5e9',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500',
        },
        '.Tab:hover': {
          borderColor: '#667eea',
          backgroundColor: '#f8f9ff',
        },
        '.Tab--selected': {
          borderColor: '#667eea',
          backgroundColor: '#667eea',
          color: 'white',
        },
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
