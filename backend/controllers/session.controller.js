import Session from '../models/session.model.js'
import Response from '../models/response.model.js'
import Question from '../models/question.model.js'
import User from '../models/user.model.js'

// ── POST /api/sessions ──────────────────────────────────
// Create a new interview session
export const createSession = async (req, res) => {
  try {
    const { role, difficulty, question_count } = req.body

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' })
    }

    // Build query based on difficulty
    const query = { role_tag: role }
    if (difficulty && difficulty !== 'mixed') {
      query.difficulty = difficulty
    }

    // Fetch questions for this role from DB
    const allQuestions = await Question.find(query)

    if (allQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for role: ${role}. Please seed the database.`
      })
    }

    // Shuffle and pick required number
    const count = question_count || 5
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, Math.min(count, allQuestions.length))

    // Create session in DB
    const session = await Session.create({
      user_id: req.user._id,
      role_applied: role,
      difficulty: difficulty || 'mixed',
      question_count: selectedQuestions.length,
      questions_answered: 0,
      status: 'active'
    })

    res.status(201).json({
      success: true,
      session,
      questions: selectedQuestions.map((q, i) => ({
        _id: q._id,
        question_text: q.question_text,
        category: q.category,
        difficulty: q.difficulty,
        question_number: i + 1
      }))
    })
  } catch (error) {
    console.error('Create session error:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── POST /api/sessions/:id/response ────────────────────
// Submit an answer for a question
export const submitResponse = async (req, res) => {
  try {
    const { session_id, question_text, answer_text, question_number, time_taken_seconds } = req.body

    if (!question_text || question_number === undefined) {
      return res.status(400).json({ success: false, message: 'Question text and number are required' })
    }

    // Save the response
    const response = await Response.create({
      session_id: req.params.id,
      user_id: req.user._id,
      question_text,
      answer_text: answer_text || '',
      question_number,
      time_taken_seconds: time_taken_seconds || 0
    })

    // Update questions answered count
    await Session.findByIdAndUpdate(req.params.id, {
      $inc: { questions_answered: 1 }
    })

    res.status(201).json({ success: true, response })
  } catch (error) {
    console.error('Submit response error:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── PATCH /api/sessions/:id/complete ───────────────────
// Mark session as done
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: 'done',
        completed_at: new Date()
      },
      { new: true }
    )

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' })
    }

    // Update user total sessions count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { total_sessions: 1 }
    })

    res.status(200).json({ success: true, session })
  } catch (error) {
    console.error('Complete session error:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── GET /api/sessions/:id ───────────────────────────────
// Get session with all responses
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' })
    }

    const responses = await Response.find({
      session_id: req.params.id
    }).sort({ question_number: 1 })

    res.status(200).json({ success: true, session, responses })
  } catch (error) {
    console.error('Get session error:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── GET /api/sessions ───────────────────────────────────
// Get all sessions for current user
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user_id: req.user._id
    }).sort({ createdAt: -1 })

    res.status(200).json({ success: true, sessions })
  } catch (error) {
    console.error('Get sessions error:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}