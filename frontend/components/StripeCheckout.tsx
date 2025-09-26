import React, { useCallback, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import api from '../lib/api';

// Initialize Stripe with publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe publishable key:', stripePublishableKey ? 'Present' : 'Missing');

if (!stripePublishableKey) {
  console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set!');
}

const stripePromise = loadStripe(stripePublishableKey!);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Stripe key is available
  if (!stripePublishableKey) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#dc2626',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>Stripe configuration error. Please contact support.</p>
      </div>
    );
  }

  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating checkout session for plan:', planType);
      console.log('Using price ID:', PRICE_IDS[planType]);
      
      const response = await api.createCheckoutSession(PRICE_IDS[planType]);
      
      console.log('API response:', response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.clientSecret) {
        throw new Error('No client secret received from server');
      }
      
      console.log('Checkout session created successfully');
      return response.clientSecret;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      console.error('Error creating checkout session:', errorMessage);
      console.error('Full error:', err);
      setError(errorMessage);
      onError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [planType, onError]);

  const options = { fetchClientSecret };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        minHeight: '200px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#dc2626',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchClientSecret();
          }}
          style={{
            marginTop: '1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div id="checkout" style={{ minHeight: '400px' }}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;