import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultPage, setDefaultPage] = useState("Dashboard");

  return (
    <div className="p-8 max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-bold text-[#23B1B7]">Settings</h1>
      <p className="text-gray-600 mt-2 mb-6">Manage your app preferences and account.</p>

      {/* Account Settings */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">Account Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            Username:
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Admin"
            />
          </label>
          <label className="block">
            Password:
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              placeholder="••••••••"
            />
          </label>
        </div>

        <button className="mt-4 bg-[#23B1B7] text-white px-4 py-2 rounded hover:bg-teal-600 transition">
          Save Changes
        </button>
      </section>

      {/* App Preferences */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">App Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="toggle toggle-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Enable Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="toggle toggle-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Default Page</span>
            <select
              value={defaultPage}
              onChange={(e) => setDefaultPage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option>Dashboard</option>
              <option>Routes</option>
              <option>Schedule</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Controls */}
      <section className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#23B1B7]">
        <h2 className="text-lg font-semibold text-[#23B1B7] mb-4">Data Controls</h2>

        <div className="space-y-3">
          <button className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-700">
            Clear Route Cache
          </button>
          <button className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-700">
            Export Settings
          </button>
          <button className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-700">
            Import Settings
          </button>
        </div>
      </section>
    </div>
  );
}
