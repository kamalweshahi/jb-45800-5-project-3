import http from './http'

export async function getAiRecommendation(vacationId: number) {
  const response = await http.post<{ destination: string; durationDays: number; recommendation: string }>('/ai/recommendation', { vacationId })
  return response.data
}
