import { requireAuth } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const user = await requireAuth()
    return Response.json({ user })
  } catch (err) {
    return handleApiError(err)
  }
}
