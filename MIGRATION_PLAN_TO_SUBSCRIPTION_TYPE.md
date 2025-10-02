# Migration: Plan Field to Subscription Type

## Overview
This migration removes the `plan` field from the profiles table and migrates all functionality to use `subscription_type` where `NULL` represents the free plan.

## Database Schema Changes

### New Schema
```
["id","user_id","created_at","updated_at","words_used_this_month","stripe_customer_id","subscription_type","subscription_product","stripe_subscription_id","subscription_status","email","user_name","avatar_url"]
```

### Field Mapping
- `plan: 'free'` → `subscription_type: NULL`
- `plan: 'pro'` → `subscription_type: 'pro'`
- `plan: 'ultra'` → `subscription_type: 'ultra'`

## Files Modified

### Database Migration
- ✅ `database_plan_to_subscription_type_migration.sql` - Migration script

### Backend Changes
- ✅ `backend/server.js` - Webhook already used subscription_type
- ✅ `backend/routes/profiles.js` - Removed plan field usage
- ✅ `backend/routes/auth.js` - Removed plan field usage
- ✅ `backend/routes/projects.js` - Updated word limit logic
- ✅ `backend/README.md` - Updated schema documentation

### Frontend Changes
- ✅ `frontend/pages/dashboard/profile.tsx` - Updated subscription display
- ✅ `frontend/pages/dashboard/humanizer.tsx` - Updated word limit logic
- ✅ `frontend/pages/billing/success.tsx` - Already working correctly
- ✅ `frontend/pages/billing/cancel.tsx` - No changes needed
- ✅ `frontend/components/SubscribeButton.tsx` - Uses Stripe API, no changes needed

## Testing Checklist

### Database Migration
- [ ] Run migration script on development database
- [ ] Verify plan field is removed
- [ ] Verify existing data is preserved in subscription_type

### Backend API Testing
- [ ] Test profile creation (should set subscription_type: null)
- [ ] Test profile retrieval (should return subscription_type)
- [ ] Test word limit enforcement for free users (subscription_type: null)
- [ ] Test word limit enforcement for pro users (subscription_type: 'pro')
- [ ] Test word limit enforcement for ultra users (subscription_type: 'ultra')
- [ ] Test Stripe webhook updates subscription_type correctly

### Frontend Testing
- [ ] Profile page shows correct plan name for free users
- [ ] Profile page shows correct plan name for pro users
- [ ] Profile page shows correct plan name for ultra users
- [ ] Profile page shows correct word limits
- [ ] Humanizer page enforces correct word limits
- [ ] Humanizer page shows correct usage statistics
- [ ] Success page works after payment
- [ ] Subscribe buttons work correctly

### Integration Testing
- [ ] Complete payment flow: signup → payment → success → access features
- [ ] Verify webhook updates user to correct subscription_type
- [ ] Verify frontend immediately reflects new subscription status
- [ ] Test upgrade flow from pro to ultra
- [ ] Test subscription cancellation

## Rollback Plan
If issues are found, the migration can be rolled back by:
1. Adding the plan field back: `ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';`
2. Updating plan based on subscription_type: `UPDATE profiles SET plan = COALESCE(subscription_type, 'free');`
3. Reverting code changes from git

## Key Benefits
1. **Consistency**: Single source of truth for subscription status
2. **Stripe Integration**: Direct mapping to Stripe subscription types
3. **Cleaner Logic**: NULL = free is more intuitive than 'free' string
4. **Future-proof**: Easier to add new subscription types
