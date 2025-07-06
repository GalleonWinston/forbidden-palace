import React from 'react'
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";


const LoginPage = () => {
    const [ showPassword, setShowPassword ] = useState();
    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
    })
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData)
    }

  return (
    <div className="h-screen grid">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 flex justify-center items-center gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LoginPage