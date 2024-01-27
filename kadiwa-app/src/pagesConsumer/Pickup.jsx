// Pickup.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const PickupPage = () => {
  // Use the useLocation hook to get the current location object
  const location = useLocation();

  // Access the state directly
  const order = location.state?.order;

  if (!order) {
    // Handle the case where order is not available (redirect or show an error message)
    return <div>Error: Order information not available.</div>;
  }

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-3xl font-bold mb-4">{order.storeName}</h2>
        <p className="text-gray-600 mb-2">
          Location: {order.city}, {order.province}
        </p>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Product Details:</h3>
          <p className="text-gray-600">
            Product: {order.product.product_name} <br />
            Price: {order.product.price} <br />
            Quantity: {order.quantity}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Delivery Information:</h3>
          <p className="text-gray-600">
            Delivery Option: {order.deliveryOption}
          </p>
        </div>
        <div className="flex justify-end">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
            Confirm Pickup
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm text-center">
          Please bring your order confirmation for pickup.
        </p>
      </div>
    </div>
  );
};

export default PickupPage;
