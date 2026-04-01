require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function setup() {
  console.log('Creating test user via Admin API to bypass rate limits...')
  const email = `test_runner_${Date.now()}@example.com`
  const password = 'Password123!'

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Test Runner', role: 'subscriber' }
  })

  if (authError) {
    console.error('Failed to create user:', authError)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`User created: ${userId} (${email})`)

  // Get a charity
  const { data: charities } = await supabase.from('charities').select('id').limit(1)
  const charityId = charities[0]?.id

  // Update user profile with a charity to allow checkout
  const { error: updateError } = await supabase.from('users').update({
    selected_charity_id: charityId,
    charity_contribution_percent: 50
  }).eq('id', userId)

  if (updateError) {
    console.error('Failed to update user profile:', updateError)
  } else {
    console.log(`User profile configured with charity: ${charityId}`)
  }
  
  console.log('\n--- TEST CREDENTIALS ---')
  console.log(`EMAIL: ${email}`)
  console.log(`PASSWORD: ${password}`)
}

setup()
