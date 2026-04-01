import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/errors'

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new ApiError(401, 'Not authenticated')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function requireSubscriber() {
  const user = await requireAuth()

  const supabase = await createClient()
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!subscription) {
    throw new ApiError(403, 'Active subscription required')
  }

  return { ...user, subscription }
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required')
  }

  return user
}
