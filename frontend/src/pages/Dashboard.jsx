import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">AI Interview Coach</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hey, {user?.name?.split(' ')[0]}!</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {user?.target_role ? `Preparing for: ${user.target_role}` : 'Set your target role to get started'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sessions done', value: user?.total_sessions ?? 0 },
            { label: 'Avg score', value: user?.avg_score ? `${user.avg_score}%` : '—' },
            { label: 'Current streak', value: '1 day' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Ready to practice?</h2>
          <p className="text-gray-500 text-sm mb-5">Interview sessions and AI feedback coming in Week 3</p>
          <button disabled className="bg-indigo-100 text-indigo-400 font-medium px-6 py-2.5 rounded-lg text-sm cursor-not-allowed">
            Start interview — coming soon
          </button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard