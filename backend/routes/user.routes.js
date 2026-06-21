import express from 'express'
import multer from 'multer'
import path from 'path'
import { getProfile, updateProfile, analyzeResume, setRole } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

// Multer config — save uploaded PDF to /uploads folder temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/analyze-resume', protect, upload.single('resume'), analyzeResume)
router.put('/set-role', protect, setRole)

export default router