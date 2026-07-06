import { CalendarDays, Clock3, Heart, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Vacation } from '../../../models/Vacation'
import { durationDays, formatVacationDate, getVacationStatus } from '../../../utils/vacation-dates'
import './VacationCard.css'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

type Props = {
  vacation: Vacation
  isAdmin: boolean
  likePending: boolean
  onLike: (vacation: Vacation) => void
  onDelete: (vacation: Vacation) => void
}

export default function VacationCard({ vacation, isAdmin, likePending, onLike, onDelete }: Props) {
  const status = getVacationStatus(vacation)
  const duration = durationDays(vacation.startDate, vacation.endDate)

  return (
    <article className="vacation-card">
      <div className="card-image-wrap">
        <img
          src={vacation.imageUrl || '/vacation-fallback.svg'}
          alt={`${vacation.destination} vacation`}
          onError={event => { event.currentTarget.src = '/vacation-fallback.svg' }}
        />
        <span className={`status-badge ${status.className}`}>{status.label}</span>
        <div className="image-title"><MapPin size={18} /><h2>{vacation.destination}</h2></div>
      </div>

      <div className="card-content">
        <div className="trip-meta">
          <div><CalendarDays size={18} /><span>{formatVacationDate(vacation.startDate)} – {formatVacationDate(vacation.endDate)}</span></div>
          <div><Clock3 size={18} /><span>{duration ? `${duration} days` : 'Duration unavailable'}</span></div>
        </div>

        <p className="card-description">{vacation.description}</p>
        <div className="card-price-row">
          <span>From</span>
          <strong>{vacation.price > 0 ? priceFormatter.format(vacation.price) : 'Price unavailable'}</strong>
          <small>per traveler</small>
        </div>

        <div className="card-actions">
          {!isAdmin && (
            <button
              type="button"
              onClick={() => onLike(vacation)}
              className={vacation.isLikedByMe ? 'liked' : 'like-button'}
              disabled={likePending}
              aria-pressed={vacation.isLikedByMe}
            >
              <Heart size={18} fill={vacation.isLikedByMe ? 'currentColor' : 'none'} />
              {vacation.isLikedByMe ? 'Unlike' : 'Like'} <span>{vacation.likesCount}</span>
            </button>
          )}
          {isAdmin && <span className="likes-pill"><Heart size={17} /> {vacation.likesCount} likes</span>}
          {isAdmin && <Link to={`/admin/vacations/${vacation.id}/edit`}><Pencil size={17} /> Edit</Link>}
          {isAdmin && <button type="button" className="danger" onClick={() => onDelete(vacation)}><Trash2 size={17} /> Delete</button>}
        </div>
      </div>
    </article>
  )
}
