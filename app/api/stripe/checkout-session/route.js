import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { stripe } from '../../../../lib/stripe/server'

export async function POST(request) {
  try {
    const { invoiceId } = await request.json()
    if (!invoiceId) return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 })

    const supabase = createClient()

    // 1. Fetch the invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, line_items(*)')
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
       return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.status === 'paid') {
       return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 })
    }

    // 2. Fetch the connected Stripe Account ID
    const { data: organization } = await supabase
      .from('organizations')
      .select('name, stripe_account_id')
      .eq('id', invoice.organization_id)
      .single()

    if (!organization?.stripe_account_id) {
       return NextResponse.json({ error: 'Merchant has not enabled payments' }, { status: 400 })
    }

    // 3. Build Line Items for Stripe
    const stripeLineItems = invoice.line_items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.description || 'Roofing Service',
        },
        unit_amount: Math.round(parseFloat(item.unit_price) * 100), // Stripe uses cents
      },
      quantity: Math.max(1, Math.round(parseFloat(item.quantity) || 1)),
    }))

    // Add explicit Tax line item if exists
    const taxAmount = Math.round(parseFloat(invoice.tax) * 100)
    if (taxAmount > 0) {
      stripeLineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: taxAmount,
        },
        quantity: 1,
      })
    }

    // 4. Calculate 0.5% Platform Fee (in cents)
    const totalAmountCents = Math.round(parseFloat(invoice.total) * 100)
    const applicationFeeCents = Math.round(totalAmountCents * 0.005)

    const origin = request.headers.get('origin') || 'https://roofer-ledger.vercel.app'

    // 5. Create Stripe Checkout Session using Destination Charges
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account'], // Includes Apple Pay/Google Pay and ACH Bank Transfers
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: `${origin}/pay/success?invoice=${invoice.id}`,
      cancel_url: `${origin}/pay?invoice=${invoice.id}`,
      payment_intent_data: {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: organization.stripe_account_id,
        },
      },
      client_reference_id: invoice.id,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout Session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
