// PickupTransaction.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, child, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import { IoQrCode } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import QRCode from 'qrcode';

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

const PickupTransaction = () => {
  const { status } = useParams();
  const [pickupOrders, setPickupOrders] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pickupVerificationId, setPickupVerificationId] = useState('');
  const kdwconnect = sessionStorage.getItem('kdwconnect');

  const handleQRButtonClick = (pickupVerificationId) => {
    setShowQRModal(true);
    setPickupVerificationId(pickupVerificationId);
  };

  const closeModal = () => {
    setShowQRModal(false);
    setPickupVerificationId('');
  };

  useEffect(() => {
    const fetchPickupOrders = async () => {
      const database = configFirebaseDB();
      const pickupOrdersRef = ref(database, 'pickup_orders');
      
      try {
        const snapshot = await get(pickupOrdersRef);
        if (snapshot.exists()) {
          const allPickupOrders = snapshot.val();
          const filteredOrders = Object.values(allPickupOrders).filter(order => order.pickup_status === status);
          setPickupOrders(filteredOrders);
        } else {
          console.error('No pickup orders found.');
        }
      } catch (error) {
        console.error('Error fetching pickup orders:', error);
      }
    };

    fetchPickupOrders();
  }, [status]);

  return (
    <div className=' bg-gray-100'>
      {pickupOrders.length > 0 ? (
        <div className='px-4 '>
          <h2 className='text-green-700 font-bold py-2'>{status.toUpperCase()} STATUS</h2>
          <ul>
            {pickupOrders.map(order => (
              (kdwconnect === order.consumer && order.pickup_status === status) && (
                <li key={order.pickup_verification} className='grid grid-cols-10 bg-white rounded-md shadow-md p-2 mb-2 items-center' >
                  <div className='col-span-6 '>
                      <p className=' font-semibold text-xs '>{order.storename} </p>
                      <p className=' text-gray-400 text-xs  '>{order.date} </p>
                  </div>
                  <p className=' text-red-500 text-xs col-span-2 '>{order.pickup_status.toUpperCase()} </p>
                  {status === 'pending' && (
                    <button 
                      onClick={() =>
                          handleQRButtonClick(order.pickup_verification)
                      }
                     className='text-green-700 col-span-2 mx-auto'><IoQrCode /></button>
                  )}
                  {status === 'complete' && (
                    <button className='text-green-700 col-span-2 mx-auto'><FaCheckCircle /></button>
                  )}
                </li>
              )
            ))}
          </ul>
        </div>
      ) : (
        <p>No pickup orders with status {status} found.</p>
      )}
      {showQRModal && (
        <Modal onClose={closeModal} pickupVerificationId={pickupVerificationId} />
      )}
    </div>
  );
};

export default PickupTransaction;
