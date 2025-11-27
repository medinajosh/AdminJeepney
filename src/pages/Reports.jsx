import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export default function Reports() {
  const [filter, setFilter] = useState("All");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;

  // ✅ Fetch feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("feedback")
        .select(
          "id, feedback_type, feedback, first_name, last_name, email, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching feedback:", error.message);
      } else {
        const formatted = (data || []).map((item) => ({
          id: item.id,
          type: item.feedback_type || "Unspecified",
          message: item.feedback,
          name: `${item.first_name} ${item.last_name}`,
          email: item.email,
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "N/A",
          helpful: null,
        }));
        setFeedbackData(formatted);
      }

      setLoading(false);
    };

    fetchFeedback();
  }, []);

  // ✅ Mark as helpful/not helpful (UI only)
  const handleHelpfulChange = (id, isHelpful) => {
    setFeedbackData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, helpful: isHelpful } : item
      )
    );
  };

  // ✅ Open delete modal
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // ✅ Delete feedback
  const handleDelete = async () => {
    if (selectedId === null) return;

    const { error } = await supabase.from("feedback").delete().eq("id", selectedId);

    if (error) {
      console.error("Error deleting feedback:", error.message);
      alert("Failed to delete feedback. Please try again.");
    } else {
      setFeedbackData((prev) => prev.filter((item) => item.id !== selectedId));
      alert("Feedback deleted successfully!");
    }

    setShowModal(false);
    setSelectedId(null);
  };

  // ✅ Apply filter
  const filteredData =
    filter === "All"
      ? feedbackData
      : feedbackData.filter((item) => item.type === filter);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredData.length / feedbacksPerPage);
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredData.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-8 ml-60 mr-w-5xl mx-auto relative">
      <h1 className="text-2xl font-bold text-[#23B1B7]">Reports</h1>
      <p className="text-gray-600 mt-2 mb-6">
        User feedback and insights from the community.
      </p>

      {/* ✅ Filters */}
      <div className="flex gap-3 mb-4">
        {["All", "Suggestions", "Comments", "Questions", "Unspecified"].map(
          (type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setCurrentPage(1); // reset pagination when filtering
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === type
                  ? "bg-[#23B1B7] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* ✅ Feedback List */}
      {loading ? (
        <p className="text-gray-500">Loading feedback...</p>
      ) : currentFeedbacks.length === 0 ? (
        <p className="text-gray-400">No feedback available.</p>
      ) : (
        <>
          <div className="space-y-4">
            {currentFeedbacks.map(
              ({ id, type, message, name, email, helpful, date }) => (
                <div
                  key={id}
                  className="bg-white p-4 shadow rounded-xl border-l-4 border-[#23B1B7]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#23B1B7]">
                      {type}
                    </span>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{message}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    From: {name} ({email})
                  </p>

                  {/* ✅ Actions */}
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

                    {/* ✅ Delete Button */}
                    <button
                      onClick={() => confirmDelete(id)}
                      className="px-3 py-1 rounded-full text-xs font-medium border text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* ✅ Pagination Controls */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Background overlay (darker & clickable to close modal) */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full z-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Feedback?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              feedback permanently?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
