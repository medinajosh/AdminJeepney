import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Map,
  Bus,
  CreditCard,
  Calendar,
  FileText,
  Settings,
  Megaphone
} from "lucide-react";
import React, { useState } from "react";

export default function Sidebar({ setIsAuthenticated }) {
  const location = useLocation(); // 📍 Get current route path
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    closeModal();
  };

  // 📁 Menu items list
  const menuItems = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/dashboard/routes", icon: <Map size={20} />, label: "Routes" },
    { to: "/dashboard/jeepney-stops", icon: <Bus size={20} />, label: "Jeepney Stops" },
    { to: "/dashboard/fare-matrix", icon: <Megaphone size={20} />, label: "Advertisement" },
    { to: "/dashboard/schedule", icon: <Calendar size={20} />, label: "Schedule" },
    { to: "/dashboard/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl rounded-r-3xl p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-[#23B1B7] mb-10">Cebu Routes</h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-gray-600">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-[#23B1B7] text-white shadow-sm"
                  : "hover:bg-teal-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogoutClick}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition shadow"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-around">
              <button
                onClick={confirmLogout}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
