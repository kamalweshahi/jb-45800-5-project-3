import config from '../config'
import Vacation from '../models/Vacation'

export type VacationView = {
  id: number
  destination: string
  description: string
  startDate: string
  endDate: string
  price: number
  imageName: string
  imageUrl: string
  likesCount: number
  isLikedByMe: boolean
}

export function resolveImageUrl(imageName?: string | null) {
  if (!imageName) return ''
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) return imageName
  return `${config.app.publicBackendUrl}/images/${imageName}`
}

function readValue(vacation: Vacation, ...keys: string[]) {
  const plain = vacation.get({ plain: true }) as Record<string, unknown>

  for (const key of keys) {
    const directValue = (vacation as unknown as Record<string, unknown>)[key]
    if (directValue !== undefined && directValue !== null) return directValue

    const plainValue = plain[key]
    if (plainValue !== undefined && plainValue !== null) return plainValue
  }

  return undefined
}

function asText(value: unknown) {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function asDateOnly(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  const text = asText(value).trim()
  const match = text.match(/^\d{4}-\d{2}-\d{2}/)
  return match?.[0] ?? ''
}

function asNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function serializeVacation(vacation: Vacation, likesCount = 0, isLikedByMe = false): VacationView {
  // Read both Sequelize attribute names and physical snake_case column names.
  // This keeps old Docker volumes and imported SQL databases compatible.
  const imageName = asText(readValue(vacation, 'imageName', 'image_name'))

  return {
    id: asNumber(readValue(vacation, 'id')),
    destination: asText(readValue(vacation, 'destination')),
    description: asText(readValue(vacation, 'description')),
    startDate: asDateOnly(readValue(vacation, 'startDate', 'start_date')),
    endDate: asDateOnly(readValue(vacation, 'endDate', 'end_date')),
    price: asNumber(readValue(vacation, 'price')),
    imageName,
    imageUrl: resolveImageUrl(imageName),
    likesCount: asNumber(likesCount),
    isLikedByMe
  }
}
