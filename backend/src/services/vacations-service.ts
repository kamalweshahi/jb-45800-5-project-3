import { col, fn, Op, type WhereOptions } from 'sequelize'
import Like from '../models/Like'
import Vacation from '../models/Vacation'
import { todayDateOnly } from '../utils/date-utils'
import { serializeVacation } from './vacation-serializer'

export type VacationFilter = 'all' | 'liked' | 'active' | 'upcoming'

type VacationListOptions = {
  filter: VacationFilter
  limit: number
  offset: number
  userId: number
}

async function getVacationViews(vacations: Vacation[], userId: number) {
  const vacationIds = vacations.map(vacation => vacation.id)
  if (!vacationIds.length) return []

  const [likeCounts, myLikes] = await Promise.all([
    Like.findAll({
      attributes: ['vacationId', [fn('COUNT', col('vacation_id')), 'likesCount']],
      where: { vacationId: vacationIds },
      group: ['vacationId']
    }),
    Like.findAll({
      attributes: ['vacationId'],
      where: { userId, vacationId: vacationIds }
    })
  ])

  const likesByVacation = new Map(
    likeCounts.map(like => [like.vacationId, Number(like.get('likesCount'))])
  )
  const likedByMe = new Set(myLikes.map(like => like.vacationId))

  return vacations.map(vacation => serializeVacation(
    vacation,
    likesByVacation.get(vacation.id) ?? 0,
    likedByMe.has(vacation.id)
  ))
}

async function getVacationWhere(filter: VacationFilter, userId: number) {
  const where: WhereOptions = {}
  const today = todayDateOnly()

  if (filter === 'active') {
    where.startDate = { [Op.lte]: today }
    where.endDate = { [Op.gte]: today }
  } else if (filter === 'upcoming') {
    where.startDate = { [Op.gt]: today }
  } else if (filter === 'liked') {
    const likes = await Like.findAll({ attributes: ['vacationId'], where: { userId } })
    const likedIds = likes.map(like => like.vacationId)
    where.id = likedIds.length ? likedIds : [-1]
  }

  return where
}

export async function listVacations({ filter, limit, offset, userId }: VacationListOptions) {
  const { rows, count } = await Vacation.findAndCountAll({
    where: await getVacationWhere(filter, userId),
    order: [['startDate', 'ASC'], ['id', 'ASC']],
    limit,
    offset
  })

  return {
    vacations: await getVacationViews(rows, userId),
    total: count,
    hasMore: offset + rows.length < count
  }
}

export async function getVacationView(vacation: Vacation, userId: number) {
  const [view] = await getVacationViews([vacation], userId)
  return view
}

export async function listDestinationOptions() {
  const vacations = await Vacation.findAll({
    attributes: ['id', 'destination', 'startDate', 'endDate'],
    order: [['destination', 'ASC']]
  })

  return vacations.map(({ id, destination, startDate, endDate }) => ({
    id,
    destination,
    startDate,
    endDate
  }))
}
