import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, User, Castle, Scroll } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Imperial name is required");
    if (!formData.email.trim()) return toast.error("Imperial correspondence is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("The imperial seal is improperly formatted");
    if (!formData.password) return toast.error("Imperial cipher is required");
    if (formData.password.length < 6)
      return toast.error("Imperial cipher must be at least 6 characters long");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      signup({ ...formData, email: formData.email.toLowerCase() });
    }
  };

  return (
    <div className="min-h-screen grid bg-gradient-to-br from-amber-50 via-red-50 to-yellow-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-20 text-6xl">🧧</div>
        <div className="absolute bottom-20 right-20 text-6xl">🎋</div>
        <div className="absolute top-1/3 right-1/4 text-4xl">🏮</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl">🎐</div>
      </div>

      {/* left side  */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="mx-auto bg-gradient-to-br from-red-800 to-red-600 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200 group-hover:scale-105 transition-transform">
                <Castle className="h-8 w-8 text-amber-200" />
              </div>
              <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
                Join the Imperial Court
              </h1>
              <p className="text-gray-600">
                Receive your imperial scroll and begin your journey
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-200">
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Imperial Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  type="text"
                  className="block w-full border border-amber-300 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50 transition-all"
                  placeholder="Enter your imperial name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Imperial Correspondence</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  type="text"
                  className="block w-full border border-amber-300 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50 transition-all"
                  placeholder="messenger@imperial-court.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Imperial Cipher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scroll className="h-5 w-5 text-amber-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full border border-amber-300 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-amber-50/50 transition-all"
                  placeholder="Create your secret cipher"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-amber-100 rounded-r-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
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
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preparing Imperial Scroll...
                </>
              ) : (
                <>
                  <Scroll className="h-5 w-5" />
                  Receive Imperial Scroll
                </>
              )}
            </button>
          </form>

          <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-amber-200">
            <p className="text-gray-600">
              Already possess an imperial seal?{" "}
              <Link to="/login" className="text-red-700 hover:text-red-800 font-medium hover:underline transition-colors">
                Enter the Palace
              </Link>
            </p>
          </div>

          {/* Decorative border pattern */}
          <div className="flex justify-center space-x-3 mt-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-60"></div>
            ))}
          </div>
          
          {/* Imperial seal decorative element */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-amber-700 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Protected by Imperial Guard
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;