import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export default function Advertisement() {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image: null,
    preview: null,
     gmap_url: "",
  });
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
    preview: null,
    image_url: null,
     gmap_url: "",
  });

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(6); // show 6 ads per page
  const [totalAds, setTotalAds] = useState(0);

  useEffect(() => {
    fetchAds();
  }, [currentPage]);

  // ✅ Fetch Ads with Pagination
  const fetchAds = async () => {
    const start = (currentPage - 1) * adsPerPage;
    const end = start + adsPerPage - 1;

    const { data, error, count } = await supabase
      .from("advertisements")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setAds(data);
      setTotalAds(count);
    }
  };

  // ✅ Upload Image
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("admin")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("admin").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ✅ Add New Ad
  const addNewAd = async () => {
    let imageUrl = null;
    if (newAd.image) imageUrl = await uploadImage(newAd.image);

    const { error } = await supabase.from("advertisements").insert([
      {
        title: newAd.title,
        description: newAd.description,
        image_url: imageUrl,
        gmap_url: newAd.gmap_url,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      setNewAd({ title: "", description: "", image: null, preview: null });
      setIsAddOpen(false);
      fetchAds();
    }
  };

  // ✅ Save Edit
  const saveEdit = async () => {
    let imageUrl = editData.image_url;

    if (editData.image) imageUrl = await uploadImage(editData.image);

    const { error } = await supabase
      .from("advertisements")
      .update({
        title: editData.title,
        description: editData.description,
        image_url: imageUrl,
        gmap_url: editData.gmap_url,
      })
      .eq("id", editData.id);

    if (error) console.error("Update error:", error);
    else {
      setIsEditOpen(false);
      setEditData({
        id: null,
        title: "",
        description: "",
        image: null,
        preview: null,
        image_url: null,
        gmap_url: null,
      });
      fetchAds();
    }
  };

  // ✅ Confirm Delete
  const confirmDelete = async () => {
  try {
    // Delete image from storage
    if (editData.image_url) {
      const filePath = editData.image_url.split("/admin/")[1];
      const { error: storageError } = await supabase
        .storage
        .from("admin")
        .remove([filePath]);

      if (storageError) {
        console.warn("Storage delete error:", storageError);
      }
    }

    // Delete row from advertisements
    const { error: dbError } = await supabase
      .from("advertisements")
      .delete()
      .eq("id", editData.id);

    if (dbError) {
      console.error("Database delete error:", dbError);
    } else {
      console.log("Advertisement deleted successfully");
      setIsDeleteOpen(false);
      fetchAds();
    }
  } catch (err) {
    console.error("Unexpected delete error:", err);
  }
};



  // ✅ Filter Ads
  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination controls
  const totalPages = Math.ceil(totalAds / adsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-8 ml-60 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ads..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {/* Add Button */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-gray-700">Want to add a new advertisement?</p>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add Advertisement
        </button>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredAds.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">
            No results found.
          </p>
        ) : (
          filteredAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl shadow-lg p-6">
              {ad.image_url && (
                <img
                  src={ad.image_url}
                  alt="Ad"
                  className="w-full h-68 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-[#23B1B7]">
                {ad.title}
              </h3>
              <p className="text-gray-700 mt-2">{ad.description}</p>

              {/* ✅ Google Maps Link */}
              {ad.gmap_url && (
                <a
                  href={ad.gmap_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  View on Map
                </a>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditData({
                      id: ad.id,
                      title: ad.title,
                      description: ad.description,
                      image: null,
                      preview: ad.image_url,
                      image_url: ad.image_url,
                    });
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

      {/* ✅ Pagination Controls */}
      <div className="flex justify-center items-center mt-10 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#23B1B7] text-white hover:bg-[#1d9499]"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#23B1B7] text-white hover:bg-[#1d9499]"
          }`}
        >
          Next
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed z-100 inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-6">
            <h3 className="text-xl font-semibold text-[#23B1B7]">Add Advertisement</h3>

            <label className="block mb-2 text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              value={newAd.title}
              onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
              placeholder="Title"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={newAd.description}
              onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
              placeholder="Description"
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />

            <label className="block mb-2 text-sm font-semibold">Google Maps Link</label>
            <input
              type="text"
              value={newAd.gmap_url}
              onChange={(e) => setNewAd({ ...newAd, gmap_url: e.target.value })}
              placeholder="Paste Google Maps link here"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />


            <label className="block mb-2 text-sm font-semibold text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewAd({
                    ...newAd,
                    image: file,
                    preview: URL.createObjectURL(file),
                  });
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
              file:rounded file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {newAd.preview && (
              <img
                src={newAd.preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded mt-3 border"
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addNewAd}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-[#23B1B7]">Edit Advertisement</h3>

            <label className="block mb-2">Title:</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />

            <label className="block mb-2 mt-3">Description:</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
            />


            <label className="block mb-2 text-sm font-semibold">Google Maps Link</label>
            <input
              type="text"
              value={editData.gmap_url}
              onChange={(e) => setEditData({ ...editData, gmap_url: e.target.value })}
              placeholder="Paste Google Maps link here"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />


            <label className="block mb-2 mt-3">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setEditData({
                    ...editData,
                    image: file,
                    preview: URL.createObjectURL(file),
                  });
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
              file:rounded file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {editData.preview && (
              <img
                src={editData.preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded mt-3 border"
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
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
