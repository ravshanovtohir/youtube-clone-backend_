import auth from '../controllers/auth.js'
import { Router, request } from 'express'

const router = Router()

router.post('/api/v1/auth/register', auth.REGISTER)
router.post('/api/v1/auth/login', auth.LOGIN)

export default router