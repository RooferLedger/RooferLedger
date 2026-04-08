import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { stripe } from '../../../../lib/stripe/server'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Determine the org id
    const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
    if (!userData?.organization_id) {
       return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    // Check if the org already has a stripe_account_id
    const { data: orgData } = await supabase.from('organizations').select('stripe_account_id').eq('id', userData.organization_id).single()
    
    let stripeAccountId = orgData?.stripe_account_id

    // If no Stripe Connect account exists, create an Express account
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // Default to US for now
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'company'
      })
      stripeAccountId = account.id

      // Save it to Supabase
      await supabase.from('organizations').update({ stripe_account_id: stripeAccountId }).eq('id', userData.organization_id)
    }

    // Create an Account Link for onboarding
    const origin = request.headers.get('origin') || 'https://roofer-ledger.vercel.app'
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/onboarding/payments`, // Send back here if expired
      return_url: `${origin}/dashboard`, // Once finished onboarding, drop them in Dashboard
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })

  } catch (error) {
    console.error('Stripe Connect error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
