-- Add subscription-related fields to profiles table
-- This migration adds the missing fields that the Stripe webhook tries to update

-- Add subscription status fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_type TEXT,
ADD COLUMN IF NOT EXISTS subscription_product TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add words_used_this_month field if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS words_used_this_month INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON public.profiles(stripe_subscription_id);

-- Update existing profiles to have default values
UPDATE public.profiles 
SET 
  subscription_status = 'inactive',
  words_used_this_month = 0
WHERE subscription_status IS NULL OR words_used_this_month IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.subscription_status IS 'Current subscription status: inactive, active, canceled, past_due';
COMMENT ON COLUMN public.profiles.subscription_type IS 'Type of subscription: pro, ultra';
COMMENT ON COLUMN public.profiles.subscription_product IS 'Product name from Stripe';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN public.profiles.words_used_this_month IS 'Number of words used in current billing period';
