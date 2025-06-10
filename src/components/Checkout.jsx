import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import api from "../services/api";
import KhaltiCheckout from "khalti-checkout-web";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("kathmandu");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "cod",
  });

  // Calculate delivery fee based on location
  const deliveryFee = location === "kathmandu" ? 0 : 100;

  // Calculate final total including delivery fee
  const finalTotal = total + deliveryFee;

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
    }

    // Pre-fill user details if available
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
      }));
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKhaltiPayment = (paymentData) => {
    const khaltiConfig = {
      publicKey: "test_public_key_ebd538ba1b884ba79f5f09285e00511a", // Updated to match backend
      productIdentity: paymentData.orderId,
      productName: `Order #${paymentData.orderId}`,
      productUrl: window.location.href,
      eventHandler: {
        onSuccess(payload) {
          // You can call your backend to verify payment here
          toast.success("Payment successful!");
          clearCart();
          window.location.href = "/orders";
        },
        onError(error) {
          toast.error("Khalti payment failed or cancelled");
        },
        onClose() {
          // Optional: handle widget close
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };
    const checkout = new KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: paymentData.amount * 100 }); // amount in paisa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        // Match backend schema expectations
        shippingAddress: formData.address,
        phone: formData.phone,
        city: formData.city,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
      };

      const response = await api.post("/order/create", orderData);

      if (response.data.success) {
        if (formData.paymentMethod === "cod") {
          clearCart();
          toast.success("Order placed successfully!");
          navigate("/orders");
        } else if (formData.paymentMethod === "khalti") {
          const paymentResponse = await api.post("/payment/khalti/initiate", {
            orderId: response.data.order._id,
            amount: finalTotal,
          });

          if (paymentResponse.data.success) {
            // Use Khalti popup instead of redirect
            handleKhaltiPayment({
              orderId: response.data.order._id,
              amount: finalTotal,
            });
          } else {
            throw new Error("Failed to initiate Khalti payment");
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Shipping Information */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Add location selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="kathmandu">Inside Kathmandu Valley</option>
                <option value="outside">Outside Kathmandu Valley</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs.{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : `Rs.${deliveryFee}`}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs.{finalTotal}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="khalti">Khalti</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
