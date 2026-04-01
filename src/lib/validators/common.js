export function validResult() {
  return { valid: true, errors: null }
}

export function invalidResult(errors) {
  return { valid: false, errors }
}
