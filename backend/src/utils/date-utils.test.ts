import { assertVacationDates, daysBetween, todayDateOnly } from './date-utils'

describe('date utilities', () => {
  it('counts vacation duration inclusively', () => {
    expect(daysBetween('2026-08-04', '2026-08-10')).toBe(7)
  })

  it('rejects an end date before the start date', () => {
    expect(() => assertVacationDates('2027-08-10', '2027-08-04', true)).toThrow()
  })

  it('allows historical dates while editing', () => {
    expect(() => assertVacationDates('2020-01-01', '2020-01-04', true)).not.toThrow()
  })

  it('rejects historical start dates while creating', () => {
    expect(() => assertVacationDates('2000-01-01', '2000-01-04', false)).toThrow()
  })

  it('returns today as a date-only string', () => {
    expect(todayDateOnly()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
