import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
    <div className="max-w-3xl w-full bg-gray-50 rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Refund Policy
      </h1>
      <ul className="list-disc list-inside space-y-4 text-gray-700">
        <li>
          <span className="font-semibold">Eligibility:</span> Refunds are only
          applicable for orders that are cancelled within{" "}
          <span className="font-semibold text-yellow-600">24 hours</span> of
          placement and only if the order status is{" "}
          <span className="font-semibold text-yellow-600">Pending</span>.
        </li>
        <li>
          <span className="font-semibold">Non-Refundable:</span> Orders that
          have been processed, shipped, or delivered are not eligible for
          cancellation or refund.
        </li>
        <li>
          <span className="font-semibold">Refund Process:</span> Once your
          cancellation is approved, the refund will be processed to your
          original payment method within 5-7 business days.
        </li>
        <li>
          <span className="font-semibold">Contact for Refunds:</span> For any
          refund-related queries, please email us at{" "}
          <a
            href="mailto:info@cngrocer.com"
            className="text-green-700 underline"
          >
            info@cngrocer.com
          </a>{" "}
          with your order details.
        </li>
        <li>
          <span className="font-semibold">Disputes:</span> If you have any
          concerns regarding your refund, contact our support team for
          resolution.
        </li>
      </ul>
      <div className="mt-8 text-center">
        <a href="/" className="text-green-700 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  </div>
);

export default RefundPolicy;
