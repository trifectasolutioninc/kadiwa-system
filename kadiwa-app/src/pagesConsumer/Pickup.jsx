// Pickup.jsx
import React, { useState, useEffect, useRef  } from 'react';
import { useLocation } from 'react-router-dom';
import { get, ref, set } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose, pickupVerificationId }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (qrCodeRef.current) {
      QRCode.toCanvas(qrCodeRef.current, pickupVerificationId, function (error) {
        if (error) console.error(error);
      });
    }
  }, [pickupVerificationId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 w-96 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
        <p className="text-gray-600 mb-4">
          Please use the QR code below for the confirmation of your order.
        </p>
        <div className="flex justify-center mb-4">
          <canvas ref={qrCodeRef} />
        </div>
        <button
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          onClick={onClose}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

const PickupPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pickupVerificationId, setPickupVerificationId] = useState('');
  const location = useLocation();
  const order = location.state?.order;
  const [pickupTime, setPickupTime] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default to Cash
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  console.log(order);

  useEffect(() => {
    // Move the conditional check inside the useEffect
    if (!order) {
      console.error('Error: Order information not available.');
      return;
    }

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(firebaseDB, 'kadiwa_users_account'));
        const userData = snapshot.val();

        if (userData && userData[kdwconnect]) {
          setUserDetails(userData[kdwconnect]);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (kdwconnect) {
      fetchData();
    }
  }, [kdwconnect, order]); 


  const handleConfirmPickup = async () => {
    try {
      const pickupVerificationId = generateVerificationId(); // Implement your logic to generate a verification ID
  
      const pickupData = {
        storename: order.storeName,
        owner_id: order.owner_id,
        consumer: kdwconnect,
        contact: userDetails.contact,
        consumer_name: userDetails.fullname,
        date: getCurrentDateTime(), // Implement your logic to get the current date and time
        payment: order.deliveryOption,
        delivery_status: 'N/A',
        pickup_status: 'pending',
        pickup_verification: pickupVerificationId,
        pickup_time: pickupTime,
        pickup_date: pickupDate,
        recieved_date: 'waiting',
        recieved_datime: 'waiting',
        discounts: '0%' ,
        mode: 'pick-up',
        productList: {
          [order.product.product_code]: {
            commodity_type: order.product.commodity_type,
            product_code: order.product.product_code,
            product_name: order.product.product_name,
            unit_measurement: order.product.unit_measurement,
            subtotal: order.product.price,
            qty: order.quantity,
          },
        },
      };
  
      const pickupRef = ref(firebaseDB, `pickup_orders/${getCurrentDateTime2()}-${order.owner_id}-${kdwconnect}`);
      await set(pickupRef, pickupData);
      setPickupVerificationId(pickupVerificationId);
      setShowModal(true);
      console.log(`Order confirmed for pickup at ${pickupTime} with payment method ${paymentMethod}`);
    } catch (error) {
      console.error('Error confirming pickup:', error);
    }
  };
  
  // Helper function to generate a verification ID
  const generateVerificationId = () => {
    // Implement your logic to generate a unique verification ID
    // For example, you can use a combination of timestamp and random characters
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };
  
  // Helper function to get the current date and time
  const getCurrentDateTime = () => {
    // Implement your logic to get the current date and time in the desired format
    // For example, you can use the Date object and format it accordingly
    const now = new Date();
    return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
  };
  const getCurrentDateTime2 = () => {
    // Implement your logic to get the current date and time in the desired format
    // For example, you can use the Date object and format it accordingly
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/main');
  };

  return (
    <div className="bg-gray-100 min-h-screen  flex items-center justify-center">
      <div className=" p-8  w-96">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Date:
          </label>
          <input
            type="date"
            className="mt-1 p-2 w-full border rounded-md"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Time:
          </label>
          <input
            type="time"
            className="mt-1 p-2 w-full border rounded-md"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Payment Method:
          </label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">Cash</option>
            <option value="Kadiwa Card">Kadiwa Card</option>
            <option value="Gcash">Gcash</option>
            <option value="Megapay">Megapay</option>
            <option value="Maya">Maya</option>
            <option value="Bank">Bank</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            onClick={handleConfirmPickup}
          >
            Confirm Pickup
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm text-center">
          Please bring your order confirmation for pickup.
        </p>
      </div>
      {showModal && (
        <Modal onClose={closeModal} pickupVerificationId={pickupVerificationId} />
      )}
    </div>
  );
};

export default PickupPage;
