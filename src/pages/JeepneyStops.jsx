import { useState, useRef, useEffect } from "react";

const initialStops = [
  {
    id: 1,
    name: "Ayala Center Cebu",
    barangay: "Lahug",
    description: "Major commercial area with many jeepney routes passing.",
    routes: ["01A", "02B", "12"],
  },
  {
    id: 2,
    name: "Cebu City Hall",
    barangay: "Parian",
    description: "Central government offices, jeepneys stop here frequently.",
    routes: ["01A", "12"],
  },
  {
    id: 3,
    name: "SM City Cebu",
    barangay: "Pardo",
    description: "Large shopping mall, busy jeepney stop.",
    routes: ["02B", "12"],
  },
];

export default function JeepneyStops() {
  const [stops, setStops] = useState(initialStops);
  const [expandedStop, setExpandedStop] = useState(null);
  const [editStop, setEditStop] = useState(null);
  const [deleteStop, setDeleteStop] = useState(null);
  const containerRefs = useRef({});

  // Close expanded details on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        expandedStop &&
        containerRefs.current[expandedStop] &&
        !containerRefs.current[expandedStop].contains(event.target)
      ) {
        setExpandedStop(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedStop]);

  // Toggle stop details
  const toggleStop = (id) => {
    setExpandedStop(expandedStop === id ? null : id);
  };

  // Edit modal handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStop((prev) => ({
      ...prev,
      [name]: name === "routes" ? value.split(",").map((r) => r.trim()) : value,
    }));
  };

  const saveEdit = () => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === editStop.id ? editStop : stop))
    );
    setEditStop(null);
  };

  // Delete modal handlers
  const confirmDelete = () => {
    setStops((prev) => prev.filter((stop) => stop.id !== deleteStop.id));
    setDeleteStop(null);
    if (expandedStop === deleteStop.id) setExpandedStop(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <h1 className="text-3xl font-bold text-[#23B1B7] mb-4">Jeepney Stops</h1>
      <p className="text-gray-600 mb-6">
        List of important jeepney stops in Cebu City.
      </p>

      <div className="space-y-6">
        {stops.map((stop) => (
          <div
            key={stop.id}
            ref={(el) => (containerRefs.current[stop.id] = el)}
            className="relative bg-white rounded-xl shadow-md border-l-4 border-[#23B1B7]"
          >
            <button
              onClick={() => toggleStop(stop.id)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer hover:bg-teal-50 transition"
            >
              <div>
                <span className="text-xl font-semibold text-[#23B1B7]">
                  {stop.name}
                </span>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">Barangay:</span> {stop.barangay}
                </p>
              </div>
              <div className="text-[#23B1B7] text-xl font-bold">
                {expandedStop === stop.id ? "−" : "+"}
              </div>
            </button>

            {expandedStop === stop.id && (
              <div className="absolute top-full left-0 w-full bg-teal-50 border border-[#23B1B7] rounded-b-xl shadow-lg z-50 p-6 flex flex-col gap-4">
                <p className="text-gray-700">{stop.description}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Routes:</span> {stop.routes.join(", ")}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setEditStop(stop)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteStop(stop)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editStop && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">
              Edit Stop: {editStop.name}
            </h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={editStop.name}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block mb-2">
              Barangay:
              <input
                type="text"
                name="barangay"
                value={editStop.barangay}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={editStop.description}
                onChange={handleEditChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
              />
            </label>
            <label className="block mb-4">
              Routes (comma separated):
              <input
                type="text"
                name="routes"
                value={editStop.routes.join(", ")}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditStop(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteStop && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to delete <br />
              <span className="font-bold">{deleteStop.name}</span>?
            </h2>
            <div className="flex justify-around">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteStop(null)}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
