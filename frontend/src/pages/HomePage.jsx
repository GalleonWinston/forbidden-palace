import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { LogOut } from "lucide-react";

const HomePages = () => {
  const { logout } = useAuthStore();
  return (
    <div>HomePages
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
    </div>
  )
}

export default HomePages