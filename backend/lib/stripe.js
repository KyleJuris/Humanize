const Stripe = require('stripe');

// Single Stripe instance
let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    
    stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  
  return stripeInstance;
};

module.exports = {
  getStripe
};
