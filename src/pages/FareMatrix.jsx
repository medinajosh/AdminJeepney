import React, { useState } from "react";

const initialAd = {
  title: "Cebu City Jeepney Ads",
  description:
    "Reach thousands of commuters daily! Advertise your business on our jeepneys around Cebu City.",
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Sample image URL
};

export default function FareMatrix() {
  const [ads, setAds] = useState([initialAd]); // Change from ad to ads array
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false); // Add modal state
  const [editData, setEditData] = useState(initialAd);
  const [newAdData, setNewAdData] = useState({
    title: "",
    description: "",
    image: "",
  }); // New ad state

  // Handle input changes for edit and add
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewAdData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited advertisement
  const saveEdit = () => {
    setAds(ads.map((ad) => (ad.title === editData.title ? editData : ad)));
    setIsEditOpen(false);
  };

  // Add new advertisement
  const addNewAd = () => {
    setAds([...ads, newAdData]);
    setNewAdData({ title: "", description: "", image: "" }); // Clear form after add
    setIsAddOpen(false);
  };

  // Confirm delete
  const confirmDelete = () => {
    setAds(ads.filter((ad) => ad.title !== editData.title)); // Remove ad
    setIsDeleteOpen(false);
  };

  // Filter ads based on search term
  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 ml-60 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search advertisements..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {/* Add New Advertisement Button */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-gray-700">Want to add a new advertisement?</p>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add New Advertisement
        </button>
      </div>

      {/* Grid Layout for Ads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredAds.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">No results found.</p>
        ) : (
          filteredAds.map((ad, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <img
                src={ad.image}
                alt="Advertisement"
                className="w-full h-68 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-[#23B1B7]">{ad.title}</h3>
              <p className="text-gray-700 mt-2">{ad.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditData(ad);
                    setIsEditOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setEditData(ad);
                    setIsDeleteOpen(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Advertisement Modal */}
      {isAddOpen && (
        <div className="fixed z-100 inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-6">
            <h3 className="text-xl font-semibold text-[#23B1B7]">Add New Advertisement</h3>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newAdData.title}
              onChange={handleAddChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
            <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={newAdData.description}
              onChange={handleAddChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
            />
            <label className="block mb-2 text-sm font-semibold text-gray-700">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewAdData((prev) => ({
                      ...prev,
                      image: reader.result, // Update the image
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setNewAdData({ title: "", description: "", image: "" }); // Clear form on cancel
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addNewAd}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Add Advertisement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Advertisement Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-100">
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
              Image:
              <input
                type="file"
                name="image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditData((prev) => ({
                        ...prev,
                        image: reader.result, // Update the image
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-100">
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
