import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, message: "Route 12A has been updated." },
    { id: 2, message: "New jeepney stops added in Lahug." },
    { id: 3, message: "User reported incorrect route for 03B." },
  ];

  return (
    <header className="flex justify-between z-100 ml-58  items-center px-6 py-4 bg-white shadow-md relative">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-[#23B1B7] tracking-wide">
        Cebu Jeepney Routes
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {/* Notification Bell */}
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="relative text-gray-600 hover:text-[#23B1B7] transition duration-200 focus:outline-none"
        >
          <Bell size={22} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-[1px] shadow-md">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-14 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <div className="p-4 border-b font-semibold text-[#23B1B7]">
              Notifications
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b"
                  >
                    {notif.message}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  No new notifications.
                </li>
              )}
            </ul>
            <div className="px-4 py-2 text-xs text-right text-[#23B1B7] hover:underline cursor-pointer">
              View all
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
