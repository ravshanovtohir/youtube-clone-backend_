import user from '../controllers/user.js'
import { Router, request } from 'express'

const router = Router()

router.get('/api/v1/users', user.GET)
router.get('/api/v1/users/:userId', user.GET)

export default router