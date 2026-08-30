import { Router } from 'express'
import Program from '../../models/Program.js'
import Trainer from '../../models/Trainer.js'
import Registration from '../../models/Registration.js'
import ContactMessage from '../../models/ContactMessage.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { apiSuccess } from '../../utils/apiResponse.js'

const router = Router()
router.use(authMiddleware)

router.get('/stats', async (req, res, next) => {
  try {
    const [programsCount, trainersCount, newRegistrationsCount, unreadMessagesCount] = await Promise.all([
      Program.countDocuments(),
      Trainer.countDocuments(),
      Registration.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments({ status: 'unread' }),
    ])

    return apiSuccess(res, {
      data: { programsCount, trainersCount, newRegistrationsCount, unreadMessagesCount },
    })
  } catch (err) {
    next(err)
  }
})

export default router
