import type { NextFunction, Request, Response } from 'express'
import Vacation from '../../models/Vacation'
import { buildVacationItinerary } from '../../services/ai-service'
import { daysBetween } from '../../utils/date-utils'

export async function getAiRecommendation(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const vacation = await Vacation.findByPk(request.body.vacationId)

    if (!vacation) {
      return next({
        status: 404,
        message: 'Vacation was not found.'
      })
    }

    response.json({
      destination: vacation.destination,
      durationDays: daysBetween(
        vacation.startDate,
        vacation.endDate
      ),
      recommendation: await buildVacationItinerary(vacation)
    })
  } catch (error) {
    next(error)
  }
}
