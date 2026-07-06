import type { NextFunction, Request, Response } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createVacationMcpServer } from './server'

export async function handleMcpRequest(request: Request, response: Response, next: NextFunction) {
  const server = createVacationMcpServer()
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })

  response.on('close', () => {
    void transport.close()
    void server.close()
  })

  try {
    await server.connect(transport)
    await transport.handleRequest(request, response, request.body)
  } catch (error) {
    next(error)
  }
}
