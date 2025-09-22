import React, { useEffect } from 'react'
import { LogOut, Copy } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useEsp32Store } from '../store/useEsp32Store'

const Navbar = () => {
  const { logout, userProfile, getUserProfile } = useAuthStore()
  const { setDevices, setData, setSelectedDevice } = useEsp32Store()

  const handleLogout = () => {
    setSelectedDevice(null) // Clear selected device when logging out
    setData([]) // Clear data when logging out
    setDevices([]) // Clear devices when logging out
    logout()
  }

  const handleCopyId = () => {
    if (userProfile?.id) {
      navigator.clipboard.writeText(userProfile.id)
    }
  }

  useEffect(() => {
    getUserProfile(); // Runs only once on mount
  }, [])

  return (
    <nav className="w-full bg-blue-600 px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-white font-bold text-xl tracking-wide flex items-center gap-8">
        <span>IoT Waste System</span>
        <span>Hello, {userProfile?.name || ""}</span>

        <div className="flex items-center gap-2">
          <span className='text-sm'>{userProfile?.id || ""}</span>
          {userProfile?.id && (
            <button
              onClick={handleCopyId}
              className="p-1 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors shadow"
              title="Copy ID"
            >
              <Copy className="size-4" />
            </button>
          )}
        </div>
      </div>
      <button
        className="flex gap-2 items-center bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors font-semibold shadow"
        onClick={handleLogout}
      >
        <LogOut className="size-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  )
}

export default Navbar
