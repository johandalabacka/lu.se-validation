export function required (value) {
  return value !== undefined && value !== null && value !== ''
}

export function between (value, { min, max }) {
  return value >= min && value <= max
}
