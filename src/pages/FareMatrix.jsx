import React, { useState } from "react";

const initialAd = {
  title: "Cebu City Jeepney Ads",
  description: "Reach thousands of commuters daily! Advertise your business on our jeepneys around Cebu City.",
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Sample image URL
};

export default function FareMatrix() {
  const [ad, setAd] = useState(initialAd);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editData, setEditData] = useState(ad);

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited advertisement
  const saveEdit = () => {
    setAd(editData);
    setIsEditOpen(false);
  };

  // Confirm delete
  const confirmDelete = () => {
    setAd(null); // Clear ad (or handle differently)
    setIsDeleteOpen(false);
  };

  if (!ad) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <p className="text-gray-500">No advertisement available.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-xl shadow-md border border-[#23B1B7]">
      <h2 className="text-2xl font-bold text-[#23B1B7] mb-4">{ad.title}</h2>
      <img
        src={ad.image}
        alt="Advertisement"
        className="rounded-lg w-full max-h-64 object-cover mb-4 shadow-md"
      />
      <p className="text-gray-700 mb-6">{ad.description}</p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setEditData(ad);
            setIsEditOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-[#23B1B7]">
              Edit Advertisement
            </h3>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
              />
            </label>
            <label className="block mb-4">
              Image URL:
              <input
                type="text"
                name="image"
                value={editData.image}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
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
      {isDeleteOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-4 text-[#23B1B7]">
              Are you sure you want to delete this advertisement?
            </h3>
            <div className="flex justify-around">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-400 transition"
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
