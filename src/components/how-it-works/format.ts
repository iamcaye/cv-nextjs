// Dates are stored as calendar days; format in UTC so they never shift.
export function formatDate(date: string, month: 'long' | 'short' = 'long') {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  })
}
