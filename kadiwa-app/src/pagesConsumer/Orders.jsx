import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalShipping } from "react-icons/md";
import { FaJoget } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";
import { ref, getDatabase, orderByChild, equalTo, get } from 'firebase/database';

const Orders = () => {
    const { tab } = useParams();
    const uid = sessionStorage.getItem('uid');
    const [status, setStatus] = useState('Pending');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getDatabase();
                const ordersRef = ref(db, 'orders_list');

                let filteredOrders = [];
                if (tab === 'delivery') {
                    const snapshot = await get(ordersRef);
                    if (snapshot.exists()) {
                        const ordersData = snapshot.val();
                        // Filter orders based on the status
                        filteredOrders = Object.values(ordersData).filter(order => order.shippingOption.toLowerCase() === tab && order.status === status && order.consumer === uid);
                    }
                }

                setOrders(filteredOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchData();
    }, [tab, status]);


    return (
        <div className='h-screen'>
            <div className=' bg-gray-100 h-full'>
                <div className=' bg-white pb-2 shadow-md'>
                    <div className='flex pt-4 mb-1 items-center px-4  space-x-1'>
                        <NavLink to={"/main/profile"} className=''>
                            <IoMdArrowRoundBack />
                        </NavLink>
                        <h1 className="text-lg text-green-600  font-bold">{tab.toUpperCase()}</h1>
                    </div>
                    <hr className='mx-4 pb-2' />
                    {tab === 'delivery' && (
                        <div className='flex space-x-2 overflow-x-auto mx-6'>
                            <button className={`text-[0.8em] whitespace-nowrap text-gray-800 px-2 py-1 rounded-md ${status === 'Pending' && 'bg-green-200'}`} onClick={() => setStatus('Pending')}><MdLocalShipping className=' mx-auto' />To Ship</button>
                            <button className={`text-[0.8em] whitespace-nowrap text-gray-800 px-2 py-1 rounded-md ${status === 'To Receive' && 'bg-green-200'}`} onClick={() => setStatus('To Receive')}><FaJoget className=' mx-auto' />To Receive</button>
                            <button className={`text-[0.8em] whitespace-nowrap text-gray-800 px-2 py-1 rounded-md ${status === 'Completed' && 'bg-green-200'}`} onClick={() => setStatus('Completed')}><FaCheckCircle className=' mx-auto' />Completed</button>
                            <button className={`text-[0.8em] whitespace-nowrap text-gray-800 px-2 py-1 rounded-md ${status === 'Cancelled' && 'bg-green-200'}`} onClick={() => setStatus('Cancelled')}><FiMinusCircle className=' mx-auto' />Cancelled</button>
                        </div>
                    )}
                    {tab === 'pickup' && (
                        <div className='flex space-x-2 overflow-x-auto mx-6'>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaBoxOpen className=' mx-auto' /><span>To Pack</span></button>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaBox className=' mx-auto' />To Distribute</button>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaCheckCircle className=' mx-auto' />Completed</button>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FiMinusCircle className=' mx-auto' />Cancelled</button>
                        </div>
                    )}
                    {tab === 'history' && (
                        <div className='flex space-x-2 overflow-x-auto mx-6'>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaCheckCircle className=' mx-auto' />Completed</button>
                            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FiMinusCircle className=' mx-auto' />Cancelled</button>
                        </div>
                    )}


                </div>
                {/* Display orders */}
                {orders && Object.entries(orders).map(([orderId, order]) => (
                    <div key={orderId} className="p-4 border-b ">
                        <h2 className="text-[0.7em] font-semibold">Order ID: {order.receiptId}</h2>
                        <p>Status: {order.status}</p>
                        <p>Date: {order.date}</p>
                        {/* Render other order details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
