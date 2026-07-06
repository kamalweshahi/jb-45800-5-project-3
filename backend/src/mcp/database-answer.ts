import OpenAI from 'openai'
import config from '../config'
import { getVacationDatabaseSnapshot, type VacationDatabaseSnapshot } from './database-snapshot'

function answerWithoutOpenAI(question: string, snapshot: VacationDatabaseSnapshot) {
  const normalized = question.toLowerCase()
  const { vacations } = snapshot

  if (normalized.includes('most expensive') || normalized.includes('highest price') || normalized.includes('أغلى') || normalized.includes('יקר')) {
    const vacation = [...vacations].sort((left, right) => right.price - left.price)[0]
    return vacation ? `The most expensive vacation is ${vacation.destination}, priced at $${vacation.price.toFixed(2)}.` : 'There are no vacations in the database.'
  }

  if (normalized.includes('cheap') || normalized.includes('lowest price') || normalized.includes('أرخص') || normalized.includes('זול')) {
    const vacation = [...vacations].sort((left, right) => left.price - right.price)[0]
    return vacation ? `The cheapest vacation is ${vacation.destination}, priced at $${vacation.price.toFixed(2)}.` : 'There are no vacations in the database.'
  }

  if (normalized.includes('average') || normalized.includes('معدل') || normalized.includes('ממוצע')) {
    const average = vacations.length ? vacations.reduce((sum, vacation) => sum + vacation.price, 0) / vacations.length : 0
    return `The average vacation price is $${average.toFixed(2)}.`
  }

  const status = normalized.includes('active') || normalized.includes('نشط') || normalized.includes('פעיל')
    ? 'active'
    : normalized.includes('upcoming') || normalized.includes('future') || normalized.includes('قادمة') || normalized.includes('עתיד')
      ? 'upcoming'
      : normalized.includes('ended') || normalized.includes('past') || normalized.includes('منتهية') || normalized.includes('הסתיימ')
        ? 'ended'
        : undefined

  if (status) {
    const matches = vacations.filter(vacation => vacation.status === status)
    return `There are ${matches.length} ${status} vacations${matches.length ? `: ${matches.map(vacation => vacation.destination).join(', ')}` : ''}.`
  }

  if (normalized.includes('most liked') || normalized.includes('popular') || normalized.includes('أكثر إعجاب') || normalized.includes('פופולרי')) {
    const vacation = [...vacations].sort((left, right) => right.likesCount - left.likesCount)[0]
    return vacation ? `The most liked vacation is ${vacation.destination} with ${vacation.likesCount} likes.` : 'There are no vacations in the database.'
  }

  if (normalized.includes('user') || normalized.includes('مستخدم') || normalized.includes('משתמש')) {
    const { users, regularUsers, admins } = snapshot.totals
    return `The database currently contains ${users} users: ${regularUsers} regular users and ${admins} administrators.`
  }

  if (normalized.includes('like') || normalized.includes('إعجاب') || normalized.includes('לייק')) {
    return `There are ${snapshot.totals.likes} likes across all vacations.`
  }

  const destination = vacations.find(vacation => normalized.includes(vacation.destination.toLowerCase()))
  if (destination) {
    return `${destination.destination} runs from ${destination.startDate} to ${destination.endDate}, costs $${destination.price.toFixed(2)}, currently has ${destination.likesCount} likes, and is ${destination.status}. ${destination.description}`
  }

  return 'I can answer this question when an OpenAI API key is configured. I can currently answer many common questions about vacation prices, dates, status, popularity, users, and likes.'
}

export async function answerVacationDatabaseQuestion(question: string) {
  const snapshot = await getVacationDatabaseSnapshot()
  if (!config.openai.apiKey) return answerWithoutOpenAI(question, snapshot)

  const client = new OpenAI({ apiKey: config.openai.apiKey, timeout: 60000, maxRetries: 2 })
  const result = await client.responses.create({
    model: config.openai.model,
    instructions: [
      "You are Voyanta's read-only vacation database assistant.",
      'Answer only from the provided database snapshot.',
      'Never invent values or reveal passwords, tokens, private identities, or technical secrets.',
      'You may calculate, compare, filter, count, rank, summarize, and explain the vacation data.',
      'Answer in the same language as the user and include exact values when relevant.',
      'If the question is unrelated to the snapshot, explain that you only answer questions about Voyanta data.'
    ].join(' '),
    input: `User question:\n${question}\n\nCurrent database snapshot:\n${JSON.stringify(snapshot)}`
  })

  return result.output_text?.trim() || answerWithoutOpenAI(question, snapshot)
}
