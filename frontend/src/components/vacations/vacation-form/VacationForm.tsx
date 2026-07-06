import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { Vacation } from '../../../models/Vacation'
import { createVacation, getVacation, updateVacation } from '../../../services/vacations-service'
import extractError from '../../../services/extract-error'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import { todayDateOnly } from '../../../utils/vacation-dates'
import './VacationForm.css'

type Props = { mode: 'create' | 'edit' }

type VacationDraft = {
  destination: string
  description: string
  startDate: string
  endDate: string
  price: string
}

const emptyDraft: VacationDraft = {
  destination: '',
  description: '',
  startDate: '',
  endDate: '',
  price: ''
}

export default function VacationForm({ mode }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<VacationDraft>(emptyDraft)
  const [image, setImage] = useState<File | null>(null)
  const [existingVacation, setExistingVacation] = useState<Vacation | null>(null)
  const [loading, setLoading] = useState(false)

  const selectedPreviewUrl = useMemo(() => image ? URL.createObjectURL(image) : '', [image])

  useEffect(() => () => {
    if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl)
  }, [selectedPreviewUrl])

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    setLoading(true)
    getVacation(id)
      .then(vacation => {
        setExistingVacation(vacation)
        setDraft({
          destination: vacation.destination,
          description: vacation.description,
          startDate: vacation.startDate,
          endDate: vacation.endDate,
          price: String(vacation.price)
        })
      })
      .catch(error => toast.error(extractError(error)))
      .finally(() => setLoading(false))
  }, [id, mode])

  function validateClientSide() {
    if (Number(draft.price) < 0 || Number(draft.price) > 10000) return 'Price must be between 0 and 10,000.'
    if (draft.endDate < draft.startDate) return 'End date cannot be earlier than start date.'
    if (mode === 'create' && draft.startDate < todayDateOnly()) return 'Start date cannot be in the past.'
    if (mode === 'create' && !image) return 'Cover image is required.'
    if (image && image.size > 5 * 1024 * 1024) return 'Cover image cannot be larger than 5 MB.'
    return ''
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const clientError = validateClientSide()
    if (clientError) return toast.error(clientError)

    const formData = new FormData()
    Object.entries(draft).forEach(([key, value]) => formData.append(key, value))
    if (image) formData.append('image', image)

    setLoading(true)
    try {
      if (mode === 'create') {
        await createVacation(formData)
        toast.success('Vacation created.')
      } else {
        await updateVacation(id!, formData)
        toast.success('Vacation updated.')
      }
      navigate('/admin/vacations')
    } catch (error) {
      toast.error(extractError(error))
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = selectedPreviewUrl || existingVacation?.imageUrl

  return (
    <section className="form-panel">
      <p className="eyebrow">Admin workspace</p>
      <h1>{mode === 'create' ? 'Add vacation' : 'Edit vacation'}</h1>
      <form onSubmit={submit}>
        <label htmlFor="vacation-destination">Destination</label>
        <input id="vacation-destination" value={draft.destination} onChange={event => setDraft({ ...draft, destination: event.target.value })} required />

        <label htmlFor="vacation-description">Description</label>
        <textarea id="vacation-description" minLength={20} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} required />

        <label htmlFor="vacation-start">Start date</label>
        <input id="vacation-start" type="date" min={mode === 'create' ? todayDateOnly() : undefined} value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value })} required />

        <label htmlFor="vacation-end">End date</label>
        <input id="vacation-end" type="date" min={draft.startDate || undefined} value={draft.endDate} onChange={event => setDraft({ ...draft, endDate: event.target.value })} required />

        <label htmlFor="vacation-price">Price</label>
        <input id="vacation-price" type="number" min="0" max="10000" step="0.01" value={draft.price} onChange={event => setDraft({ ...draft, price: event.target.value })} required />

        <label htmlFor="vacation-image">Cover image {mode === 'edit' && '(optional)'}</label>
        {previewUrl && <img className="image-preview" src={previewUrl} alt="Vacation cover preview" />}
        <input id="vacation-image" type="file" accept="image/*" onChange={event => setImage(event.target.files?.[0] || null)} required={mode === 'create'} />
        <p className="hint">Accepted image files up to 5 MB.</p>

        <div className="form-actions">
          <SpinnerButton loading={loading}>{mode === 'create' ? 'Add vacation' : 'Save changes'}</SpinnerButton>
          <Link className="button-secondary" to="/admin/vacations">Cancel</Link>
        </div>
      </form>
    </section>
  )
}
