import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export default function JeepneyCodes() {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [expandedRoute, setExpandedRoute] = useState(null);

  // Modals
  const [newRoute, setNewRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const [deleteRoute, setDeleteRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data, error } = await supabase.from("routes").select("*").order("number");
    if (error) console.error(error);
    else setRoutes(data);
  };

  // ⭐ FILTERED ROUTES (Search + Pagination work with this)
  const filteredRoutes = routes.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.number.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
    );
  });

  // ⭐ PAGINATION LOGIC
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Save New Route
  const saveNewRoute = async () => {
    const { error } = await supabase.from("routes").insert([newRoute]);
    if (error) {
      console.error(error);
      alert("❌ Failed to save new route.");
    } else {
      setNewRoute(null);
      fetchRoutes();
      alert("✅ New route has been saved!");
    }
  };

  // Save Edit Route
  const saveEdit = async () => {
    const { error } = await supabase
      .from("routes")
      .update(editRoute)
      .eq("id", editRoute.id);

    if (error) alert("❌ Failed to update route.");
    else {
      setEditRoute(null);
      fetchRoutes();
      alert("✅ Route updated!");
    }
  };

  const confirmDelete = async () => {
    const { error } = await supabase.from("routes").delete().eq("id", deleteRoute.id);

    if (error) alert("❌ Failed to delete route.");
    else {
      setDeleteRoute(null);
      fetchRoutes();
      alert("✅ Route deleted!");
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

      {/* HEADER + SEARCH */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-[#23B1B7] mb-3">
            Jeepney Routes
          </h1>
          <p className="text-gray-700 text-lg">
            Manage jeepney routes with stops and Google Maps.
          </p>
        </div>

        {/* ⭐ FIXED SEARCH BAR */}
        <input
          type="text"
          placeholder="Search routes..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          className="border border-gray-300 rounded-md px-6 py-3 text-sm w-72 
                     focus:outline-none focus:ring-2 focus:ring-[#23B1B7] transition"
        />
      </div>

      {/* ADD ROUTE BUTTON */}
      <button
        onClick={() =>
          setNewRoute({
            number: "",
            origin: "",
            destination: "",
            description: "",
            gmap_link: "",
          })
        }
        className="mb-6 px-6 py-3 bg-[#23B1B7] text-white rounded-md hover:bg-teal-600"
      >
        Add New Route
      </button>

      {/* ROUTE LIST */}
      <div className="space-y-6">
        {currentRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-xl shadow-lg border-l-4 border-[#23B1B7] 
                       hover:scale-105 transition-transform"
          >
            <button
              onClick={() =>
                setExpandedRoute(expandedRoute === route.id ? null : route.id)
              }
              className="w-full p-4 flex justify-between items-center hover:bg-teal-50"
            >
              <div>
                <span className="text-2xl font-semibold text-[#23B1B7]">
                  Route {route.number}
                </span>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>From:</strong> {route.origin}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>To:</strong> {route.destination}
                </p>
              </div>
              <div className="text-[#23B1B7] text-2xl font-bold">
                {expandedRoute === route.id ? "-" : "+"}
              </div>
            </button>

            {expandedRoute === route.id && (
              <div className="p-6 bg-teal-50 space-y-6 rounded-b-xl">

                <p className="text-lg">
                  <strong>Description:</strong> {route.description}
                </p>

                {route.gmap_link && isValidUrl(route.gmap_link) ? (
                  <iframe
                    src={route.gmap_link}
                    width="100%"
                    height="350"
                    className="rounded-lg shadow-md"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                ) : (
                  <div className="p-6 border rounded-md bg-gray-100 text-center">
                    Google Map is not available for this route.
                  </div>
                )}

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

      {/* ⭐ PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded 
                ${currentPage === i + 1 ? "bg-[#23B1B7] text-white" : "bg-gray-200"}
              `}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* ---------------- Add New Route Modal ---------------- */}
      {newRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">
              Add New Route
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jeepney Code
            </label>
            <input
              type="text"
              placeholder="Jeepney Code"
              value={newRoute.number}
              onChange={(e) =>
                setNewRoute((prev) => ({ ...prev, number: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Point
            </label>
            <input
              type="text"
              placeholder="Starting Point"
              value={newRoute.origin}
              onChange={(e) =>
                setNewRoute((prev) => ({ ...prev, origin: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ending Point
            </label>
            <input
              type="text"
              placeholder="Ending Point"
              value={newRoute.destination}
              onChange={(e) =>
                setNewRoute((prev) => ({ ...prev, destination: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
            placeholder="Description"
              value={newRoute.description}
              onChange={(e) =>
                setNewRoute((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed Link
            </label>
            <input
              type="text"
              placeholder="Google Maps Embed Link"
              value={newRoute.gmap_link}
              onChange={(e) =>
                setNewRoute((prev) => ({
                  ...prev,
                  gmap_link: e.target.value,
                }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewRoute(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveNewRoute}
                className="px-4 py-2 bg-[#23B1B7] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Edit Route Modal ---------------- */}
      {editRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Edit Route
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jeepney Code
            </label>
            <input
              type="text"
              value={editRoute.number}
              onChange={(e) =>
                setEditRoute((prev) => ({ ...prev, number: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Point
            </label>
            <input
              type="text"
              value={editRoute.origin}
              onChange={(e) =>
                setEditRoute((prev) => ({ ...prev, origin: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ending Point
            </label>
            <input
              type="text"
              value={editRoute.destination}
              onChange={(e) =>
                setEditRoute((prev) => ({ ...prev, destination: e.target.value }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editRoute.description}
              onChange={(e) =>
                setEditRoute((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border p-2 rounded mb-3"
            />


            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed Link
            </label>
            <input
              type="text"
              value={editRoute.gmap_link}
              onChange={(e) =>
                setEditRoute((prev) => ({
                  ...prev,
                  gmap_link: e.target.value,
                }))
              }
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditRoute(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {deleteRoute && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[400px] shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Confirm Delete
            </h2>
            <p className="mb-6">
              Are you sure you want to delete route{" "}
              <strong>{deleteRoute.number}</strong> from{" "}
              <strong>{deleteRoute.origin}</strong> to{" "}
              <strong>{deleteRoute.destination}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteRoute(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
