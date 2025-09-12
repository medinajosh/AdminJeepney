import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultPage, setDefaultPage] = useState("Dashboard");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // For password change modal
  const [currentPassword, setCurrentPassword] = useState(""); // Current password input
  const [newPassword, setNewPassword] = useState(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm new password input

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      // Add password change logic here (send to API, etc.)
      alert("Password changed successfully!");
      setIsPasswordModalOpen(false); // Close modal
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-[#23B1B7] mb-8">Account Settings</h1>

      {/* Account Settings */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">Login Info</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#23B1B7] transition"
              placeholder="Admin"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#23B1B7] transition"
              placeholder="admin@example.com"
            />
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">Security Settings</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Enable Two-Factor Authentication (2FA)</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Enable Session Timeout</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
            />
          </div>
        </div>
      </section>

      {/* Password Settings */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">Password Settings</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Change Password</span>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Save Settings */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-[#23B1B7]">
        <button className="w-full bg-[#23B1B7] text-white py-3 rounded-md hover:bg-teal-600 transition">
          Save Changes
        </button>
      </section>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-semibold text-[#23B1B7] mb-6">Change Password</h3>

            {/* Current Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#23B1B7] transition"
                placeholder="••••••••"
              />
            </div>

            {/* New Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#23B1B7] transition"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm New Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#23B1B7] transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-6 py-3 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
