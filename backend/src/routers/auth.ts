import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import authEnforce from '../middlewares/auth-enforce'
import { getCurrentUser, googleLogin, login, register } from '../controllers/auth/controller'
import { googleValidator, loginValidator, registerValidator } from '../controllers/auth/validator'

const router = Router()

router.post('/register', bodyValidation(registerValidator), register)
router.post('/login', bodyValidation(loginValidator), login)
router.post('/google', bodyValidation(googleValidator), googleLogin)
router.get('/me', authEnforce, getCurrentUser)

export default router
