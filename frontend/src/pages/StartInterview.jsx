import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const StartInterview = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [difficulty, setDifficulty] = useState('mixed')
  const [questionCount, setQuestionCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentRole, setCurrentRole] = useState(user?.target_role || '')

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const { data } = await api.get('/users/profile')
        setCurrentRole(data.user.target_role || '')
      } catch (err) {
        setCurrentRole(user?.target_role || '')
      }
    }
    fetchLatestUser()
  }, [])

  const handleStart = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/sessions', {
        role: currentRole,
        difficulty,
        question_count: questionCount
      })

      // Store questions in sessionStorage for InterviewRoom
      sessionStorage.setItem('interview_questions', JSON.stringify(data.questions))
      sessionStorage.setItem('interview_session', JSON.stringify(data.session))

      navigate(`/interview/${data.session._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎤</div>
          <h1 className="text-2xl font-semibold text-gray-900">Interview Setup</h1>
          <p className="text-gray-500 text-sm mt-1">
            Preparing for: <span className="font-medium text-indigo-600">{currentRole || 'No role set'}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* Question count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of questions
          </label>
          <div className="flex gap-3">
            {[5, 7, 10].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  questionCount === count
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
              >
                {count} questions
                <div className="text-xs font-normal mt-0.5 text-gray-400">
                  {count === 5 ? '~8 mins' : count === 7 ? '~12 mins' : '~17 mins'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Difficulty level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'easy', label: 'Easy', desc: 'Basic concepts', emoji: '🟢' },
              { value: 'medium', label: 'Medium', desc: 'Intermediate level', emoji: '🟡' },
              { value: 'hard', label: 'Hard', desc: 'Advanced questions', emoji: '🔴' },
              { value: 'mixed', label: 'Mixed', desc: 'All levels', emoji: '🎲' }
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  difficulty === d.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-lg mb-1">{d.emoji}</div>
                <div className={`text-sm font-medium ${difficulty === d.value ? 'text-indigo-700' : 'text-gray-900'}`}>
                  {d.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-blue-800 mb-2">💡 Tips for best results</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Answer in full sentences, not just keywords</li>
            <li>• Use the STAR method for behavioral questions</li>
            <li>• You have 90 seconds per question</li>
            <li>• Your answers will be saved automatically</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Setting up...' : 'Start Interview 🚀'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartInterview