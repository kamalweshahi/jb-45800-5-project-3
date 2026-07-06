import OpenAI from 'openai'
import config from '../config'
import { daysBetween } from '../utils/date-utils'

type VacationForAi = {
  destination: string
  description: string
  startDate: string
  endDate: string
}

function fallbackItinerary(vacation: VacationForAi) {
  const duration = daysBetween(vacation.startDate, vacation.endDate)

  return `## ${vacation.destination} Vacation Itinerary

This is a local fallback recommendation because no OpenAI API key was provided.

**Duration:** ${duration} days

**Day 1:** Arrive, check in, and take a relaxed orientation walk near the central area.

**Day 2:** Visit the main cultural sites and keep the evening open for a local dinner.

**Middle days:** Mix one guided experience with independent exploring so the trip feels planned but not crowded.

**Final day:** Choose a slower activity, buy small souvenirs, and leave enough time for travel.

**Tip:** Keep one backup indoor activity in case the weather changes.`
}

export async function buildVacationItinerary(
  vacation: VacationForAi
) {
  if (!config.openai.apiKey) {
    return fallbackItinerary(vacation)
  }

  const duration = daysBetween(
    vacation.startDate,
    vacation.endDate
  )

  if (
    !vacation.destination ||
    !vacation.description ||
    !vacation.startDate ||
    !vacation.endDate ||
    !Number.isFinite(duration)
  ) {
    throw new Error(
      'Vacation data is incomplete. Destination, description, start date, and end date are required.'
    )
  }

  const client = new OpenAI({
    apiKey: config.openai.apiKey,
    timeout: 60000,
    maxRetries: 2
  })

  const prompt = `
Create a polished ${duration}-day vacation itinerary for ${vacation.destination}.

Vacation description:
${vacation.description}

Formatting requirements:
- Start with one short introduction of no more than 2 sentences.
- Use this exact title format:
  # ${duration}-Day ${vacation.destination} Itinerary
- For every day, use:
  ## Day 1 — Short title
- Under every day, include only:
  - **Morning:** ...
  - **Afternoon:** ...
  - **Evening:** ...
  - **Local tip:** ...
- Keep every activity concise and practical.
- Do not use horizontal lines such as ---.
- Do not add excessive blank lines.
- Do not repeat the destination name unnecessarily.
- Do not recommend a specific restaurant unless it is well known and genuinely relevant.
- Include a final section:
  ## Before you go
  With 3 short practical travel tips.
- Match the itinerary to exactly ${duration} days.
- Do not ask the user for more information.
- Return Markdown only.
`

  const result = await client.responses.create({
    model: config.openai.model,
    input: prompt
  })

  return result.output_text?.trim() || fallbackItinerary(vacation)
}