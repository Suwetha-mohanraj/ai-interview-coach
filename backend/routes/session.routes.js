import express from 'express'
import {
  createSession,
  submitResponse,
  completeSession,
  getSession,
  getUserSessions
} from '../controllers/session.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// All session routes are protected
router.post('/', protect, createSession)
router.get('/', protect, getUserSessions)
router.get('/:id', protect, getSession)
router.post('/:id/response', protect, submitResponse)
router.patch('/:id/complete', protect, completeSession)

export default router