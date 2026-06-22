import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const TIMER_SECONDS = 90

const InterviewRoom = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [submitting, setSubmitting] = useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)

  const timerRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const answerRef = useRef('') // tracks answer without stale closure
  const currentIndexRef = useRef(0)
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('interview_questions')
    if (stored) {
      setQuestions(JSON.parse(stored))
    } else {
      navigate('/dashboard')
    }
  }, [])

  // Keep refs in sync
  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const submitAnswer = useCallback(async (questionsList, index, answerText, autoSubmit = false) => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    clearInterval(timerRef.current)

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    const currentQ = questionsList[index]

    try {
      await api.post(`/sessions/${sessionId}/response`, {
        question_text: currentQ.question_text,
        answer_text: answerText.trim() || '(No answer provided)',
        question_number: currentQ.question_number,
        time_taken_seconds: timeTaken
      })
    } catch (err) {
      console.error('Submit response error:', err)
    }

    const isLast = index === questionsList.length - 1

    if (isLast) {
      try {
        await api.patch(`/sessions/${sessionId}/complete`)
      } catch (err) {
        console.error('Complete session error:', err)
      }
      sessionStorage.removeItem('interview_questions')
      sessionStorage.removeItem('interview_session')
      navigate(`/session-summary/${sessionId}`)
    } else {
      setAnswer('')
      answerRef.current = ''
      setCurrentIndex(index + 1)
      currentIndexRef.current = index + 1
      setTimeLeft(TIMER_SECONDS)
      startTimeRef.current = Date.now()
      setSubmitting(false)
      setIsAutoSubmitting(false)
      isSubmittingRef.current = false
    }
  }, [sessionId, navigate])

  // Start timer when index or questions change
  useEffect(() => {
    if (questions.length === 0) return

    clearInterval(timerRef.current)
    setTimeLeft(TIMER_SECONDS)
    startTimeRef.current = Date.now()
    isSubmittingRef.current = false

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsAutoSubmitting(true)
          // Use refs to get current values without stale closure
          submitAnswer(questions, currentIndexRef.current, answerRef.current, true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, questions])

  const handleNext = () => {
    if (isSubmittingRef.current) return
    setSubmitting(true)
    submitAnswer(questions, currentIndexRef.current, answerRef.current, false)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const progress = (currentIndex / questions.length) * 100
  const timerPct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft > 30 ? '#4F46E5' : timeLeft > 10 ? '#F59E0B' : '#EF4444'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-semibold text-gray-900 text-sm">AI Interview Coach</span>
        </div>
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* Main content */}
          <div className="flex-1">
            {/* Category + difficulty badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                currentQ.category === 'behavioral'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentQ.category === 'behavioral' ? '💬 Behavioral' : '⚙️ Technical'}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                currentQ.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                {currentQ.question_text}
              </h2>
            </div>

            {/* Auto-submit warning */}
            {isAutoSubmitting && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
                ⏰ Time's up — submitting your answer...
              </div>
            )}

            {/* Answer area */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Your answer</label>
                <button
                  disabled
                  title="Voice mode coming in Week 5"
                  className="flex items-center gap-1.5 text-xs text-gray-300 border border-gray-200 rounded-lg px-3 py-1.5 cursor-not-allowed"
                >
                  🎤 Voice — coming soon
                </button>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here. Be specific and give examples where possible..."
                rows={6}
                disabled={submitting || isAutoSubmitting}
                className="w-full text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none disabled:opacity-50"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{answer.length} characters</span>
                <span className="text-xs text-gray-400">
                  {answer.split(' ').filter(w => w).length} words
                </span>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={submitting || isAutoSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl text-sm transition-colors"
            >
              {submitting || isAutoSubmitting
                ? 'Saving...'
                : currentIndex === questions.length - 1
                ? 'Finish Interview ✓'
                : 'Next Question →'}
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              Timer auto-submits when it reaches 0
            </p>
          </div>

          {/* Timer sidebar */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - timerPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold" style={{ color: timerColor }}>
                  {timeLeft}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400 text-center">seconds<br />remaining</span>

            {/* Question dots */}
            <div className="flex flex-col gap-2 mt-4">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < currentIndex
                      ? 'bg-green-400'
                      : i === currentIndex
                      ? 'bg-indigo-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default InterviewRoom