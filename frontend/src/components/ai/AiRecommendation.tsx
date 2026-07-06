import { Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import type { DestinationOption } from '../../models/Vacation'
import { getAiRecommendation } from '../../services/ai-service'
import extractError from '../../services/extract-error'
import { getDestinations } from '../../services/vacations-service'
import { durationDays } from '../../utils/vacation-dates'
import Markdown from '../common/markdown/Markdown'
import SpinnerButton from '../common/spinner-button/SpinnerButton'
import './AiRecommendation.css'

export default function AiRecommendation() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([])
  const [vacationId, setVacationId] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(error => toast.error(extractError(error)))
  }, [])

  const selected = useMemo(
    () =>
      destinations.find(
        destination => String(destination.id) === vacationId
      ),
    [destinations, vacationId]
  )

  async function submit(event: React.FormEvent) {
    event.preventDefault()

    if (!vacationId) {
      return toast.error('Please select a destination.')
    }

    setLoading(true)

    try {
      const result = await getAiRecommendation(Number(vacationId))
      setRecommendation(result.recommendation)
    } catch (error) {
      toast.error(extractError(error))
    } finally {
      setLoading(false)
    }
  }

  const selectedDuration = selected
    ? durationDays(selected.startDate, selected.endDate)
    : 0

  return (
    <section className="panel ai-planner">
      <p className="eyebrow">Plan your days</p>
      <h1>AI trip planner</h1>

      <p className="hint">
        Choose a Voyanta vacation and receive an itinerary matched to its exact duration.
      </p>

      <form onSubmit={submit}>
        <label htmlFor="ai-destination">Destination</label>

        <select
          id="ai-destination"
          value={vacationId}
          onChange={event => setVacationId(event.target.value)}
          required
        >
          <option value="">Please select a destination...</option>

          {destinations.map(destination => (
            <option key={destination.id} value={destination.id}>
              {destination.destination} ·{' '}
              {durationDays(
                destination.startDate,
                destination.endDate
              )}{' '}
              days
            </option>
          ))}
        </select>

        {selected && (
          <p className="hint">
            Planned length: {selectedDuration} days.
          </p>
        )}

        <SpinnerButton
          loading={loading}
          disabled={!vacationId || selectedDuration <= 0}
        >
          <Sparkles size={18} />
          Build my itinerary
        </SpinnerButton>
      </form>

      {recommendation && <Markdown text={recommendation} />}
    </section>
  )
}
