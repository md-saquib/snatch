import express from 'express'
import { validateUserRegistration } from '../validator/auth.validator.js'
import { HydrateUser, Login, Logout, RefreshToken, Register } from '../controller/auth.controller.js'
import { authenticateMe } from '../middleware/verifyUser.js'

const router = express.Router()


router.post('/register', validateUserRegistration, Register)

router.get('/me', authenticateMe, HydrateUser)

router.get('/refreshToken', RefreshToken)

router.post('/login', Login)

router.get('/logout', authenticateMe, Logout)
export default router