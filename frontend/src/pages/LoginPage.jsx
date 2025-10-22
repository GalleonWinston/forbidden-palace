import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Castle } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ ...formData, email: formData.email.toLowerCase() });
  };

  return (
    <div className="h-screen grid bg-gradient-to-br from-amber-50 to-red-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-10 left-10 text-6xl">🐉</div>
        <div className="absolute bottom-10 right-10 text-6xl">🏯</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">⛩️</div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-red-800 to-red-600 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200">
              <Castle className="h-8 w-8 text-amber-200" />
            </div>
            <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
              Forbidden Palace
            </h1>
            <p className="text-gray-600 mt-2">Enter the Imperial Gardens</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-200">
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Imperial Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  type="email"
                  className="block w-full border border-amber-300 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50 transition-all"
                  placeholder="emperor@forbidden-palace.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Imperial Seal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full border border-amber-300 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-amber-100 rounded-r-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-amber-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-800 text-amber-50 font-semibold py-3 rounded-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 flex justify-center items-center gap-2 border border-amber-200"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Entering Palace...
                </>
              ) : (
                <>
                  <Castle className="h-5 w-5" />
                  Enter Forbidden Palace
                </>
              )}
            </button>
          </form>

          <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-amber-200">
            <p className="text-gray-600">
              Not of imperial blood?{" "}
              <Link to="/signup" className="text-red-700 hover:text-red-800 font-medium hover:underline transition-colors">
                Request Audience
              </Link>
            </p>
          </div>

          {/* Decorative border */}
          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-amber-500 rounded-full opacity-60"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;