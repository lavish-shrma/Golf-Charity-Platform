require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function injectRealWinner() {
  const { data: users } = await supabase.from('users').select('id').limit(1);
  if (!users?.length) return console.log('No users found.');

  const { data: newDraw } = await supabase.from('draws').insert({
    draw_period: 'TEST-' + Date.now(), status: 'published',
    drawn_numbers: [1,2,3,4,5], total_participants: 1, prize_pool_pence: 10000
  }).select().single();

  const { data: entry } = await supabase.from('draw_entries').insert({
    draw_id: newDraw.id, user_id: users[0].id,
    match_tier: 'five', is_winner: true, user_scores: [1,2,3,4,5]
  }).select().single();

  const { data: prize, error: pErr } = await supabase.from('prizes').insert({
    draw_id: newDraw.id, draw_entry_id: entry.id, user_id: users[0].id,
    tier: 'five', amount_pence: 75000, payout_status: 'pending'
  }).select().single();

  if (pErr) return console.error('Failed prize:', pErr);

  const { error: vErr } = await supabase.from('winner_verifications').insert({
    prize_id: prize.id, user_id: users[0].id,
    screenshot_url: 'https://example.com/winning-proof-screenshot.png', status: 'pending'
  });

  if (vErr) return console.error('Failed verification:', vErr);
  console.log('Successfully injected the Guaranteed Winner using correct DB Schema!');
}
injectRealWinner();
