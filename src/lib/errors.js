export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.message = message
  }
}

export function handleApiError(err) {
  if (err instanceof ApiError) {
    return Response.json(
      { error: { status: err.status, message: err.message } },
      { status: err.status }
    )
  }
  console.error('Unexpected error:', err)
  return Response.json(
    { error: { status: 500, message: 'Internal server error' } },
    { status: 500 }
  )
}
