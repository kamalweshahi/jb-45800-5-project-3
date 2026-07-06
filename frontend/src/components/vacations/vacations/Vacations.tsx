import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import useAuth from '../../../hooks/use-auth'
import type { Vacation } from '../../../models/Vacation'
import extractError from '../../../services/extract-error'
import { deleteVacation, getVacations, toggleLike, type VacationFilter } from '../../../services/vacations-service'
import VacationCard from '../vacation-card/VacationCard'
import VacationFilters from '../vacation-filters/VacationFilters'
import './Vacations.css'

export default function Vacations() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [filter, setFilter] = useState<VacationFilter>('all')
  const [vacations, setVacations] = useState<Vacation[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pendingLikes, setPendingLikes] = useState<Set<number>>(new Set())
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let active = true
    loadingRef.current = true
    setLoading(true)
    setVacations([])

    void getVacations(filter, 0)
      .then(data => {
        if (!active) return
        setVacations(data.vacations)
        setOffset(data.vacations.length)
        setHasMore(data.hasMore)
      })
      .catch(error => {
        if (active) toast.error(extractError(error))
      })
      .finally(() => {
        if (!active) return
        loadingRef.current = false
        setLoading(false)
      })

    return () => { active = false }
  }, [filter, user?.id])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)

    try {
      const data = await getVacations(filter, offset)
      setVacations(current => {
        const existingIds = new Set(current.map(vacation => vacation.id))
        return [...current, ...data.vacations.filter(vacation => !existingIds.has(vacation.id))]
      })
      setOffset(current => current + data.vacations.length)
      setHasMore(data.hasMore)
    } catch (error) {
      toast.error(extractError(error))
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [filter, hasMore, offset])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) void loadMore()
    }, { rootMargin: '240px 0px', threshold: 0 })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
    socket.on('likes-changed', ({ vacationId, likesCount }: { vacationId: number; likesCount: number }) => {
      setVacations(current => current.map(vacation => (
        vacation.id === vacationId ? { ...vacation, likesCount } : vacation
      )))
    })
    return () => { socket.disconnect() }
  }, [])

  async function like(vacation: Vacation) {
    if (pendingLikes.has(vacation.id)) return
    setPendingLikes(current => new Set(current).add(vacation.id))

    try {
      const result = await toggleLike(vacation.id)
      setVacations(current => {
        if (filter === 'liked' && !result.isLikedByMe) {
          return current.filter(item => item.id !== vacation.id)
        }
        return current.map(item => item.id === vacation.id
          ? { ...item, likesCount: result.likesCount, isLikedByMe: result.isLikedByMe }
          : item)
      })
    } catch (error) {
      toast.error(extractError(error))
    } finally {
      setPendingLikes(current => {
        const next = new Set(current)
        next.delete(vacation.id)
        return next
      })
    }
  }

  async function remove(vacation: Vacation) {
    if (!confirm(`Delete the ${vacation.destination} vacation?`)) return

    try {
      await deleteVacation(vacation.id)
      setVacations(current => current.filter(item => item.id !== vacation.id))
      setOffset(current => Math.max(0, current - 1))
      toast.success('Vacation deleted.')
    } catch (error) {
      toast.error(extractError(error))
    }
  }

  return (
    <section className="vacations-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">{isAdmin ? 'Manage the collection' : 'Choose your next escape'}</p>
          <h1>{isAdmin ? 'Vacation dashboard' : 'Explore vacations'}</h1>
        </div>
        {isAdmin && <Link className="button-link" to="/admin/vacations/new"><Plus size={18} /> Add vacation</Link>}
      </div>

      {!isAdmin && <VacationFilters value={filter} onChange={setFilter} />}

      <div className="vacation-grid">
        {vacations.map(vacation => (
          <VacationCard
            key={vacation.id}
            vacation={vacation}
            isAdmin={isAdmin}
            likePending={pendingLikes.has(vacation.id)}
            onLike={vacation => void like(vacation)}
            onDelete={vacation => void remove(vacation)}
          />
        ))}
      </div>

      {!vacations.length && !loading && <div className="empty-state">No vacations match this view yet.</div>}
      {loading && <div className="loading">Loading vacations...</div>}
      <div ref={sentinelRef} className="scroll-sentinel" />
      {!hasMore && vacations.length > 0 && <div className="end-message">You have seen every available vacation.</div>}
    </section>
  )
}
