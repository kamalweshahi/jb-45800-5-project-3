export function todayDateOnly() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function daysBetween(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime()
  const end = new Date(`${endDate}T00:00:00Z`).getTime()
  return Math.floor((end - start) / 86400000) + 1
}

export function assertVacationDates(startDate: string, endDate: string, allowPastStart: boolean) {
  if (endDate < startDate) {
    throw { status: 422, message: 'End date cannot be earlier than start date.' }
  }

  if (!allowPastStart && startDate < todayDateOnly()) {
    throw { status: 422, message: 'Start date cannot be in the past.' }
  }
}
