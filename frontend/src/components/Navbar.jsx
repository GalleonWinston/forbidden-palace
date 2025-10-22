import React, { useEffect } from "react";
import { LogOut, Copy, Castle, Shield } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEsp32Store } from "../store/useEsp32Store";

const Navbar = () => {
  const { logout, userProfile, getUserProfile } = useAuthStore();
  const { setDevices, setData, setSelectedDevice } = useEsp32Store();

  const handleLogout = () => {
    setSelectedDevice(null); // Clear selected device when logging out
    setData([]); // Clear data when logging out
    setDevices([]); // Clear devices when logging out
    logout();
  };

  const handleCopyId = () => {
    if (userProfile?.id) {
      navigator.clipboard.writeText(userProfile.id);
      // You could add a toast notification here: toast.success("Imperial Seal Copied!");
    }
  };

  useEffect(() => {
    getUserProfile(); // Runs only once on mount
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-red-800 to-red-700 px-6 py-4 flex justify-between items-center shadow-lg border-b-2 border-amber-200">
      {/* Left Section - Logo and User Info */}
      <div className="text-amber-50 font-bold text-xl tracking-wide flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-200 h-12 w-12 rounded-full flex items-center justify-center shadow-lg border border-amber-300">
            <Castle className="h-6 w-6 text-red-800" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-normal text-amber-100">Forbidden Palace</div>
            <div className="text-lg">Imperial Control</div>
          </div>
        </div>

        {/* User Greeting */}
        <div className="border-l border-amber-300/30 pl-6">
          <span className="text-amber-100">Welcome, Imperial Official </span>
          <span className="text-amber-200">{userProfile?.name || ""}</span>
        </div>

        {/* User ID with Imperial Styling */}
        {userProfile?.id && (
          <div className="flex items-center gap-2 bg-amber-50/10 px-3 py-2 rounded-lg border border-amber-200/30">
            <Shield className="size-4 text-amber-200" />
            <span className="text-sm font-mono text-amber-100">{userProfile.id}</span>
            <button
              onClick={handleCopyId}
              className="p-1 bg-amber-200 text-red-800 rounded hover:bg-amber-300 transition-colors shadow hover:scale-105"
              title="Copy Imperial Seal"
            >
              <Copy className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="flex gap-2 items-center bg-amber-200 text-red-800 px-5 py-2.5 rounded-lg hover:bg-amber-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl border border-amber-300 group"
        onClick={handleLogout}
      >
        <LogOut className="size-5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline">Leave Palace</span>
      </button>
    </nav>
  );
};

export default Navbar;