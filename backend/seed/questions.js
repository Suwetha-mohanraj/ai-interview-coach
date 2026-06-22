import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Question from '../models/question.model.js'

dotenv.config({ path: '../.env' })

const questions = [
  // ── Software Engineer ───────────────────────────────
  {
    role_tag: 'Software Engineer',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Tell me about yourself and your background in software development.',
    ideal_keywords: ['experience', 'skills', 'projects', 'education', 'passionate']
  },
  {
    role_tag: 'Software Engineer',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Describe a challenging project you worked on and how you handled it.',
    ideal_keywords: ['challenge', 'solution', 'teamwork', 'outcome', 'learned']
  },
  {
    role_tag: 'Software Engineer',
    category: 'behavioral',
    difficulty: 'medium',
    question_text: 'Tell me about a time you had a conflict with a team member. How did you resolve it?',
    ideal_keywords: ['communication', 'compromise', 'resolved', 'professional', 'outcome']
  },
  {
    role_tag: 'Software Engineer',
    category: 'technical',
    difficulty: 'easy',
    question_text: 'What is Object-Oriented Programming? Explain its four main principles.',
    ideal_keywords: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction']
  },
  {
    role_tag: 'Software Engineer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is the difference between an array and a linked list? When would you use each?',
    ideal_keywords: ['array', 'linked list', 'memory', 'index', 'dynamic', 'random access']
  },
  {
    role_tag: 'Software Engineer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'Explain what a REST API is and what makes an API RESTful.',
    ideal_keywords: ['stateless', 'HTTP', 'GET', 'POST', 'PUT', 'DELETE', 'endpoints', 'JSON']
  },
  {
    role_tag: 'Software Engineer',
    category: 'technical',
    difficulty: 'hard',
    question_text: 'What is time complexity? Explain Big O notation with examples.',
    ideal_keywords: ['O(n)', 'O(1)', 'O(n²)', 'efficiency', 'algorithm', 'worst case']
  },
  {
    role_tag: 'Software Engineer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is the difference between SQL and NoSQL databases? When would you choose each?',
    ideal_keywords: ['structured', 'schema', 'MongoDB', 'MySQL', 'scalability', 'flexible']
  },

  // ── Data Analyst ────────────────────────────────────
  {
    role_tag: 'Data Analyst',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Tell me about yourself and why you want to be a data analyst.',
    ideal_keywords: ['data', 'insights', 'problem solving', 'analytical', 'visualization']
  },
  {
    role_tag: 'Data Analyst',
    category: 'behavioral',
    difficulty: 'medium',
    question_text: 'Describe a time when you had to explain a complex data finding to a non-technical audience.',
    ideal_keywords: ['simplified', 'visual', 'storytelling', 'clear', 'stakeholders']
  },
  {
    role_tag: 'Data Analyst',
    category: 'technical',
    difficulty: 'easy',
    question_text: 'What is the difference between mean, median, and mode? When is each most useful?',
    ideal_keywords: ['mean', 'median', 'mode', 'average', 'outliers', 'skewed']
  },
  {
    role_tag: 'Data Analyst',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'Write a SQL query to find the top 5 customers by total purchase amount.',
    ideal_keywords: ['SELECT', 'SUM', 'GROUP BY', 'ORDER BY', 'DESC', 'LIMIT']
  },
  {
    role_tag: 'Data Analyst',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is data normalization and why is it important?',
    ideal_keywords: ['normalize', 'scale', 'range', 'min-max', 'standard deviation', 'comparison']
  },
  {
    role_tag: 'Data Analyst',
    category: 'technical',
    difficulty: 'hard',
    question_text: 'What is the difference between correlation and causation? Give a real-world example.',
    ideal_keywords: ['correlation', 'causation', 'relationship', 'independent', 'confounding']
  },

  // ── Frontend Developer ──────────────────────────────
  {
    role_tag: 'Frontend Developer',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Tell me about yourself and what drew you to frontend development.',
    ideal_keywords: ['UI', 'user experience', 'visual', 'creative', 'web']
  },
  {
    role_tag: 'Frontend Developer',
    category: 'behavioral',
    difficulty: 'medium',
    question_text: 'How do you stay updated with the latest frontend technologies and trends?',
    ideal_keywords: ['blog', 'documentation', 'community', 'practice', 'courses', 'GitHub']
  },
  {
    role_tag: 'Frontend Developer',
    category: 'technical',
    difficulty: 'easy',
    question_text: 'What is the difference between == and === in JavaScript?',
    ideal_keywords: ['type coercion', 'strict equality', 'loose equality', 'type conversion']
  },
  {
    role_tag: 'Frontend Developer',
    category: 'technical',
    difficulty: 'easy',
    question_text: 'What is the DOM? How does JavaScript interact with it?',
    ideal_keywords: ['Document Object Model', 'tree', 'nodes', 'querySelector', 'manipulation']
  },
  {
    role_tag: 'Frontend Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'Explain event bubbling and event capturing in JavaScript.',
    ideal_keywords: ['propagation', 'parent', 'child', 'stopPropagation', 'addEventListener']
  },
  {
    role_tag: 'Frontend Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What are React hooks? Explain useState and useEffect with examples.',
    ideal_keywords: ['useState', 'useEffect', 'functional component', 'side effects', 'state']
  },

  // ── Backend Developer ───────────────────────────────
  {
    role_tag: 'Backend Developer',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Tell me about yourself and your experience with backend development.',
    ideal_keywords: ['server', 'API', 'database', 'performance', 'scalability']
  },
  {
    role_tag: 'Backend Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is middleware in Express.js? Give an example of how you have used it.',
    ideal_keywords: ['middleware', 'request', 'response', 'next', 'authentication', 'logging']
  },
  {
    role_tag: 'Backend Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'How does JWT authentication work? Walk me through the complete flow.',
    ideal_keywords: ['token', 'header', 'payload', 'signature', 'secret', 'verify', 'stateless']
  },
  {
    role_tag: 'Backend Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is a database index and how does it improve query performance?',
    ideal_keywords: ['index', 'query', 'performance', 'search', 'B-tree', 'faster']
  },
  {
    role_tag: 'Backend Developer',
    category: 'technical',
    difficulty: 'hard',
    question_text: 'What is the difference between REST and GraphQL? When would you choose GraphQL?',
    ideal_keywords: ['REST', 'GraphQL', 'over-fetching', 'under-fetching', 'schema', 'query']
  },

  // ── Full Stack Developer ────────────────────────────
  {
    role_tag: 'Full Stack Developer',
    category: 'behavioral',
    difficulty: 'easy',
    question_text: 'Tell me about yourself and why you chose full stack development.',
    ideal_keywords: ['frontend', 'backend', 'complete', 'versatile', 'end-to-end']
  },
  {
    role_tag: 'Full Stack Developer',
    category: 'technical',
    difficulty: 'easy',
    question_text: 'Explain the MERN stack. What does each technology do?',
    ideal_keywords: ['MongoDB', 'Express', 'React', 'Node', 'database', 'server', 'frontend']
  },
  {
    role_tag: 'Full Stack Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'What is CORS and why do we need it? How did you handle it in your projects?',
    ideal_keywords: ['Cross Origin', 'browser', 'security', 'headers', 'allow', 'origin']
  },
  {
    role_tag: 'Full Stack Developer',
    category: 'technical',
    difficulty: 'medium',
    question_text: 'Walk me through what happens when a user logs in to your web application.',
    ideal_keywords: ['request', 'server', 'database', 'password', 'hash', 'token', 'response']
  },
  {
    role_tag: 'Full Stack Developer',
    category: 'technical',
    difficulty: 'hard',
    question_text: 'How would you optimize a slow web application? What are the common bottlenecks?',
    ideal_keywords: ['caching', 'database query', 'lazy loading', 'CDN', 'compression', 'profiling']
  }
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview-coach')
    console.log('MongoDB connected')

    // Clear existing questions
    await Question.deleteMany({})
    console.log('Cleared existing questions')

    // Insert all questions
    await Question.insertMany(questions)
    console.log(`✅ Successfully seeded ${questions.length} questions`)

    mongoose.connection.close()
  } catch (error) {
    console.error('Seeding error:', error.message)
    process.exit(1)
  }
}

seedDB()