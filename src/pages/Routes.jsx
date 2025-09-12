import { useState } from "react";
import Route01AImage from "../assets/01K.png";

// Sample Route Data
const routesData = [
  {
    number: "01A",
    origin: "Cebu City Proper",
    destination: "Mandaue City",
    description:
      "Route 01A covers the main route from Cebu City Proper to Mandaue City, passing through key barangays and terminals.",
    mapImage: Route01AImage,
    stops: ["Cebu City Proper", "Banilad", "Mandaue City", "Santo Nino", "Tipolo"]
  },
  {
    number: "02B",
    origin: "Cebu City Proper",
    destination: "Lapu-Lapu City",
    description:
      "Route 02B connects Cebu City Proper to Lapu-Lapu City, including the Mactan-Cebu bridge crossing.",
    mapImage: Route01AImage,
    stops: ["Cebu City Proper", "Mactan", "Lapu-Lapu City"]
  },
  {
    number: "12",
    origin: "Cebu City Proper",
    destination: "Talisay City",
    description:
      "Route 12 serves the route between Cebu City Proper and Talisay City, a popular commuter route.",
    mapImage: Route01AImage,
    stops: ["Cebu City Proper", "South Road Properties", "Talisay City"]
  }
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState(routesData);
  const [expandedRoute, setExpandedRoute] = useState(null); // Track which route is expanded
  const [newRoute, setNewRoute] = useState(null); // For new route modal
  const [editRoute, setEditRoute] = useState(null); // For edit route modal
  const [deleteRoute, setDeleteRoute] = useState(null); // For delete confirmation modal

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setRoutes(
      routesData.filter(
        (route) =>
          route.number.toLowerCase().includes(query) ||
          route.origin.toLowerCase().includes(query) ||
          route.destination.toLowerCase().includes(query)
      )
    );
  };

  const handleToggleRoute = (number) => {
    if (expandedRoute === number) {
      setExpandedRoute(null); // Collapse if clicked again
    } else {
      setExpandedRoute(number); // Expand the selected route
    }
  };

  const handleAddRouteChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewRoute = () => {
    setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
    setNewRoute(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRoute((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) => (r.number === editRoute.number ? editRoute : r))
    );
    setEditRoute(null);
  };

  const confirmDelete = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.filter((r) => r.number !== deleteRoute.number)
    );
    setDeleteRoute(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-[#23B1B7] mb-3">Jeepney Routes</h1>
          <p className="text-gray-700 text-lg">
            Popular jeepney routes operating in Cebu City and nearby towns.
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search routes..."
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-6 py-3 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#23B1B7] transition"
        />
      </div>

      {/* Add Route Button */}
      <button
        onClick={() =>
          setNewRoute({ number: "", origin: "", destination: "", description: "", mapImage: "" })
        }
        className="mb-6 px-6 py-3 bg-[#23B1B7] text-white rounded-md hover:bg-teal-600 transition ease-in-out duration-200"
      >
        Add New Route
      </button>

      {/* Route List */}
      <div className="space-y-6">
        {routes.map(({ number, origin, destination, description, mapImage, stops }) => (
          <div
            key={number}
            className="relative bg-white rounded-xl shadow-lg border-l-4 border-[#23B1B7] transition-transform hover:scale-105"
          >
            <button
              onClick={() => handleToggleRoute(number)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer hover:bg-teal-50 transition"
            >
              <div>
                <span className="text-2xl font-semibold text-[#23B1B7]">Route {number}</span>
                <p className="text-gray-700 mt-2 text-sm">
                  <span className="font-medium">From:</span> {origin}
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">To:</span> {destination}
                </p>
              </div>
              <div className="text-[#23B1B7] text-2xl font-bold">{expandedRoute === number ? "-" : "+"}</div>
            </button>

            {/* Dropdown Content */}
            {expandedRoute === number && (
              <div className="flex p-6 bg-teal-50 rounded-b-xl space-x-8">
                {/* Left Side: Route Details */}
                <div className="flex-1 space-y-4">
                  <div className="text-gray-700">
                    <p className="text-lg mb-4">
                      <strong>Origin:</strong> {origin}
                    </p>
                    <p className="text-lg mb-4">
                      <strong>Destination:</strong> {destination}
                    </p>
                    <p className="text-lg mb-6">
                      <strong>Description:</strong> {description}
                    </p>

                    {/* Jeepney Stops */}
                    <div className="bg-[#f0f5f5] p-4 rounded-md shadow-sm">
                      <h3 className="text-xl font-semibold text-[#23B1B7] mb-4">Jeepney Stops</h3>
                      <ul className="space-y-2">
                        {stops.length > 0 ? (
                          stops.map((stop, index) => (
                            <li key={index} className="text-gray-700">
                              <strong>{index + 1}.</strong> {stop}
                            </li>
                          ))
                        ) : (
                          <p className="text-gray-600">No stops available for this route.</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Side: Route Map */}
                <div className="flex-1">
                  {mapImage && (
                    <div className="mb-6">
                      <img
                        src={mapImage}
                        alt={`Route ${number} map`}
                        className="w-full h-auto object-contain rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => alert("Edit functionality")}
                      className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert("Delete functionality")}
                      className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Route Modal */}
      {newRoute && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">Add New Route</h2>

            <label className="block mb-4">
              <span className="text-gray-700">Route Number</span>
              <input
                type="text"
                name="number"
                value={newRoute.number}
                onChange={handleAddRouteChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-[#23B1B7] transition"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Origin</span>
              <input
                type="text"
                name="origin"
                value={newRoute.origin}
                onChange={handleAddRouteChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-[#23B1B7] transition"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Destination</span>
              <input
                type="text"
                name="destination"
                value={newRoute.destination}
                onChange={handleAddRouteChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-[#23B1B7] transition"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700">Description</span>
              <textarea
                name="description"
                value={newRoute.description}
                onChange={handleAddRouteChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2 resize-none focus:ring-2 focus:ring-[#23B1B7] transition"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNewRoute(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveNewRoute}
                className="px-4 py-2 bg-[#23B1B7] text-white rounded hover:bg-teal-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
