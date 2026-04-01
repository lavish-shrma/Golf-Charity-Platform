export function formatCurrency(pence, symbol = '£') {
  const pounds = pence / 100
  return `${symbol}${pounds.toFixed(2)}`
}

export function getCurrentPeriod() {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getDaysUntilMonthEnd() {
  const now = new Date()
  const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
  const diff = lastDay.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
