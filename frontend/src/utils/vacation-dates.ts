import type { Vacation } from '../models/Vacation'

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

export function todayDateOnly() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function durationDays(startDate: string, endDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return 0

  const start = new Date(`${startDate}T00:00:00Z`).getTime()
  const end = new Date(`${endDate}T00:00:00Z`).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0
  return Math.floor((end - start) / 86400000) + 1
}

export function formatVacationDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Date unavailable'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date)
}

export function getVacationStatus(vacation: Vacation) {
  if (!durationDays(vacation.startDate, vacation.endDate)) {
    return { label: 'Dates pending', className: 'ended' }
  }

  const today = todayDateOnly()
  if (vacation.startDate > today) return { label: 'Upcoming', className: 'upcoming' }
  if (vacation.endDate < today) return { label: 'Ended', className: 'ended' }
  return { label: 'Active now', className: 'active-now' }
}
