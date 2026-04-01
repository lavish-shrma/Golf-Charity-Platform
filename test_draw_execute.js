async function run() {
  console.log('Logging in as Admin...');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@golfcharity.dev', password: 'Admin@123456' })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }
  const cookies = loginRes.headers.get('set-cookie');
  console.log('Admin session acquired.');

  console.log('Executing Official Draw...');
  const execRes = await fetch('http://localhost:3000/api/admin/draws/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookies || '' },
    body: JSON.stringify({ mode: 'random' })
  });
  
  const data = await execRes.json();
  console.error('API Response was:');
  console.error(data);
}
run();
