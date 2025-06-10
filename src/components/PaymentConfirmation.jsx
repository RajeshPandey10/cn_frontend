import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { FaTimesCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const PaymentConfirmation = () => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const pidx = params.get("pidx");
        const purchase_order_id = params.get("purchase_order_id");

        if (!pidx || !purchase_order_id) {
          setStatus("error");
          toast.error("Missing payment information");
          return;
        }

        // Verify payment with backend
        const response = await api.post("/payment/khalti/verify", {
          pidx,
          orderId: purchase_order_id,
        });

        if (response.data.success) {
          try {
            await clearCart(); // Ensure cart is cleared after successful payment
          } catch (e) {
            // Silently ignore cart clear errors
          }
          navigate("/orders"); // Immediately redirect to orders
        } else {
          setStatus("error");
          toast.error(response.data.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        toast.error(
          error.response?.data?.message || "Failed to verify payment"
        );
      }
    };

    verifyPayment();
    // eslint-disable-next-line
  }, [location, navigate, clearCart]);

  if (status === "loading") {
    // Show a spinner/message while verifying payment
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">
            Verifying your payment, please wait...
          </p>
        </div>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="inline-block bg-red-100 rounded-full p-3 mb-4">
              <FaTimesCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment.
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300"
                onClick={() => navigate("/cart")}
              >
                Return to Cart
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                onClick={() => navigate("/orders")}
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default PaymentConfirmation;
