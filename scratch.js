const fs = require('fs');

async function main() {
  const env = fs.readFileSync('.env.local', 'utf8').split('\n');
  let url = '';
  let key = '';
  for (const line of env) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].replace(/['"]/g, '');
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = line.split('=')[1].replace(/['"]/g, '');
  }

  const res = await fetch(`${url}/rest/v1/organizations?limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
