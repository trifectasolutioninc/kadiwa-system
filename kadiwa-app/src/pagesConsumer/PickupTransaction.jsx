// PickupTransaction.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, child, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import { IoQrCode } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

const PickupTransaction = () => {
  const { status } = useParams();
  const [pickupOrders, setPickupOrders] = useState([]);

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
              <li key={order.pickup_verification} className='grid grid-cols-10 bg-white rounded-md shadow-md p-2 mb-2 items-center' >
                <div className='col-span-6 '>
                    <p className=' font-semibold text-xs '>{order.storename} </p>
                    <p className=' text-gray-400 text-xs  '>{order.date} </p>
                </div>
                <p className=' text-red-500 text-xs col-span-2 '>{order.pickup_status.toUpperCase()} </p>
                {status === 'pending' && (
                  <button className='text-green-700 col-span-2 mx-auto'><IoQrCode /></button>
                )}
                {status === 'complete' && (
                  <button className='text-green-700 col-span-2 mx-auto'><FaCheckCircle /></button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No pickup orders with status {status} found.</p>
      )}
    </div>
  );
};

export default PickupTransaction;
