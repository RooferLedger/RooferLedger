import Stripe from 'stripe'

// We establish a singleton Stripe instance on the server side
// This prevents memory leaks and ensures we don't open too many connections.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Always hardcode the version you tested against
  appInfo: {
    name: 'RooferLedger Wealth Engine',
    version: '1.0.0',
  },
})

export async function getOrCreateStripeCustomer(email, name, organizationId) {
  // Logic to map the PostgreSQL Organization to a Stripe Customer ID
  // Would query Supabase here first, if null, create in Stripe and update Supabase.
  
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId: organizationId,
    },
  })
  
  return customer.id
}
