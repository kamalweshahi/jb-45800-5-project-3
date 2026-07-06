import axios from 'axios'

export default function extractError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (typeof error.response?.data === 'string') return error.response.data
    if (error.response?.data?.message) return error.response.data.message
  }

  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}
