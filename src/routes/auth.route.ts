import crypto from 'crypto'
import { Request, Response, Router } from 'express'
import { z } from 'zod'
import {
  AppError,
  asyncHandler,
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  successResponse
} from '../lib'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

type User = {
  id: string
  email: string
  username: string
  role: string
  password: string
}

const users: User[] = []

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body as z.infer<
      typeof registerSchema
    >

    if (users.find((u) => u.email === email)) {
      throw new AppError(409, 'Email already registered')
    }

    const hashed = await hashPassword(password)
    const id = crypto.randomUUID()

    users.push({ id, email, username, role: 'user', password: hashed })

    res.status(201).json(successResponse('Registration successful'))
  })
)

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>

    const user = users.find((u) => u.email === email)
    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      throw new AppError(401, 'Invalid email or password')
    }

    const jti = crypto.randomUUID()
    const payload = {
      email: user.email,
      username: user.username,
      role: user.role,
      jti,
      type: 'access' as const
    }

    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken({
      ...payload,
      jti,
      type: 'refresh'
    })

    res.json(
      successResponse('Login successful', {
        accessToken,
        refreshToken,
        user: { email: user.email, username: user.username, role: user.role }
      })
    )
  })
)

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    res.json(successResponse('Profile retrieved', { user: req.user }))
  })
)

export default router
