import { requireAdmin } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    
    if (!body.name || !body.slug || !body.description) {
      throw new ApiError(400, 'Name, slug, and description are required.')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false
      })
      .select()
      .single()

    if (error) throw new ApiError(500, error.message)
    return Response.json({ charity: data, message: 'Charity created successfully.' })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function GET() {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { data, error } = await supabase.from('charities').select('*').order('name')
    if (error) throw new ApiError(500, error.message)
    return Response.json({ charities: data })
  } catch (err) {
    return handleApiError(err)
  }
}
