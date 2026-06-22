import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role_applied: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed'
    },
    status: {
      type: String,
      enum: ['active', 'done'],
      default: 'active'
    },
    question_count: {
      type: Number,
      default: 5
    },
    questions_answered: {
      type: Number,
      default: 0
    },
    overall_score: {
      type: Number,
      default: 0
    },
    started_at: {
      type: Date,
      default: Date.now
    },
    completed_at: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

const Session = mongoose.model('Session', sessionSchema)
export default Session