import { validResult, invalidResult } from './common.js'

export function validateScore(input) {
  const errors = []

  if (input.score_value == null || typeof input.score_value !== 'number') {
    errors.push('score_value is required and must be a number.')
  } else if (!Number.isInteger(input.score_value) || input.score_value < 1 || input.score_value > 45) {
    errors.push('score_value must be an integer between 1 and 45.')
  }

  if (!input.played_date) {
    errors.push('played_date is required.')
  } else {
    const date = new Date(input.played_date)
    if (isNaN(date.getTime())) {
      errors.push('played_date must be a valid date.')
    } else if (date > new Date()) {
      errors.push('played_date cannot be in the future.')
    }
  }

  return errors.length > 0 ? invalidResult(errors) : validResult()
}

export function validateScoreUpdate(input) {
  const errors = []

  if (input.score_value == null && input.played_date == null) {
    errors.push('At least one field (score_value or played_date) must be provided.')
  }

  if (input.score_value != null) {
    if (typeof input.score_value !== 'number' || !Number.isInteger(input.score_value)) {
      errors.push('score_value must be an integer.')
    } else if (input.score_value < 1 || input.score_value > 45) {
      errors.push('score_value must be between 1 and 45.')
    }
  }

  if (input.played_date != null) {
    const date = new Date(input.played_date)
    if (isNaN(date.getTime())) {
      errors.push('played_date must be a valid date.')
    } else if (date > new Date()) {
      errors.push('played_date cannot be in the future.')
    }
  }

  return errors.length > 0 ? invalidResult(errors) : validResult()
}
