import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  answerVacationDatabaseQuestion,
  averageVacationPrice,
  cheapestVacation,
  countActiveVacations,
  upcomingEuropeVacations
} from './vacation-tools'

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}

export function createVacationMcpServer() {
  const server = new McpServer(
    { name: 'voyanta-vacations-mcp', version: '2.0.0' },
    { instructions: 'Read-only tools for answering questions about all available Voyanta database information.' }
  )

  server.registerTool(
    'answer_vacation_database_question',
    {
      title: 'Answer a Voyanta database question',
      description: 'Answers any read-only natural-language question that can be resolved from Voyanta vacation, like, and aggregate user data.',
      inputSchema: z.object({
        question: z.string().trim().min(3).max(500).describe('The user question about information stored in the Voyanta database.')
      })
    },
    async ({ question }) => textResult(await answerVacationDatabaseQuestion(question))
  )

  server.registerTool('count_active_vacations', {
    title: 'Count active vacations',
    description: 'Returns how many vacations are active today.',
    inputSchema: z.object({})
  }, async () => textResult(await countActiveVacations()))

  server.registerTool('average_vacation_price', {
    title: 'Average vacation price',
    description: 'Returns the average price of all vacations.',
    inputSchema: z.object({})
  }, async () => textResult(await averageVacationPrice()))

  server.registerTool('upcoming_europe_vacations', {
    title: 'Upcoming Europe vacations',
    description: 'Returns upcoming vacations whose destinations are in Europe.',
    inputSchema: z.object({})
  }, async () => textResult(await upcomingEuropeVacations()))

  server.registerTool('cheapest_vacation', {
    title: 'Cheapest vacation',
    description: 'Returns the lowest-priced vacation.',
    inputSchema: z.object({})
  }, async () => textResult(await cheapestVacation()))

  return server
}
