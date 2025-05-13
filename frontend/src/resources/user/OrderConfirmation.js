import React from 'react';

function OrderConfirmation() {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Thank You!</h1>
        <p className="lead">Your order has been placed successfully.</p>
        <hr className="my-4" />
        <p>You will receive an email with your order details shortly.</p>
        <p className="lead">
          <a className="btn btn-primary btn-lg" href="/" role="button">Go to Homepage</a>
        </p>
      </div>
    </div>
  );
}

export default OrderConfirmation;