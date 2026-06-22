import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const SessionSummary = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/sessions/${sessionId}`)
        setSession(data.session)
        setResponses(data.responses)
      } catch (err) {
        console.error('Fetch session error:', err)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-semibold text-gray-900 text-sm">AI Interview Coach</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Completion banner */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-semibold mb-1">Interview Complete!</h1>
          <p className="text-indigo-200 text-sm">
            You answered {responses.length} questions for {session?.role_applied}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-semibold text-gray-900">{responses.length}</div>
            <div className="text-sm text-gray-500 mt-1">Questions answered</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {responses.length > 0
                ? Math.round(responses.reduce((a, r) => a + (r.time_taken_seconds || 0), 0) / responses.length)
                : 0}s
            </div>
            <div className="text-sm text-gray-500 mt-1">Avg time per Q</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-2xl font-semibold text-indigo-600">—</div>
            <div className="text-sm text-gray-500 mt-1">AI score (Week 4)</div>
          </div>
        </div>

        {/* AI feedback coming soon banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-sm font-medium text-amber-800">AI Feedback coming in Week 4</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Each answer will be scored, analysed for STAR method, and rewritten with improvements.
            </p>
          </div>
        </div>

        {/* Q&A list */}
        <h2 className="text-base font-semibold text-gray-900 mb-4">Your answers</h2>
        <div className="space-y-4">
          {responses.map((r, i) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-gray-900">{r.question_text}</p>
              </div>
              <div className="ml-9">
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {r.answer_text || <span className="text-gray-400 italic">No answer provided</span>}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">
                    ⏱ {r.time_taken_seconds}s
                  </span>
                  <span className="text-xs text-gray-300">
                    AI score: <span className="text-gray-400">pending (Week 4)</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate('/start-interview')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Practice Again 🔄
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default SessionSummary