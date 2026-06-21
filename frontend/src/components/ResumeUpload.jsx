import { useState } from 'react'
import api from '../api/axios'

const COMMON_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Business Analyst',
  'Software Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager'
]

const ResumeUpload = ({ onRoleSelected }) => {
  const [step, setStep] = useState('choose') // 'choose' | 'uploading' | 'suggestions' | 'manual'
  const [suggestions, setSuggestions] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [manualRole, setManualRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      return setError('Only PDF files are allowed')
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('File size must be under 5MB')
    }

    setFileName(file.name)
    setError('')
    setLoading(true)
    setStep('uploading')

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const { data } = await api.post('/users/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuggestions(data.suggestions)
      setStep('suggestions')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Try again.')
      setStep('choose')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRole = async (role) => {
    setLoading(true)
    try {
      const { data } = await api.put('/users/set-role', { role })
      onRoleSelected(data.user)
    } catch (err) {
      setError('Failed to set role. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async () => {
    const role = manualRole || selectedRole
    if (!role) return setError('Please select or type a role')
    await handleConfirmRole(role)
  }

  // ── Step 1: Choose upload or skip ──────────────────────
  if (step === 'choose') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Set your target role</h2>
        <p className="text-sm text-gray-500 mb-5">Upload your resume and we'll suggest the best matching roles, or pick one manually.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Upload option */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer hover:bg-indigo-50 transition-colors">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium text-indigo-700 text-center">Upload Resume</p>
            <p className="text-xs text-gray-400 text-center mt-1">PDF only, max 5MB</p>
            <p className="text-xs text-indigo-500 mt-2 text-center">AI will suggest matching roles</p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Manual option */}
          <button
            onClick={() => setStep('manual')}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-medium text-gray-700 text-center">Choose Manually</p>
            <p className="text-xs text-gray-400 text-center mt-1">Skip resume upload</p>
            <p className="text-xs text-gray-500 mt-2 text-center">Pick from common roles</p>
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Uploading/analyzing ─────────────────────────
  if (step === 'uploading') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col items-center py-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-900">Analyzing your resume...</p>
          <p className="text-xs text-gray-500 mt-1">{fileName}</p>
          <p className="text-xs text-gray-400 mt-2">Claude AI is reading your skills and experience</p>
        </div>
      </div>
    )
  }

  // ── Step 3: Show AI suggestions ─────────────────────────
  if (step === 'suggestions') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <h2 className="text-base font-semibold text-gray-900">AI Role Suggestions</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Based on your resume, here are your best matching roles. Pick one to start practicing.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-4">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleConfirmRole(s.role)}
              disabled={loading}
              className="w-full text-left border border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{s.role}</p>
                <span className="text-xs text-indigo-600 font-medium">Select →</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{s.reason}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep('manual')}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          None of these? Choose manually instead
        </button>
      </div>
    )
  }

  // ── Step 4: Manual role selection ──────────────────────
  if (step === 'manual') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Choose your target role</h2>
        <p className="text-sm text-gray-500 mb-5">Select from the list or type your own role below.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {COMMON_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`text-left text-sm px-3 py-2.5 rounded-lg border transition-all ${
                selectedRole === role
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-indigo-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Or type a custom role
          </label>
          <input
            type="text"
            value={manualRole}
            onChange={(e) => {
              setManualRole(e.target.value)
              setSelectedRole('')
            }}
            placeholder="e.g. Cloud Engineer, QA Analyst..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleManualSubmit}
            disabled={loading || (!selectedRole && !manualRole)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Saving...' : 'Confirm Role'}
          </button>
          <button
            onClick={() => setStep('choose')}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    )
  }
}

export default ResumeUpload