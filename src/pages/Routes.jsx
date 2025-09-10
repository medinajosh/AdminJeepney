import { useState, useRef, useEffect } from "react";
import Route01AImage from "../assets/01K.png";

const routesData = [
  {
    number: "01A",
    origin: "Cebu City Proper",
    destination: "Mandaue City",
    description:
      "Route 01A covers the main route from Cebu City Proper to Mandaue City, passing through key barangays and terminals.",
    mapImage: Route01AImage,
  },
  {
    number: "02B",
    origin: "Cebu City Proper",
    destination: "Lapu-Lapu City",
    description:
      "Route 02B connects Cebu City Proper to Lapu-Lapu City, including the Mactan-Cebu bridge crossing.",
    mapImage: Route01AImage,
  },
  {
    number: "12",
    origin: "Cebu City Proper",
    destination: "Talisay City",
    description:
      "Route 12 serves the route between Cebu City Proper and Talisay City, a popular commuter route.",
    mapImage: Route01AImage,
  },
  // Add more routes as needed
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState(routesData);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null); // route being edited
  const [deleteRoute, setDeleteRoute] = useState(null); // route being deleted
  const containerRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        expandedRoute &&
        containerRefs.current[expandedRoute] &&
        !containerRefs.current[expandedRoute].contains(event.target)
      ) {
        setExpandedRoute(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedRoute]);

  const toggleRoute = (number) => {
    setExpandedRoute(expandedRoute === number ? null : number);
  };

  // Handle form change in edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRoute((prev) => ({ ...prev, [name]: value }));
  };

  // Save edits to route
  const saveEdit = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) => (r.number === editRoute.number ? editRoute : r))
    );
    setEditRoute(null);
  };

  // Confirm delete route
  const confirmDelete = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.filter((r) => r.number !== deleteRoute.number)
    );
    setDeleteRoute(null);
    if (expandedRoute === deleteRoute.number) {
      setExpandedRoute(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <h1 className="text-3xl font-bold text-[#23B1B7] mb-3">Jeepney Routes</h1>
      <p className="text-gray-600 mb-6">
        Popular jeepney routes operating in Cebu City and nearby towns.
      </p>

      <div className="space-y-6">
        {routes.map(({ number, origin, destination, description, mapImage }) => (
          <div
            key={number}
            className="relative bg-white rounded-xl shadow-md border-l-4 border-[#23B1B7]"
            ref={(el) => (containerRefs.current[number] = el)}
          >
            <button
              onClick={() => toggleRoute(number)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer hover:bg-teal-50 transition"
            >
              <div>
                <span className="text-xl font-semibold text-[#23B1B7]">
                  Route {number}
                </span>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">From:</span> {origin}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">To:</span> {destination}
                </p>
              </div>
              <div className="text-[#23B1B7] text-xl font-bold">
                {expandedRoute === number ? "−" : "+"}
              </div>
            </button>

            {/* Dropdown */}
            {expandedRoute === number && (
              <div className="absolute top-full left-0 w-full bg-teal-50 border border-[#23B1B7] rounded-b-xl shadow-lg z-50 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 flex justify-center">
                  <p className="text-gray-700 max-w-md text-center">{description}</p>
                </div>
                <div className="flex-1">
                  <img
                    src={mapImage}
                    alt={`Route ${number} map`}
                    className="rounded-lg shadow-md max-h-48 w-full object-contain"
                  />
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <button
                    onClick={() => setEditRoute({ number, origin, destination, description, mapImage })}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteRoute({ number, origin, destination })}
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
      {editRoute && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">
                Edit Route {editRoute.number}
            </h2>

            <label className="block mb-2">
                Origin:
                <input
                type="text"
                name="origin"
                value={editRoute.origin}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
            </label>

            <label className="block mb-2">
                Destination:
                <input
                type="text"
                name="destination"
                value={editRoute.destination}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
            </label>

            <label className="block mb-4">
                Description:
                <textarea
                name="description"
                value={editRoute.description}
                onChange={handleEditChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
                />
            </label>

            {/* Image Preview and Upload */}
            <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Route Map:</label>
                {editRoute.mapImage && (
                <img
                    src={editRoute.mapImage}
                    alt="Preview"
                    className="rounded shadow-md mb-2 max-h-40 object-contain"
                />
                )}
                <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setEditRoute((prev) => ({
                        ...prev,
                        mapImage: reader.result,
                        }));
                    };
                    reader.readAsDataURL(file);
                    }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setEditRoute(null)}
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
      {deleteRoute && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete route {deleteRoute.number}?
            </h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setDeleteRoute(null)}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
