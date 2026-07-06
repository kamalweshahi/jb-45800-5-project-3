export interface Vacation {
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

export interface VacationListResponse {
  vacations: Vacation[]
  total: number
  hasMore: boolean
}

export interface DestinationOption {
  id: number
  destination: string
  startDate: string
  endDate: string
}
