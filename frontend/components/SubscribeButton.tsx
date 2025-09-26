import React, { useState } from 'react';
import api from '../lib/api';

interface SubscribeButtonProps {
  priceId: string;
  planName: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ 
  priceId, 
  planName, 
  className, 
  style, 
  children 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Creating checkout session for ${planName} plan...`);
      
      const response = await api.createHostedCheckoutSession(priceId);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.url) {
        throw new Error('No checkout URL received from server');
      }

      console.log('Redirecting to Stripe checkout...');
      
      // Redirect to Stripe hosted checkout
      window.location.href = response.url;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      console.error('Subscribe error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={className}
        style={{
          ...style,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing...
          </div>
        ) : (
          children || 'Subscribe'
        )}
      </button>
      
      {error && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SubscribeButton;
