import React from 'react'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useEsp32Store } from '../store/useEsp32Store'

const Navbar = () => {

    const { logout } = useAuthStore()
    const { setDevices, setData, setSelectedDevice } = useEsp32Store()

    const handleLogout = () => {
        setSelectedDevice(null) // Clear selected device when logging out
        setData([]) // Clear data when logging out
        setDevices([]) // Clear devices when logging out
        logout()
    }


  return (
    <nav className="w-full bg-blue-600 px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-white font-bold text-xl tracking-wide">
        IoT Waste System
      </div>
      <button
        className="flex gap-2 items-center bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors font-semibold shadow"
        onClick={() => handleLogout()}
      >
        <LogOut className="size-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  )
}

export default Navbar