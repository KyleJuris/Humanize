import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import api from '../lib/api';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe price IDs
const PRICE_IDS = {
  pro: 'price_1SAkpqIxRGF259ZEZoW96l7pPo5NkDfG2OiKCSYV0ieCIlObHJgVNnOg93EmPkYH4HzOm0M5q8Q8eEgVSO74gxkC00Hw38Q2yy', // Pro $19.99/month
  ultra: 'price_1SAkpqIxRGF259ZEZoW96l7pPo5NkDfG2OiKCSYV0ieCIlObHJgVNnOg93EmPkYH4HzOm0M5q8Q8eEgVSO74gxkC00Hw38Q2yy' // Ultra $39.99/month - You'll need to create this in Stripe
};

interface StripeCheckoutProps {
  planType: 'pro' | 'ultra';
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ planType, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the CardElement
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        throw new Error(pmError.message || 'Failed to create payment method');
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      // Create subscription on backend
      const response = await api.createSubscription({
        priceId: PRICE_IDS[planType],
        paymentMethodId: paymentMethod.id
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        response.clientSecret
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '500', 
          marginBottom: '0.5rem', 
          color: '#374151' 
        }}>
          Card Details
        </label>
        <div style={{
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: 'white'
        }}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div style={{
          color: '#ef4444',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%',
          backgroundColor: loading ? '#d1d5db' : '#10b981',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing...
          </>
        ) : (
          `Subscribe to ${planType.charAt(0).toUpperCase() + planType.slice(1)}`
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;
