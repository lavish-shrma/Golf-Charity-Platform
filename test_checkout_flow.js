const http = require('http');

async function runTest() {
  const email = 'test_runner_1775027070625@example.com';
  const password = 'Password123!';

  console.log('1. Authenticating user...');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed:', loginData);
    return;
  }

  // Next.js standard fetch polyfill in Node might use headers.get() or similar for set-cookie
  const cookies = loginRes.headers.get('set-cookie');
  console.log('Authentication successful! Cookies received.');

  console.log('2. Requesting Stripe Checkout Session...');
  const checkoutRes = await fetch('http://localhost:3000/api/subscriptions/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies || ''
    },
    body: JSON.stringify({ plan_type: 'monthly' })
  });

  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok) {
    console.error('Checkout API rejected the request:', checkoutData);
    return;
  }

  console.log('Checkout Session created perfectly!');
  console.log('STRIPE HOSTED URL:', checkoutData.checkout_url);
}

runTest();
