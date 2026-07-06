import type { NextFunction, Request, Response } from 'express'
import { callVacationMcpTool } from '../../mcp/client'

export async function askMcp(request: Request, response: Response, next: NextFunction) {
  try {
    const authorization = request.get('Authorization')
    if (!authorization) return next({ status: 401, message: 'Please login first.' })

    const answer = await callVacationMcpTool(
      authorization,
      'answer_vacation_database_question',
      { question: request.body.question }
    )

    response.json({ answer })
  } catch (error) {
    next(error)
  }
}
