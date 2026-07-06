import Joi from 'joi'

export const aiRecommendationValidator = Joi.object({
  vacationId: Joi.number().integer().positive().required().messages({ 'any.required': 'Please select a destination.' })
})
