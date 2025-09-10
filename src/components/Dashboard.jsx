import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

import DashboardHome from "../pages/DashboardHome";
import RoutesPage from "../pages/Routes";
import JeepneyStops from "../pages/JeepneyStops";
import FareMatrix from "../pages/FareMatrix";
import Schedule from "../pages/Schedule";
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
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/jeepney-stops" element={<JeepneyStops />} />
            <Route path="/fare-matrix" element={<FareMatrix />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
