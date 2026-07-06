import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { getAiRecommendation } from '../controllers/ai/controller'
import { aiRecommendationValidator } from '../controllers/ai/validator'

const router = Router()

router.post('/recommendation', bodyValidation(aiRecommendationValidator), getAiRecommendation)

export default router
