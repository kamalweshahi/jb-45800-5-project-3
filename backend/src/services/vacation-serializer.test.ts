import { resolveImageUrl, serializeVacation } from './vacation-serializer'
import type Vacation from '../models/Vacation'

describe('vacation image URL resolution', () => {
  it('keeps absolute LocalStack URLs unchanged', () => {
    const url = 'http://localhost:4566/vacation-images/kyoto.jpg'
    expect(resolveImageUrl(url)).toBe(url)
  })

  it('creates a backend URL for uploaded filenames', () => {
    expect(resolveImageUrl('cover.jpg')).toBe('http://localhost:3000/images/cover.jpg')
  })

  it('returns an empty URL when no image name exists', () => {
    expect(resolveImageUrl(undefined)).toBe('')
  })
})

describe('vacation serialization', () => {
  it('supports imported databases that expose snake_case column names', () => {
    const values = {
      id: 7,
      destination: 'Rome, Italy',
      description: 'Historic streets and memorable food.',
      start_date: '2026-09-03',
      end_date: '2026-09-09',
      price: '1890.00',
      image_name: 'rome.jpg'
    }

    const vacation = {
      get: () => values
    } as unknown as Vacation

    expect(serializeVacation(vacation, 4, true)).toEqual({
      id: 7,
      destination: 'Rome, Italy',
      description: 'Historic streets and memorable food.',
      startDate: '2026-09-03',
      endDate: '2026-09-09',
      price: 1890,
      imageName: 'rome.jpg',
      imageUrl: 'http://localhost:3000/images/rome.jpg',
      likesCount: 4,
      isLikedByMe: true
    })
  })
})
