import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

import DashboardHome from "../pages/DashboardHome";
import JeepneyCodes from "../pages/JeepneyCodes";
import Location from "../pages/Location";
import Advertisement from "../pages/Advertisement";
import News from "../pages/News";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

export default function Dashboard({ setIsAuthenticated }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-teal-100 via-blue-50 to-white">
      {/* Sidebar */}
      <Sidebar setIsAuthenticated={setIsAuthenticated} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg p-6">
        <Header />

        <main className="p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/location" element={<Location />} />
            <Route path="/jeepneycodes" element={<JeepneyCodes />} />
            <Route path="/advertisement" element={<Advertisement />} />
            <Route path="/news" element={<News />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
