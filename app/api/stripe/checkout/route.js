import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
    const { data: orgData } = await supabase.from('organizations').select('stripe_customer_id').eq('id', userData?.organization_id).single()

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    let customerId = orgData?.stripe_customer_id

    // Auto-create Stripe customer if they don't have one connected yet
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          orgId: userData.organization_id // Crucial for mapping webhooks back!
        }
      })
      customerId = customer.id
      await supabase.from('organizations').update({ stripe_customer_id: customerId }).eq('id', userData.organization_id)
    }

    // Generate Hosted Checkout Session
    const origin = request.headers.get('origin') || 'https://roofer-ledger.vercel.app'
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // They will provide this ID
          quantity: 1,
        },
      ],
      mode: 'subscription', // Change to 'payment' if one-time
      success_url: `${origin}/dashboard/settings?checkout=success`,
      cancel_url: `${origin}/dashboard/settings?checkout=canceled`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Stripe Checkout API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
