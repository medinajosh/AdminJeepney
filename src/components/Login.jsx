import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import jeepneyIllustration from "../assets/clear.png"; // Update the path if needed
import { supabase } from "../config/supabase"; // Import the supabase client

export default function Login({ setIsAuthenticated, goToRegister }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Both fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Supabase sign-in with email and password
      const { user, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.username, // Treating username as email for authentication
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // If successful, update the authentication state
      setIsAuthenticated(true);
      setIsLoading(false);
      setError("");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

        {/* Left: Illustration */}
        <div className="md:w-1/2 hidden md:flex flex-col items-center justify-center bg-[#E3F9F2] p-10">
          <img
            src={jeepneyIllustration}
            alt="Jeepney Illustration"
            className="w-72 h-auto"
          />
          <p className="text-sm text-center mt-4 text-[#333] px-6">
            Navigate your jeepney routes with ease and accuracy. Built for commuters and operators alike.
          </p>
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-[#23B1B7] mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-[#23B1B7]" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#23B1B7] focus:outline-none focus:ring-2 focus:ring-[#23B1B7] placeholder-gray-400 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#23B1B7]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#23B1B7] focus:outline-none focus:ring-2 focus:ring-[#23B1B7] placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-[#23B1B7]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs text-center -mt-2">{error}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#23B1B7] text-white rounded-full text-sm font-medium hover:bg-[#1D8A9C] transition-all duration-200"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Optional Links */}
          <div className="flex justify-between mt-4 text-xs text-[#23B1B7]">
            <button className="hover:underline">Forgot Password?</button>
            <button onClick={goToRegister} className="hover:underline">
              Don't have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
