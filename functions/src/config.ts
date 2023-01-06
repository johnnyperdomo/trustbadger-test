import * as functions from 'firebase-functions';
import * as Stripe from 'stripe';
const config = functions.config();

//Stripe =====================>

export const stripe = new Stripe.Stripe(config.stripe.secret, {
  apiVersion: '2022-11-15',
  maxNetworkRetries: 2, // Retry a request twice before giving up
});
