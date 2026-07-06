import type { ReportItem } from '../models/ReportItem'
import http from './http'

export async function getLikesReport() {
  const response = await http.get<ReportItem[]>('/reports/likes')
  return response.data
}

export async function downloadLikesCsv() {
  const response = await http.get('/reports/likes.csv', { responseType: 'blob' })
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'vacation-likes.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
