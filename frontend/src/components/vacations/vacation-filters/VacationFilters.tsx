import type { VacationFilter } from '../../../services/vacations-service'
import './VacationFilters.css'

const filters: Array<{ key: VacationFilter; label: string }> = [
  { key: 'all', label: 'All vacations' },
  { key: 'liked', label: 'Liked by me' },
  { key: 'active', label: 'Active now' },
  { key: 'upcoming', label: 'Upcoming' }
]

type Props = {
  value: VacationFilter
  onChange: (filter: VacationFilter) => void
}

export default function VacationFilters({ value, onChange }: Props) {
  return (
    <div className="filter-bar" aria-label="Vacation filters">
      {filters.map(filter => (
        <button
          type="button"
          key={filter.key}
          className={value === filter.key ? 'active' : ''}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
