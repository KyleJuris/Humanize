-- Migration: Remove 'plan' field and migrate to 'subscription_type' 
-- This migration removes the 'plan' field from profiles table
-- All functionality now uses 'subscription_type' where NULL = free plan

-- Step 1: Migrate existing plan data to subscription_type (if needed)
-- Update any existing records where plan is not 'free' but subscription_type is null
UPDATE public.profiles 
SET subscription_type = plan 
WHERE plan != 'free' AND subscription_type IS NULL;

-- Step 2: Remove the plan field entirely
ALTER TABLE public.profiles DROP COLUMN IF EXISTS plan;

-- Step 3: Add comment to document the new schema
COMMENT ON COLUMN public.profiles.subscription_type IS 'Subscription type: pro, ultra, or NULL (free plan)';

-- Step 4: Update any existing 'free' subscription_type to NULL for consistency
UPDATE public.profiles 
SET subscription_type = NULL 
WHERE subscription_type = 'free';

-- Final schema verification comment
-- New schema: ["id","user_id","created_at","updated_at","words_used_this_month","stripe_customer_id","subscription_type","subscription_product","stripe_subscription_id","subscription_status","email","user_name","avatar_url"]
