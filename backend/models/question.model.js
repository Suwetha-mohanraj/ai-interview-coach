import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    role_tag: {
      type: String,
      required: true
      // e.g. 'Software Engineer', 'Data Analyst', 'Frontend Developer'
    },
    category: {
      type: String,
      enum: ['behavioral', 'technical'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    question_text: {
      type: String,
      required: true
    },
    ideal_keywords: {
      type: [String],
      default: []
      // Week 4 uses these for keyword matching score
    }
  },
  { timestamps: true }
)

const Question = mongoose.model('Question', questionSchema)
export default Question