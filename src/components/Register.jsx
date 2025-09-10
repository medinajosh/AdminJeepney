import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import jeepneyIllustration from "../assets/clear.png"; // Update the path if needed

export default function Register({ goToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate registration process
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Registration successful! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        goToLogin();
      }, 2000);
    }, 1000);
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
            Join the smarter commute. Register now and manage your routes, schedules, and more.
          </p>
        </div>

        {/* Right: Registration Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-[#23B1B7] mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">Sign up to get started</p>

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

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-[#23B1B7]" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#23B1B7]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#23B1B7] focus:outline-none focus:ring-2 focus:ring-[#23B1B7] placeholder-gray-400 text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs text-center -mt-2">{error}</p>
            )}

            {/* Success Message */}
            {successMessage && (
              <p className="text-green-600 text-xs text-center -mt-2">{successMessage}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#23B1B7] text-white rounded-full text-sm font-medium hover:bg-[#1D8A9C] transition-all duration-200"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Optional Links */}
          <div className="flex justify-between mt-4 text-xs text-[#23B1B7]">
            <button onClick={goToLogin} className="hover:underline">Already have an account?</button>
            <button className="hover:underline">Need Help?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
