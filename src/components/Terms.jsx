import React from "react";

const Terms = () => (
  <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
    <div className="max-w-3xl w-full bg-gray-50 rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Terms & Conditions
      </h1>
      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <span className="font-semibold">Account Responsibility:</span> You are
          responsible for maintaining the confidentiality of your account and
          password and for restricting access to your device.
        </li>
        <li>
          <span className="font-semibold">Product Availability:</span> All
          products are subject to availability. We reserve the right to limit
          quantities or discontinue any product at any time.
        </li>
        <li>
          <span className="font-semibold">Order Acceptance:</span> Orders are
          confirmed only after payment (for online payments) or upon successful
          placement (for COD). We reserve the right to refuse or cancel any
          order.
        </li>
        <li>
          <span className="font-semibold">Pricing:</span> Prices and offers are
          subject to change without prior notice. The price at checkout is
          final.
        </li>
        <li>
          <span className="font-semibold">Delivery:</span> We strive to deliver
          orders promptly. Delays may occur due to unforeseen circumstances.
          Delivery charges may apply based on your location.
        </li>
        <li>
          <span className="font-semibold">Cancellations:</span> Orders can only
          be cancelled while they are in{" "}
          <span className="font-semibold text-yellow-600">Pending</span> status.
          Once processed or shipped, cancellation is not possible.
        </li>
        <li>
          <span className="font-semibold">Refunds:</span> Refunds are processed
          as per our{" "}
          <a href="/refund-policy" className="text-green-700 underline">
            Refund Policy
          </a>
          .
        </li>
        <li>
          <span className="font-semibold">Contact:</span> For any queries,
          please email us at{" "}
          <a
            href="mailto:info@cngrocer.com"
            className="text-green-700 underline"
          >
            info@cngrocer.com
          </a>
          .
        </li>
      </ol>
      <div className="mt-8 text-center">
        <a href="/" className="text-green-700 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  </div>
);

export default Terms;
