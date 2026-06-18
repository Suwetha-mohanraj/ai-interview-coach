import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false, message: 'All fields are required'
      })
    }

    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email must be lowercase and in a valid format (e.g. name@gmail.com)'
      })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password_hash: password })
    res.status(201).json({ success: true, token: generateToken(user._id), user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    res.status(200).json({ success: true, token: generateToken(user._id), user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}