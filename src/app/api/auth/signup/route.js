import { createClient } from '@/lib/supabase/server'
import { ApiError, handleApiError } from '@/lib/errors'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password || !full_name) {
      throw new ApiError(400, 'Email, password, and full name are required')
    }

    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters')
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role: 'subscriber' }
      }
    })

    if (error) throw new ApiError(400, error.message)

    return Response.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name,
        role: 'subscriber'
      },
      message: 'Account created successfully.'
    }, { status: 201 })
  } catch (err) {
    return handleApiError(err)
  }
}
