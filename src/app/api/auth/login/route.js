import { createClient } from '@/lib/supabase/server'
import { ApiError, handleApiError } from '@/lib/errors'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw new ApiError(401, 'Invalid email or password')

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    await supabase.auth.updateUser({
      data: { role: profile.role }
    })

    return Response.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role
      }
    })
  } catch (err) {
    return handleApiError(err)
  }
}
