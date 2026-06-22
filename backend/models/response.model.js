import mongoose from 'mongoose'

const responseSchema = new mongoose.Schema(
  {
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question_text: {
      type: String,
      required: true
    },
    question_number: {
      type: Number,
      required: true
    },
    answer_text: {
      type: String,
      default: ''
    },
    time_taken_seconds: {
      type: Number,
      default: 0
    },
    // Week 4 — AI fills these
    score: {
      type: Number,
      default: null
    },
    ai_feedback: {
      type: String,
      default: null
    },
    improved_answer: {
      type: String,
      default: null
    },
    keywords_hit: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
)

const Response = mongoose.model('Response', responseSchema)
export default Response