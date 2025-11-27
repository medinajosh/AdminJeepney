import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export default function Location() {
  const [routes, setRoutes] = useState([]);
  const [expandedRoute, setExpandedRoute] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [routesPerPage] = useState(5);
  const [totalRoutes, setTotalRoutes] = useState(0);

  // Modal States
  const [newRoute, setNewRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const [deleteRoute, setDeleteRoute] = useState(null);

  // Stops input fields
  const [newStopName, setNewStopName] = useState("");
  const [newStopMap, setNewStopMap] = useState("");

  // Map modal
  const [viewMap, setViewMap] = useState(null);

  // Loading and Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ROUTES for PAGINATION
  useEffect(() => {
    fetchRoutes();
  }, [currentPage]);

  async function fetchRoutes() {
    setLoading(true);
    setError(null);

    // Count total records
    const countRes = await supabase
      .from("location")
      .select("*", { count: "exact", head: true });

    if (countRes.error) {
      setError("Failed to fetch routes count");
      setLoading(false);
      return;
    }

    setTotalRoutes(countRes.count || 0);

    const start = (currentPage - 1) * routesPerPage;
    const end = start + routesPerPage - 1;

    const { data, error } = await supabase
      .from("location")
      .select("*")
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      setError("Failed to load routes");
      setRoutes([]);
    } else {
      setRoutes(data || []);
    }

    setLoading(false);
  }

  const totalPages = Math.ceil(totalRoutes / routesPerPage);

  // Auto-clamp page to valid ranges
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // ⭐ FILTERED ROUTES (SEARCH LOGIC)
  const filteredRoutes = routes.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.number?.toLowerCase().includes(q) ||
      r.origin?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q)
    );
  });

  const handleAddStop = (setFn, name, map) => {
    if (!name.trim() || !map.trim()) return;
    setFn((prev) => ({
      ...prev,
      stops: [...(prev?.stops || []), { name: name.trim(), gmap_link: map.trim() }],
    }));
    setNewStopName("");
    setNewStopMap("");
  };

  // --- Save New Route
  const saveNewRoute = async () => {
    if (!newRoute.number || !newRoute.origin || !newRoute.destination) {
      alert("Please fill in route number, origin, and destination.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("location").insert([
      {
        number: newRoute.number,
        origin: newRoute.origin,
        destination: newRoute.destination,
        description: newRoute.description || "",
        stops: newRoute.stops || [],
      },
    ]);

    setLoading(false);

    if (error) alert("Failed to save route");
    else {
      alert("Route saved!");
      setNewRoute(null);
      setCurrentPage(1);
      fetchRoutes();
    }
  };

  // --- Save Edit Route
  const saveEditRoute = async () => {
    if (!editRoute.number || !editRoute.origin || !editRoute.destination) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("location")
      .update({
        number: editRoute.number,
        origin: editRoute.origin,
        destination: editRoute.destination,
        description: editRoute.description || "",
        stops: editRoute.stops || [],
      })
      .eq("id", editRoute.id);

    setLoading(false);

    if (error) alert("Update failed");
    else {
      alert("Updated!");
      setEditRoute(null);
      fetchRoutes();
    }
  };

  // Delete
  const confirmDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("location").delete().eq("id", deleteRoute.id);
    setLoading(false);

    if (error) alert("Failed to delete");
    else {
      alert("Deleted!");
      setDeleteRoute(null);
      fetchRoutes();
    }
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="p-8 ml-60 max-w-6xl mx-auto relative">

      {/* Header + Search */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-[#23B1B7] mb-2">
            Jeepney Routes
          </h1>
          <p className="text-gray-700 text-lg">Manage jeepney routes with stops.</p>
        </div>

        {/* ⭐ SEARCH BAR */}
        <input
          type="text"
          placeholder="Search routes..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="border border-gray-300 rounded-md px-6 py-3 text-sm w-72 
                     focus:outline-none focus:ring-2 focus:ring-[#23B1B7]"
        />
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-teal-600 font-semibold">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Add Route */}
      <button
        onClick={() =>
          setNewRoute({
            number: "",
            origin: "",
            destination: "",
            description: "",
            stops: [],
          })
        }
        className="mb-6 px-6 py-3 bg-[#23B1B7] text-white rounded-md hover:bg-teal-600"
      >
        Add New Route
      </button>

      {/* ROUTE LIST */}
      <div className="space-y-6">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-xl shadow-lg border-l-4 border-[#23B1B7]"
          >
            <button
              onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-teal-50"
            >
              <div>
                <span className="text-2xl font-semibold text-[#23B1B7]">
                  {route.number}
                </span>
                <p className="text-gray-700"><strong>From:</strong> {route.origin}</p>
                <p className="text-gray-700"><strong>To:</strong> {route.destination}</p>
              </div>
              <div className="text-[#23B1B7] text-2xl font-bold">
                {expandedRoute === route.id ? "-" : "+"}
              </div>
            </button>

            {/* Expanded */}
            {expandedRoute === route.id && (
              <div className="p-6 bg-teal-50 rounded-b-xl space-y-4">
                <p><strong>Description:</strong> {route.description}</p>

                <h3 className="text-xl font-semibold text-[#23B1B7]">Stops</h3>
                <ul className="pl-6 space-y-2">
                  {route.stops?.map((stop, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {stop.name}
                      <button
                        onClick={() => setViewMap(stop.gmap_link)}
                        className="px-3 py-1 bg-[#23B1B7] text-white rounded"
                      >
                        View Map
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditRoute(route)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteRoute(route)}
                    className="px-6 py-3 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-[#23B1B7] text-white hover:bg-teal-600"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-[#23B1B7] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-[#23B1B7] text-white hover:bg-teal-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
      

      {/* ---------------- Add New Route Modal ---------------- */}
      {newRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">Add New Route</h2>

            {/* Fields */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Location"
              value={newRoute.number}
              onChange={(e) => setNewRoute((prev) => ({ ...prev, number: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Point
            </label>
            <input
              type="text"
              placeholder="Starting Point"
              value={newRoute.origin}
              onChange={(e) => setNewRoute((prev) => ({ ...prev, origin: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ending Point
            </label>
            <input
              type="text"
              placeholder="Ending Point"
              value={newRoute.destination}
              onChange={(e) => setNewRoute((prev) => ({ ...prev, destination: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={newRoute.description}
              onChange={(e) => setNewRoute((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />

            {/* Stops Input */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Jeepney Stops</label>
            <div className="flex flex-col gap-2 mb-3">
              <input
                type="text"
                placeholder="Stop Name"
                value={newStopName}
                onChange={(e) => setNewStopName(e.target.value)}
                className="border p-2 rounded"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed Link
            </label>
              <input
                type="text"
                placeholder="Google Maps Embed Link"
                value={newStopMap}
                onChange={(e) => setNewStopMap(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={() => handleAddStop(setNewRoute, newStopName, newStopMap)}
                className="px-3 py-2 bg-green-500 text-white rounded"
              >
                Add Stop
              </button>
            </div>

            {/* List Stops */}
            <ul className="list-disc pl-6 mb-3">
              {newRoute.stops.map((stop, i) => (
                <li key={i}>{stop.name}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button onClick={() => setNewRoute(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={saveNewRoute} className="px-4 py-2 bg-[#23B1B7] text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Edit Route Modal ---------------- */}
      {editRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Edit Route</h2>

            {/* Fields */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Location"
              value={editRoute.number}
              onChange={(e) => setEditRoute((prev) => ({ ...prev, number: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Point
            </label>
            <input
              type="text"
              placeholder="Starting Point"
              value={editRoute.origin}
              onChange={(e) => setEditRoute((prev) => ({ ...prev, origin: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ending Point
            </label>
            <input
              type="text"
              placeholder="Ending Point"
              value={editRoute.destination}
              onChange={(e) => setEditRoute((prev) => ({ ...prev, destination: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={editRoute.description}
              onChange={(e) => setEditRoute((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border p-2 rounded mb-3"
            />

            {/* Stops Input */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Jeepney Stops</label>
            <div className="flex flex-col gap-2 mb-3">
              <input
                type="text"
                placeholder="Stop Name"
                value={newStopName}
                onChange={(e) => setNewStopName(e.target.value)}
                className="border p-2 rounded"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed Link
            </label>
              <input
                type="text"
                placeholder="Google Maps Embed Link"
                value={newStopMap}
                onChange={(e) => setNewStopMap(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={() => handleAddStop(setEditRoute, newStopName, newStopMap)}
                className="px-3 py-2 bg-green-500 text-white rounded"
              >
                Add Stop
              </button>
            </div>

            {/* List Stops */}
            <ul className="list-disc pl-6 mb-3">
              {editRoute.stops?.map((stop, i) => (
                <li key={i}>{stop.name}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex justify-between">
              <button onClick={() => setEditRoute(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={saveEditRoute} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {deleteRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[400px] shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete route <strong>{deleteRoute.number}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteRoute(null)}
                className="px-6 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- View Map Modal ---------------- */}
      {viewMap && (
        <div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            onClick={() => setViewMap(null)}
        >
            <div
            className="bg-white rounded-lg overflow-hidden max-w-[90vw] max-h-[90vh] shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
            >
            {isValidUrl(viewMap) ? (
                <iframe
                src={viewMap}
                className="w-[600px] h-[400px] sm:w-[800px] sm:h-[600px]"
                allowFullScreen
                loading="lazy"
                title="Google Maps Stop"
                />
            ) : (
                <div className="w-[600px] h-[400px] flex items-center justify-center sm:w-[800px] sm:h-[600px] p-6">
                <p className="text-gray-600 text-center">
                    Sorry, the map link is not available or invalid.
                </p>
                </div>
            )}

            <button
                onClick={() => setViewMap(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
                Close
            </button>
            </div>
        </div>
        )}

    </div>
  );
}
