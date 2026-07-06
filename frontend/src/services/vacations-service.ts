import type { DestinationOption, Vacation, VacationListResponse } from '../models/Vacation'
import http from './http'

export type VacationFilter = 'all' | 'liked' | 'active' | 'upcoming'

export async function getVacations(filter: VacationFilter, offset: number, limit = 9) {
  const response = await http.get<VacationListResponse>('/vacations', {
    params: { filter, offset, limit }
  })
  return response.data
}

export async function getVacation(id: string | number) {
  const response = await http.get<Vacation>(`/vacations/${id}`)
  return response.data
}

export async function createVacation(formData: FormData) {
  const response = await http.post<Vacation>('/vacations', formData)
  return response.data
}

export async function updateVacation(id: string | number, formData: FormData) {
  const response = await http.put<Vacation>(`/vacations/${id}`, formData)
  return response.data
}

export async function deleteVacation(id: number) {
  await http.delete(`/vacations/${id}`)
}

export async function toggleLike(id: number) {
  const response = await http.post<Pick<Vacation, 'id' | 'likesCount' | 'isLikedByMe'> & { vacationId: number }>(`/vacations/${id}/like`)
  return response.data
}

export async function getDestinations() {
  const response = await http.get<DestinationOption[]>('/vacations/destinations')
  return response.data
}
