import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe/server'
// import { createClient } from '../../../lib/supabase/server' 

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    // Cryptographically verify that this request actually came from Stripe
    // and was not a spoofed request attempting to give someone a free premium account.
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook Error:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the event
  // const supabase = createClient()
  
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object
        const status = subscription.status
        const customerId = subscription.customer
        
        console.log(`Subscription for customer ${customerId} updated to: ${status}`)
        
        // Phase 4 Logic (Active Supabase DB Sync):
        const { createClient: createAdminClient } = require('@supabase/supabase-js')
        const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

        await supabaseAdmin
          .from('organizations')
          .update({ subscription_status: status })
          .eq('stripe_customer_id', customerId)
          
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })

  } catch (error) {
    console.error('Database Sync Error:', error)
    return new NextResponse('Database Sync Error', { status: 500 })
  }
}
