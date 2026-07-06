import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import adminEnforce from '../middlewares/admin-enforce'
import { imageUpload } from '../middlewares/file-upload'
import { createVacation, deleteVacation, getDestinations, getVacation, getVacations, toggleLike, updateVacation } from '../controllers/vacations/controller'
import { createVacationValidator, updateVacationValidator } from '../controllers/vacations/validator'

const router = Router()

router.get('/', getVacations)
router.get('/destinations', getDestinations)
router.get('/:id', getVacation)
router.post('/', adminEnforce, imageUpload.single('image'), bodyValidation(createVacationValidator), createVacation)
router.put('/:id', adminEnforce, imageUpload.single('image'), bodyValidation(updateVacationValidator), updateVacation)
router.delete('/:id', adminEnforce, deleteVacation)
router.post('/:id/like', toggleLike)

export default router
