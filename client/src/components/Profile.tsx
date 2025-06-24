import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-500 animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">You must be logged in to view this page.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-orange-300">
        <img
          src={user?.picture}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full shadow-md border-4 border-white mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h1>
        <p className="text-gray-600 mb-1"><strong>Email:</strong> {user?.email}</p>
        <p className="text-gray-600"><strong>Nickname:</strong> {user?.nickname}</p>
      </div>
    </div>
  )
}

export default Profile
