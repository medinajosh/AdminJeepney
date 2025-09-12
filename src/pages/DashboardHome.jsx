import { Map, Megaphone, Calendar, FileText, Settings } from "lucide-react";
import jeepBear from "../assets/clear.png"; // 🧸 Use your own illustration
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Active Routes",
      stat: 12,
      icon: <Map className="text-white" size={24} />,
      color: "bg-[#23B1B7]",
      path: "/dashboard/routes",
    },
    {
      title: "Advertisements",
      stat: 5,
      icon: <Megaphone className="text-white" size={24} />,
      color: "bg-red-400",
      path: "/dashboard/fare-matrix",
    },
    {
      title: "Schedules",
      stat: 17,
      icon: <Calendar className="text-white" size={24} />,
      color: "bg-green-400",
      path: "/dashboard/schedule",
    },
    {
      title: "Reports",
      stat: 22,
      icon: <FileText className="text-white" size={24} />,
      color: "bg-blue-400",
      path: "/dashboard/reports",
    },
    {
      title: "Settings",
      stat: null,
      icon: <Settings className="text-white" size={24} />,
      color: "bg-purple-400",
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="p-6 ml-55 bg-[#F8FAFC] min-h-screen space-y-10">
      
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center shadow-md transition-transform hover:scale-105 duration-300">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Hi, Admin!</h1>
          <p className="text-gray-500">What would you like to manage today?</p>
          <div className="flex flex-wrap gap-4 text-sm mt-3">
            <button className="text-[#23B1B7] hover:underline">Manage Routes</button>
            <button className="text-[#23B1B7] hover:underline">Jeepney Stops</button>
            <button className="text-[#23B1B7] hover:underline">Schedules</button>
            <button className="text-[#23B1B7] hover:underline">View Reports</button>
          </div>
        </div>
        <img
          src={jeepBear}
          alt="Dashboard Illustration"
          className="w-40 h-auto mt-4 md:mt-0"
        />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cards.map(({ title, stat, icon, color, path }) => (
          <div
            key={title}
            onClick={() => navigate(path)}
            className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                {stat !== null && (
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
