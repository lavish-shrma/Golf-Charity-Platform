require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedWinner() {
  console.log('Fetching a user...');
  const { data: users, error: uErr } = await supabase.from('users').select('id').limit(1);
  if (uErr || !users.length) {
    console.error('No users found.', uErr);
    return;
  }
  const userId = users[0].id;

  console.log('Creating a dummy draw...');
  const { data: draw, error: dErr } = await supabase.from('draws').insert({
    draw_period: 'TEST-' + Date.now(),
    status: 'published'
  }).select().single();

  if (dErr) {
    console.error('Failed to create draw:', dErr);
    return;
  }

  console.log('Creating a dummy pending prize...');
  const { data: prize, error: pErr } = await supabase.from('prizes').insert({
    user_id: userId,
    draw_id: draw.id,
    amount_pence: 250000, // £2500.00
    prize_tier: 'five',
    status: 'pending'
  }).select().single();
  
  if (pErr) {
    console.error('Failed to create prize:', pErr);
    return;
  }

  console.log('Creating a mock winner verification request...');
  const { error: vErr } = await supabase.from('winner_verifications').insert({
    user_id: userId,
    prize_id: prize.id,
    proof_url: 'https://imgur.com/mock_golf_score_evidence.jpg',
    status: 'pending'
  });

  if (vErr) {
    console.error('Failed to create verification:', vErr);
    return;
  }

  console.log('Successfully injected mock winner verification!');
}

seedWinner();
