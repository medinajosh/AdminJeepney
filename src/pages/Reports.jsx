import { useState } from "react";
import { Download } from "lucide-react";

const initialFeedback = [
  {
    id: 1,
    type: "Suggestion",
    message: "Add more route maps for Mandaue side.",
    helpful: true,
    date: "2025-09-04",
  },
  {
    id: 2,
    type: "Bug",
    message: "Jeepney stop in Colon is missing from 01A.",
    helpful: false,
    date: "2025-09-03",
  },
  {
    id: 3,
    type: "Question",
    message: "Is there a route going to SM Seaside from Talamban?",
    helpful: true,
    date: "2025-09-02",
  },
];

export default function Reports() {
  const [filter, setFilter] = useState("All");
  const [feedbackData, setFeedbackData] = useState(initialFeedback);

  const handleHelpfulChange = (id, isHelpful) => {
    setFeedbackData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, helpful: isHelpful } : item
      )
    );
  };

  const filteredData =
    filter === "All"
      ? feedbackData
      : feedbackData.filter((item) => item.type === filter);

  return (
    <div className="p-8 ml-60 mr-w-5xl mx-auto relative">
      <h1 className="text-2xl font-bold text-[#23B1B7]">Reports</h1>
      <p className="text-gray-600 mt-2 mb-6">
        User feedback and route insights from the community.
      </p>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {["All", "Suggestion", "Bug", "Question"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === type
                ? "bg-[#23B1B7] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredData.map(({ id, type, message, helpful, date }) => (
          <div
            key={id}
            className="bg-white p-4 shadow rounded-xl border-l-4 border-[#23B1B7]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#23B1B7]">{type}</span>
              <span className="text-xs text-gray-400">{date}</span>
            </div>
            <p className="text-gray-700 text-sm mb-4">{message}</p>

            {/* Helpful Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleHelpfulChange(id, true)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  helpful
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "text-gray-600 border-gray-300 hover:bg-green-50"
                }`}
              >
                Helpful
              </button>
              <button
                onClick={() => handleHelpfulChange(id, false)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  helpful === false
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "text-gray-600 border-gray-300 hover:bg-red-50"
                }`}
              >
                Not Helpful
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Button */}
      
    </div>
  );
}
