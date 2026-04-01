export function generateRandomDraw() {
  const numbers = new Set()
  // Generate 5 unique numbers between 1 and 45
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers)
}
