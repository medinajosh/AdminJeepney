import { useEffect, useState } from "react";
import { Map, Megaphone, Calendar, FileText, Settings, Newspaper, LucideLetterText } from "lucide-react";
import { supabase } from "../config/supabase";
import jeepBear from "../assets/clear.png";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [jeepneyCodeCount, setJeepneyCodeCount] = useState(0);
  const [LocationCount, setLocationCount] = useState(0);
  const [AdvertisementCount, setAdvertisementCount] = useState(0);
  const [NewsCount, setNewsCount] = useState(0);
  const [ReportsCount, setReportsCount] = useState(0);
  

  useEffect(() => {
    const fetchJeepneyCount = async () => {
      const { count, error } = await supabase
        .from("routes")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching Jeepney Codes count:", error);
      } else {
        setJeepneyCodeCount(count);
      }
    };

    fetchJeepneyCount();
  }, []);


  useEffect(() => {
    const fetchLocationCount = async () => {
      const { count, error } = await supabase
        .from("location")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching Location count:", error);
      } else {
        setLocationCount(count);
      }
    };

    fetchLocationCount();
  }, []);

  useEffect(() => {
    const fetchAdvetisementCount = async () => {
      const { count, error } = await supabase
        .from("advertisements")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching Advertisement count:", error);
      } else {
        setAdvertisementCount(count);
      }
    };

    fetchAdvetisementCount();
  }, []);


  useEffect(() => {
    const fetchNewsCount = async () => {
      const { count, error } = await supabase
        .from("news")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching News count:", error);
      } else {
        setNewsCount(count);
      }
    };

    fetchNewsCount();
  }, []);


  useEffect(() => {
    const fetchReportsCount = async () => {
      const { count, error } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching Feedback count:", error);
      } else {
        setReportsCount(count);
      }
    };

    fetchReportsCount();
  }, []);

  const cards = [
    {
      title: "Location",
      stat: LocationCount,
      icon: <Map className="text-white" size={24} />,
      color: "bg-[#23B1B7]",
      path: "/dashboard/location",
    },
    {
      title: "Jeepney Codes",
      stat: jeepneyCodeCount,
      icon: <LucideLetterText className="text-white" size={24} />,
      color: "bg-[#2899B5]",
      path: "/dashboard/jeepneycodes",
    },
    {
      title: "Advertisements",
      stat: AdvertisementCount,
      icon: <Megaphone className="text-white" size={24} />,
      color: "bg-[#2888B5]",
      path: "/dashboard/advertisement",
    },
    {
      title: "News",
      stat: NewsCount,
      icon: <Newspaper className="text-white" size={24} />,
      color: "bg-[#2876B5]",
      path: "/dashboard/news",
    },
    {
      title: "Reports",
      stat: ReportsCount,
      icon: <FileText className="text-white" size={24} />,
      color: "bg-[#2860B5]",
      path: "/dashboard/reports",
    },
    {
      title: "Settings",
      stat: null,
      icon: <Settings className="text-white" size={24} />,
      color: "bg-[#7C7E82]",
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
          <button
            onClick={() => navigate("/dashboard/location")}
            className="text-[#23B1B7] hover:underline"
          >
            Manage Routes
          </button>
          <button
            onClick={() => navigate("/dashboard/JeepneyCodes")}
            className="text-[#23B1B7] hover:underline"
          >
            Jeepney Codes
          </button>
          <button
            onClick={() => navigate("/dashboard/News")}
            className="text-[#23B1B7] hover:underline"
          >
            News
          </button>
          <button
            onClick={() => navigate("/dashboard/Advertisement")}
            className="text-[#23B1B7] hover:underline"
          >
            Advertisement
          </button>
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
