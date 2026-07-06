import Joi from 'joi'

export const mcpQuestionValidator = Joi.object({
  question: Joi.string().trim().min(3).max(500).required().messages({ 'any.required': 'Question is required.' })
})
