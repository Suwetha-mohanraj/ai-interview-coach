import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const passwordRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/

  const passwordRules = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: '1 uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
    { label: '1 lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
    { label: '1 number (0-9)', test: (v) => /\d/.test(v) },
    { label: '1 special character (!@#$%^&*)', test: (v) => /[!@#$%^&*]/.test(v) }
  ]

  const isEmailValid = form.email.length === 0 ? null : emailRegex.test(form.email)
  const isPasswordValid = passwordRules.every((r) => r.test(form.password))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError('')

    // Auto-jump to password field once email becomes valid
    if (name === 'email' && emailRegex.test(value)) {
      passwordRef.current?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.password) {
      return setError('All fields are required')
    }
    if (!emailRegex.test(form.email)) {
      return setError('Email must be lowercase and valid (e.g. name@gmail.com)')
    }
    if (!isPasswordValid) {
      return setError('Password does not meet all requirements below')
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start practicing smarter interviews</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Suwetha Mohanraj"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@gmail.com"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                isEmailValid === null
                  ? 'border-gray-300 focus:ring-indigo-400'
                  : isEmailValid
                  ? 'border-green-400 focus:ring-green-300'
                  : 'border-red-400 focus:ring-red-300'
              }`}
            />
            {form.email.length > 0 && (
              <p className={`text-xs mt-1 ${isEmailValid ? 'text-green-600' : 'text-red-500'}`}>
                {isEmailValid ? '✓ Valid email format' : '✗ Must be lowercase, valid format (e.g. name@gmail.com)'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                form.password.length === 0
                  ? 'border-gray-300 focus:ring-indigo-400'
                  : isPasswordValid
                  ? 'border-green-400 focus:ring-green-300'
                  : 'border-red-400 focus:ring-red-300'
              }`}
            />
            {form.password.length > 0 && (
              <div className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const pass = rule.test(form.password)
                  return (
                    <p key={rule.label} className={`text-xs flex items-center gap-1.5 ${pass ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>{pass ? '✓' : '○'}</span>
                      {rule.label}
                    </p>
                  )
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register