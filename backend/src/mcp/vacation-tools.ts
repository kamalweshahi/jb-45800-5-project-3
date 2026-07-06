import { col, fn, Op } from 'sequelize'
import Vacation from '../models/Vacation'
import { todayDateOnly } from '../utils/date-utils'
export { answerVacationDatabaseQuestion } from './database-answer'

export async function countActiveVacations() {
  const today = todayDateOnly()
  const count = await Vacation.count({
    where: {
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today }
    }
  })
  return `There are currently ${count} active vacations.`
}

export async function averageVacationPrice() {
  const result = await Vacation.findOne({
    attributes: [[fn('AVG', col('price')), 'averagePrice']]
  })
  const average = Number(result?.get('averagePrice') ?? 0)
  return `The average vacation price is $${average.toFixed(2)}.`
}

export async function upcomingEuropeVacations() {
  const europeKeywords = ['Italy', 'Iceland', 'Portugal', 'France', 'Greece']
  const vacations = await Vacation.findAll({
    attributes: ['destination', 'startDate'],
    where: {
      startDate: { [Op.gt]: todayDateOnly() },
      [Op.or]: europeKeywords.map(country => ({ destination: { [Op.like]: `%${country}%` } }))
    },
    order: [['startDate', 'ASC']]
  })

  if (!vacations.length) return 'There are no upcoming European vacations right now.'
  return `Upcoming European vacations: ${vacations.map(vacation => `${vacation.destination} (${vacation.startDate})`).join(', ')}.`
}

export async function cheapestVacation() {
  const vacation = await Vacation.findOne({
    attributes: ['destination', 'price'],
    order: [['price', 'ASC']]
  })

  if (!vacation) return 'There are no vacations in the database.'
  return `The cheapest vacation is ${vacation.destination}, priced at $${Number(vacation.price).toFixed(2)}.`
}
