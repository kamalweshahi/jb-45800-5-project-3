import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { askMcp } from '../controllers/mcp/controller'
import { mcpQuestionValidator } from '../controllers/mcp/validator'

const router = Router()

router.post('/ask', bodyValidation(mcpQuestionValidator), askMcp)

export default router
