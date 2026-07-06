import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import config from '../config'

export type VacationToolName =
  | 'answer_vacation_database_question'
  | 'count_active_vacations'
  | 'average_vacation_price'
  | 'upcoming_europe_vacations'
  | 'cheapest_vacation'

export async function callVacationMcpTool(
  authorization: string,
  toolName: VacationToolName,
  arguments_: Record<string, unknown> = {}
) {
  const client = new Client({ name: 'voyanta-web-client', version: '2.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(config.app.mcpServerUrl), {
    requestInit: { headers: { Authorization: authorization } }
  })

  try {
    await client.connect(transport)
    const result = await client.callTool({ name: toolName, arguments: arguments_ })
    const content = (result as { content?: Array<{ type: string; text?: string }> }).content || []
    const textContent = content.find(item => item.type === 'text' && typeof item.text === 'string')

    if (!textContent?.text) throw new Error('The MCP server returned an invalid response.')
    return textContent.text
  } finally {
    await client.close().catch(() => undefined)
  }
}
