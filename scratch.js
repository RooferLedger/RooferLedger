require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: users } = await supabase.from('users').select('*').eq('email', 'cpapafio@gmail.com');
  console.log("USERS:", users);
  
  if (users && users.length > 0 && users[0].organization_id) {
    const orgId = users[0].organization_id;
    const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId);
    console.log("ORG:", org);

    const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
    console.log("INVOICES COUNT:", count);
  }
}
run();
