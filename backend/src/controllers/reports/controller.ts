import type { NextFunction, Request, Response } from 'express'
import { fn, col } from 'sequelize'
import Vacation from '../../models/Vacation'
import Like from '../../models/Like'

async function getReportRows() {
  const vacations = await Vacation.findAll({
    attributes: [
      'id',
      'destination',
      [fn('COUNT', col('likes.vacation_id')), 'likesCount']
    ],
    include: [{ model: Like, attributes: [], required: false }],
    group: ['Vacation.id'],
    order: [['destination', 'ASC']],
  })

  return vacations.map(row => ({
    id: Number(row.id),
    destination: row.destination,
    likesCount: Number(row.get('likesCount'))
  }))
}

export async function getLikesReport(request: Request, response: Response, next: NextFunction) {
  try {
    response.json(await getReportRows())
  } catch (error) {
    next(error)
  }
}

export async function downloadLikesCsv(request: Request, response: Response, next: NextFunction) {
  try {
    const rows = await getReportRows()
    const csv = ['Destination,Likes', ...rows.map(row => `"${row.destination.replaceAll('"', '""')}",${row.likesCount}`)].join('\n')
    response.setHeader('Content-Type', 'text/csv; charset=utf-8')
    response.setHeader('Content-Disposition', 'attachment; filename="vacation-likes.csv"')
    response.send(csv)
  } catch (error) {
    next(error)
  }
}
