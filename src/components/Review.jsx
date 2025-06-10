import { useState, useEffect } from "react";
import { FaStar, FaSpinner, FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";

const Review = ({ isOpen, onClose, orderId, item, onReviewSubmit, isEditMode = false }) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(true);
  const [existingReview, setExistingReview] = useState(null);

  // Check if item has already been reviewed
  useEffect(() => {
    if (isOpen && item && orderId) {
      const checkReviewStatus = async () => {
        try {
          // Check if the order is delivered (eligible for review)
          const orderResponse = await api.get(`/order/${orderId}`);
          if (orderResponse.data.success) {
            setCanReview(orderResponse.data.order.status === "delivered");
            
            // Check if there's an existing review
            const reviewsResponse = await api.get("/review/my-reviews");
            if (reviewsResponse.data.success) {
              const existing = reviewsResponse.data.reviews.find(
                (rev) => rev.product?._id === item.product._id && rev.order === orderId
              );
              
              if (existing) {
                setExistingReview(existing);
                setReviewData({
                  rating: existing.rating || 0,
                  comment: existing.comment || "",

                });
              } else {
                // Reset form for new review
                setReviewData({
                  rating: 0,
                  comment: "",
                });
              }
            }
          }
        } catch (error) {
          console.error("Error checking review status:", error);
        }
      };

      checkReviewStatus();
    }
  }, [isOpen, orderId, item]);

  

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canReview) {
      toast.error("You can only review delivered products");
      return;
    }

    if (reviewData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Make sure orderId is properly handled
      if (typeof orderId === 'string' || orderId instanceof String) {
        formData.append("orderId", orderId);
      } else if (orderId) {
        formData.append("orderId", String(orderId));
      } else {
        throw new Error("Invalid order ID");
      }
      
      formData.append("itemId", item._id);
      formData.append("rating", reviewData.rating);
      
      if (reviewData.comment) {
        formData.append("comment", reviewData.comment);
      }
      
     
      // Log what we're sending for debugging
      console.log("Submitting review with data:", {
        orderId: typeof orderId === 'string' ? orderId : String(orderId),
        itemId: item._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
       
      });

      const response = await api.post("/review/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(existingReview ? "Review updated successfully" : "Review submitted successfully");
        if (onReviewSubmit) onReviewSubmit();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Safely format the order ID for display
  const displayOrderId = typeof orderId === 'string' ? 
    orderId.substring(0, 8) : 
    (orderId ? String(orderId).substring(0, 8) : "Unknown Order");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </h2>
        <div className="mb-4">
          <p className="font-medium">{item?.product?.name}</p>
          <p className="text-sm text-gray-500">
            Order #{displayOrderId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReviewData((prev) => ({ ...prev, rating: star }))
                  }
                  className={`text-2xl ${
                    star <= reviewData.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
              rows="4"
              placeholder="Write your review here..."
            />
          </div>

        

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reviewData.rating === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Processing...
                </>
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
