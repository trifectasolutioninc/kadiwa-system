// DeliveryPage.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const DeliveryPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('creditCard');

  if (!order) {
    // Handle the case where order is not available (redirect or show an error message)
    return <div>Error: Order information not available.</div>;
  }

  const handleDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  // Access order information and render the component accordingly
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
          <label className="block mb-2 text-gray-700">Delivery Address:</label>
          <textarea
            value={deliveryAddress}
            onChange={handleDeliveryAddressChange}
            className="w-full border rounded-md px-3 py-2 mb-2"
            rows="4"
          ></textarea>

          <label className="block mb-2 text-gray-700">Mode of Payment:</label>
          <select
            value={paymentMode}
            onChange={handlePaymentModeChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="creditCard">Credit Card</option>
            <option value="debitCard">Debit Card</option>
            <option value="paypal">Megapay</option>
            <option value="paypal">Gcash</option>
            <option value="paypal">Maya</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Confirm Delivery
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm text-center">
          Your order will be delivered to the provided address.
        </p>
      </div>
    </div>
  );
};

export default DeliveryPage;
