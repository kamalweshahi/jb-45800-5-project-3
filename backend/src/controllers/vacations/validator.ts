import Joi from 'joi'

const dateOnly = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
  'string.pattern.base': 'Please enter a valid date.',
  'any.required': 'Date is required.'
})

const vacationFields = {
  destination: Joi.string().trim().min(2).max(120).required().messages({ 'any.required': 'Destination is required.' }),
  description: Joi.string().trim().min(20).max(5000).required().messages({ 'any.required': 'Description is required.' }),
  startDate: dateOnly.messages({ 'any.required': 'Start date is required.' }),
  endDate: dateOnly.messages({ 'any.required': 'End date is required.' }),
  price: Joi.number().min(0).max(10000).required().messages({
    'number.base': 'Price must be a number.',
    'number.min': 'Price cannot be negative.',
    'number.max': 'Price cannot be higher than 10,000.',
    'any.required': 'Price is required.'
  })
}

export const createVacationValidator = Joi.object(vacationFields)
export const updateVacationValidator = Joi.object(vacationFields)
