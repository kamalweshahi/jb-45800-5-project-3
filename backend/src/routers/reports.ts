import { Router } from 'express'
import adminEnforce from '../middlewares/admin-enforce'
import { downloadLikesCsv, getLikesReport } from '../controllers/reports/controller'

const router = Router()

router.use(adminEnforce)
router.get('/likes', getLikesReport)
router.get('/likes.csv', downloadLikesCsv)

export default router
