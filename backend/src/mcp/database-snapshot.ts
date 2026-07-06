import Like from '../models/Like'
import User, { Role } from '../models/User'
import Vacation from '../models/Vacation'
import { todayDateOnly } from '../utils/date-utils'

export type VacationSnapshot = {
  id: number
  destination: string
  description: string
  startDate: string
  endDate: string
  price: number
  status: 'active' | 'upcoming' | 'ended'
  likesCount: number
}

export type VacationDatabaseSnapshot = {
  generatedAt: string
  totals: {
    users: number
    regularUsers: number
    admins: number
    vacations: number
    likes: number
  }
  vacations: VacationSnapshot[]
}

function getStatus(startDate: string, endDate: string, today: string): VacationSnapshot['status'] {
  if (startDate > today) return 'upcoming'
  if (endDate < today) return 'ended'
  return 'active'
}

export async function getVacationDatabaseSnapshot(): Promise<VacationDatabaseSnapshot> {
  const [vacations, likes, users, admins] = await Promise.all([
    Vacation.findAll({
      attributes: ['id', 'destination', 'description', 'startDate', 'endDate', 'price'],
      order: [['startDate', 'ASC']]
    }),
    Like.findAll({ attributes: ['vacationId'] }),
    User.count(),
    User.count({ where: { role: Role.Admin } })
  ])

  const likesByVacation = new Map<number, number>()
  for (const { vacationId } of likes) {
    likesByVacation.set(vacationId, (likesByVacation.get(vacationId) ?? 0) + 1)
  }

  const today = todayDateOnly()
  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users,
      regularUsers: users - admins,
      admins,
      vacations: vacations.length,
      likes: likes.length
    },
    vacations: vacations.map(vacation => ({
      id: vacation.id,
      destination: vacation.destination,
      description: vacation.description,
      startDate: vacation.startDate,
      endDate: vacation.endDate,
      price: Number(vacation.price),
      status: getStatus(vacation.startDate, vacation.endDate, today),
      likesCount: likesByVacation.get(vacation.id) ?? 0
    }))
  }
}
