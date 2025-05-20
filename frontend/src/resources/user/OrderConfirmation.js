import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link

function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [totalAmount, setTotalAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch payment details on component mount if orderId exists
  useEffect(() => {
    if (!orderId) return;

    fetch(`http://localhost:8000/api/payment-details?order_id=${orderId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        return response.json();
      })
      .then((data) => {
        setTotalAmount(data.payment.total_amount);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error.message);
      });
  }, [orderId]);

  const handleUpdatePaymentStatus = () => {
    if (!orderId) {
      alert("Order ID is missing.");
      return;
    }

    if (!totalAmount) {
      alert("Unable to update payment status: total amount not found.");
      return;
    }

    setLoading(true);

    const serviceFeePercentage = 0.05;
    const serviceFeeAmount = totalAmount * serviceFeePercentage;
    const vendorPayoutAmount = totalAmount - serviceFeeAmount;

    fetch("http://localhost:8000/api/update-payment-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_status: "vendor_paid", // or your desired status
        total_amount: totalAmount,
        service_fee_amount: serviceFeeAmount,
        vendor_payout_amount: vendorPayoutAmount,
      }),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error("Failed to update payment status");
        }
        return response.json();
      })
      .then((data) => {
        alert("Payment status updated successfully!");
        console.log("Payment status updated:", data);

        // Now update order status
        fetch("http://localhost:8000/api/update-order-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            order_status: "Completed",
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to update order status");
            }
            return res.json();
          })
          .then((data) => {
            alert("Order status updated to Completed.");
            console.log("Order status updated:", data);
          })
          .catch((error) => {
            console.error("Error updating order status:", error.message);
            alert("Error updating order status"); // Optionally alert the user about the error
          });
      })
      .catch((error) => {
        setLoading(false);
        alert("Error updating payment status");
        console.error("Error updating payment status:", error.message);
      });
  };

  return (
    <div className="container mt-5">
      {/* Home Link at the Top Center */}
      <div className="text-center mb-3">
        <a
          className="btn btn-success"
          href="/"
          role="button"
          style={{ fontSize: "1.2em" }}
        >
          Home
        </a>
      </div>
      <div className="jumbotron">
        <h1 className="display-4">Thank You!</h1>
        <p className="lead">Your order has been placed successfully.</p>
        <hr className="my-4" />
        {orderId && (
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        {totalAmount !== null && (
          <p>
            <strong>Total Amount:</strong> {totalAmount} ETB
          </p>
        )}
        <p>You will receive an email with your order details shortly.</p>
        <button
          className="btn btn-success mb-3"
          onClick={handleUpdatePaymentStatus}
          disabled={loading}
        >
          {loading ? "Updating..." : "Release Payment"}
        </button>
        <p className="lead"></p>
      </div>
    </div>
  );
}

export default OrderConfirmation;
// Note: Ensure to replace the API URLs with your actual backend endpoints.
