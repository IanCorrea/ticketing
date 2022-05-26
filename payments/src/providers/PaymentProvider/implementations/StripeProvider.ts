import Stripe from 'stripe';
import stripeConfig from '@config/stripe';

export const stripe = new Stripe(stripeConfig.stripe.secret, {
  apiVersion: '2020-08-27',
});
