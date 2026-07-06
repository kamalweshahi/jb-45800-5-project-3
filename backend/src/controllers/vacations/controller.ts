import type { NextFunction, Request, Response } from 'express'
import Vacation from '../../models/Vacation'
import Like from '../../models/Like'
import { Role } from '../../models/User'
import { emitLikesChanged } from '../../services/likes-socket'
import { removeUploadedImage } from '../../services/uploaded-image'
import { serializeVacation } from '../../services/vacation-serializer'
import { getVacationView, listDestinationOptions, listVacations, type VacationFilter } from '../../services/vacations-service'
import { assertVacationDates } from '../../utils/date-utils'

function getFilter(request: Request): VacationFilter {
  const filter = request.query.filter?.toString() as VacationFilter
  return ['all', 'liked', 'active', 'upcoming'].includes(filter) ? filter : 'all'
}

function getPaging(request: Request) {
  const limit = Math.min(Math.max(Number(request.query.limit || 9), 1), 20)
  const offset = Math.max(Number(request.query.offset || 0), 0)
  return { limit, offset }
}

export async function getVacations(request: Request, response: Response, next: NextFunction) {
  try {
    const filter = getFilter(request)
    const { limit, offset } = getPaging(request)
    response.json(await listVacations({ filter, limit, offset, userId: request.currentUser!.id }))
  } catch (error) {
    next(error)
  }
}

export async function getVacation(request: Request, response: Response, next: NextFunction) {
  try {
    const vacation = await Vacation.findByPk(Number(request.params.id))
    if (!vacation) return next({ status: 404, message: 'Vacation was not found.' })

    response.json(await getVacationView(vacation, request.currentUser!.id))
  } catch (error) {
    next(error)
  }
}

export async function createVacation(request: Request, response: Response, next: NextFunction) {
  try {
    if (!request.file) return next({ status: 422, message: 'Cover image is required.' })

    assertVacationDates(request.body.startDate, request.body.endDate, false)

    const vacation = await Vacation.create({
      ...request.body,
      imageName: request.file.filename
    })

    await vacation.reload()
    response.status(201).json(serializeVacation(vacation))
  } catch (error) {
    if (request.file) await removeUploadedImage(request.file.filename)
    next(error)
  }
}

export async function updateVacation(request: Request, response: Response, next: NextFunction) {
  try {
    assertVacationDates(request.body.startDate, request.body.endDate, true)

    const vacation = await Vacation.findByPk(Number(request.params.id))
    if (!vacation) return next({ status: 404, message: 'Vacation was not found.' })

    const previousImageName = vacation.imageName

    try {
      await vacation.update({
        ...request.body,
        imageName: request.file?.filename || previousImageName
      })
      await vacation.reload()

      if (request.file && previousImageName !== vacation.imageName) {
        await removeUploadedImage(previousImageName)
      }

      response.json(serializeVacation(vacation))
    } catch (error) {
      if (request.file) await removeUploadedImage(request.file.filename)
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export async function deleteVacation(request: Request, response: Response, next: NextFunction) {
  try {
    const vacation = await Vacation.findByPk(Number(request.params.id))
    if (!vacation) return next({ status: 404, message: 'Vacation was not found.' })

    const imageName = vacation.imageName
    await vacation.destroy()
    await removeUploadedImage(imageName)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function toggleLike(request: Request, response: Response, next: NextFunction) {
  try {
    if (request.currentUser!.role === Role.Admin) {
      return next({ status: 403, message: 'Administrators cannot like vacations.' })
    }

    const vacationId = Number(request.params.id)
    const vacation = await Vacation.findByPk(vacationId)
    if (!vacation) return next({ status: 404, message: 'Vacation was not found.' })

    const existingLike = await Like.findOne({ where: { userId: request.currentUser!.id, vacationId } })
    const isLiked = !existingLike

    if (existingLike) {
      await existingLike.destroy()
    } else {
      await Like.create({ userId: request.currentUser!.id, vacationId })
    }

    const likesCount = await Like.count({ where: { vacationId } })
    emitLikesChanged({ vacationId, likesCount })

    response.json({ vacationId, likesCount, isLikedByMe: isLiked })
  } catch (error) {
    next(error)
  }
}

export async function getDestinations(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    response.json(await listDestinationOptions())
  } catch (error) {
    next(error)
  }
}
