import http from './http'

export async function askMcp(question: string) {
  const response = await http.post<{ answer: string }>('/mcp/ask', { question })
  return response.data.answer
}
