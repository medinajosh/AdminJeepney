import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export default function News() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(6); // ✅ Change number of items per page
  const [totalNews, setTotalNews] = useState(0);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [newNewsData, setNewNewsData] = useState({
    title: "",
    description: "",
    image: null,
    preview: null,
  });
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
    preview: null,
  });

  // ✅ Fetch News
  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    const offset = (currentPage - 1) * newsPerPage;

    // ✅ Get total count
    const { count } = await supabase
      .from("news")
      .select("*", { count: "exact", head: true });

    setTotalNews(count || 0);

    // ✅ Get paginated data
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + newsPerPage - 1);

    if (error) console.error("Fetch error:", error);
    else setNews(data);
  };

  // ✅ Upload Image
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("news")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("news").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ✅ Add New News
  const addNewNews = async () => {
    let imageUrl = null;
    if (newNewsData.image) {
      imageUrl = await uploadImage(newNewsData.image);
    }

    const { error } = await supabase.from("news").insert([
      {
        title: newNewsData.title,
        description: newNewsData.description,
        image_url: imageUrl,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      setNewNewsData({ title: "", description: "", image: null, preview: null });
      setIsAddOpen(false);
      fetchNews();
    }
  };

  // ✅ Save Edit News
  const saveEdit = async () => {
    let imageUrl = editData.image_url;

    if (editData.image) {
      imageUrl = await uploadImage(editData.image);
    }

    const { error } = await supabase
      .from("news")
      .update({
        title: editData.title,
        description: editData.description,
        image_url: imageUrl,
      })
      .eq("id", editData.id);

    if (error) console.error("Update error:", error);
    else {
      setIsEditOpen(false);
      setEditData({ id: null, title: "", description: "", image: null, preview: null });
      fetchNews();
    }
  };

  // ✅ Delete News
  const confirmDelete = async () => {
    try {
      if (editData.image_url) {
        const filePath = editData.image_url.split("/").pop();
        await supabase.storage.from("news").remove([filePath]);
      }

      const { error } = await supabase.from("news").delete().eq("id", editData.id);
      if (error) console.error("Delete error:", error);
      else {
        setIsDeleteOpen(false);
        fetchNews();
      }
    } catch (err) {
      console.error("Unexpected delete error:", err);
    }
  };

  // ✅ Filter News
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination logic
  const totalPages = Math.ceil(totalNews / newsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-8 ml-60 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search news..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {/* Add Button */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-gray-700">Want to add a new news article?</p>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add News
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredNews.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">No results found.</p>
        ) : (
          filteredNews.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt="News"
                  className="w-full h-68 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-[#23B1B7]">{item.title}</h3>
              <p className="text-gray-700 mt-2">{item.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditData(item);
                    setIsEditOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setEditData(item);
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
      <div className="flex justify-center items-center mt-8 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed z-100 inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-6">
            <h3 className="text-xl font-semibold text-[#23B1B7]">Add News</h3>

            <label className="block mb-2 text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              value={newNewsData.title}
              onChange={(e) => setNewNewsData({ ...newNewsData, title: e.target.value })}
              placeholder="Title"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={newNewsData.description}
              onChange={(e) => setNewNewsData({ ...newNewsData, description: e.target.value })}
              placeholder="Description"
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />

            <label className="block mb-2 text-sm font-semibold text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewNewsData({
                    ...newNewsData,
                    image: file,
                    preview: URL.createObjectURL(file),
                  });
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
              file:rounded file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {newNewsData.preview && (
              <img
                src={newNewsData.preview}
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
                onClick={addNewNews}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Add News
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-[#23B1B7]">Edit News</h3>
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
              Are you sure you want to delete this news article?
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
