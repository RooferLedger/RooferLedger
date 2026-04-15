import 'dotenv/config.js';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Checking DB for cpapafio@gmail.com...");
  const { data: users } = await supabase.from('users').select('*').eq('email', 'cpapafio@gmail.com');
  if (!users || users.length === 0) { console.log('User not found'); return; }
  
  const orgId = users[0].organization_id;
  const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single();
  console.log("ORG:", org);

  if (org.stripe_customer_id) {
    console.log("Fetching Stripe Subs for Customer:", org.stripe_customer_id);
    const subs = await stripe.subscriptions.list({ customer: org.stripe_customer_id, status: 'all' });
    console.log("SUBSCRIPTIONS:", subs.data.map(s => ({ id: s.id, status: s.status })));
  } else {
    console.log("No stripe_customer_id on org!");
    // check by email
    const customers = await stripe.customers.list({ email: 'cpapafio@gmail.com' });
    console.log("Found customers by email:", customers.data.map(c => c.id));
    if (customers.data.length > 0) {
      const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: 'all' });
      console.log("SUBSCRIPTIONS for first customer:", subs.data.map(s => ({ id: s.id, status: s.status })));
    }
  }
}
run().catch(console.error);
