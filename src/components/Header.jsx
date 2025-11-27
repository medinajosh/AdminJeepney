import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { supabase } from "../config/supabase"; // ✅ your Supabase client

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Realtime listener for new feedback
  useEffect(() => {
    const channel = supabase
      .channel("feedback-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          console.log("Realtime payload:", payload); // 👀 Debugging
          setNotifications((prev) => [
            {
              id: payload.new.id,
              message: `📝 New feedback from ${payload.new.first_name} ${payload.new.last_name}`,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    // Cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Polling fallback (every 10s) in case Realtime is off
  useEffect(() => {
    const fetchLatestFeedback = async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("id, first_name, last_name, created_at")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching feedback:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const latest = data[0];
        // Add only if not already in notifications
        if (!notifications.find((n) => n.id === latest.id)) {
          setNotifications((prev) => [
            {
              id: latest.id,
              message: `📝 New feedback from ${latest.first_name} ${latest.last_name}`,
            },
            ...prev,
          ]);
        }
      }
    };

    const interval = setInterval(fetchLatestFeedback, 10000); // check every 10s
    return () => clearInterval(interval);
  }, [notifications]);

  return (
    <header className="flex justify-between z-100 ml-58 items-center px-6 py-4 bg-white shadow-md relative">
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
            <div
              onClick={() => setNotifications([])} // ✅ Clear notifications
              className="px-4 py-2 text-xs text-right text-[#23B1B7] hover:underline cursor-pointer"
            >
              Clear all
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
