import React, { useState, useEffect } from 'react';
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await api.getSubscriptionStatus();
        setSubscriptionStatus(status);
      } catch (err) {
        console.error('Error checking subscription status:', err);
        // Continue without blocking if subscription check fails
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user already has an active subscription
      if (subscriptionStatus?.hasSubscription) {
        const currentPlan = subscriptionStatus.subscription?.productName?.toLowerCase();
        const requestedPlan = planName.toLowerCase();
        
        if (currentPlan === requestedPlan) {
          throw new Error(`You already have an active ${planName} subscription.`);
        } else if (currentPlan === 'pro' && requestedPlan === 'ultra') {
          // Allow upgrade from Pro to Ultra
          console.log('Upgrading from Pro to Ultra...');
        } else if (currentPlan === 'ultra' && requestedPlan === 'pro') {
          throw new Error('You already have an Ultra subscription, which includes all Pro features.');
        }
      }

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

  // Determine button state and text
  const getButtonState = () => {
    if (checkingSubscription) {
      return { disabled: true, text: 'Checking...', opacity: 0.7 };
    }
    
    if (subscriptionStatus?.hasSubscription) {
      const currentPlan = subscriptionStatus.subscription?.productName?.toLowerCase();
      const requestedPlan = planName.toLowerCase();
      
      if (currentPlan === requestedPlan) {
        return { disabled: true, text: 'Already Subscribed', opacity: 0.7 };
      } else if (currentPlan === 'ultra' && requestedPlan === 'pro') {
        return { disabled: true, text: 'Already Have Ultra', opacity: 0.7 };
      } else if (currentPlan === 'pro' && requestedPlan === 'ultra') {
        return { disabled: false, text: 'Upgrade to Ultra', opacity: 1 };
      }
    }
    
    return { disabled: false, text: children || 'Subscribe', opacity: 1 };
  };

  const buttonState = getButtonState();

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading || buttonState.disabled}
        className={className}
        style={{
          ...style,
          opacity: loading ? 0.7 : buttonState.opacity,
          cursor: (loading || buttonState.disabled) ? 'not-allowed' : 'pointer'
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
          buttonState.text
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
