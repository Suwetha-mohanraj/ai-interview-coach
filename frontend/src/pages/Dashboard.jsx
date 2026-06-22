import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ResumeUpload from '../components/ResumeUpload'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(user)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRoleSelected = (updatedUser) => {
    setCurrentUser(updatedUser)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="font-semibold text-gray-900">AI Interview Coach</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hey, {currentUser?.name?.split(' ')[0]}!</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-semibold">Welcome, {currentUser?.name} 👋</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {currentUser?.target_role
              ? `Preparing for: ${currentUser.target_role}`
              : 'Upload your resume or choose a role to get started'}
          </p>
        </div>

        {!currentUser?.target_role && (
          <ResumeUpload onRoleSelected={handleRoleSelected} />
        )}

        {currentUser?.target_role && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Target role set ✓</p>
              <p className="text-sm text-green-600 mt-0.5">{currentUser.target_role}</p>
            </div>
            <button
              onClick={() => setCurrentUser({ ...currentUser, target_role: '' })}
              className="text-xs text-green-700 underline hover:text-green-900"
            >
              Change role
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sessions done', value: currentUser?.total_sessions ?? 0, icon: '📋' },
            { label: 'Avg score', value: currentUser?.avg_score ? `${currentUser.avg_score}%` : '—', icon: '📈' },
            { label: 'Current streak', value: '1 day', icon: '🔥' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Ready to practice?</h2>
          <p className="text-gray-500 text-sm mb-5">
            {currentUser?.target_role
              ? `Start a mock interview for ${currentUser.target_role}`
              : 'Set your target role above to begin'}
          </p>
          <button
            onClick={() => navigate('/start-interview')}
            disabled={!currentUser?.target_role}
            className={`font-medium px-6 py-2.5 rounded-lg text-sm transition-colors ${
              currentUser?.target_role
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
            }`}
          >
            {currentUser?.target_role ? 'Start Interview' : 'Set a role first'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard