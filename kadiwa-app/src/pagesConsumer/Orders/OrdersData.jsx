import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { getDatabase, ref, get } from 'firebase/database'; // Make sure this is the correct import for Firebase
// Remove the unused Image import

const OrdersData = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const db = getDatabase();
                const orderRef = ref(db, `orders_list/${orderId}`);
                const snapshot = await get(orderRef);

                if (snapshot.exists()) {
                    const orderData = snapshot.val();
                    setOrder(orderData);
                } else {
                    console.log('No such order exists');
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, [orderId]);

    return (
        <>
            <div className='bg-white pb-2 shadow-md top-0 fixed  w-full'>

                <NavLink to={"/main/profile"} className='flex pt-4 mb-1 items-center px-4 space-x-1'>
                    <IoMdArrowRoundBack />

                    <h1 className="text-xs text-green-600 font-bold">BACK</h1>
                </NavLink>

            </div>
            <div className="container mx-auto mt-8 p-8 bg-white ">

                
                {order ? (
                    
                    <div>
                        <p className="text-3xl font-semibold opacity-90">Order Details</p>
                        <div className='mb-4 flex gap-2 text-[1em] items-center'>
                            <p>Status</p>
                            <p className='text-[0.5em] text-gray-600'>⬤</p>
                            <p className='text-red-600 font-semibold'>{order.status}</p>
                            <p className='text-[0.5em] text-gray-600'>⬤</p>
                            <p> {order.date}</p>
                        </div>
                        {/* Display other order details */}
                        <div className="mt-6 border-t border-gray-200 pt-4">
                        
                            <div className='flex gap-2 mb-4'>
                                <p className='text-[1em] text-green-800 font-bold'>Items</p>
                                <p>|</p>
                                <p className='text-gray-800  bg-green-200 rounded-md w-fit px-2 text-[0.6em] items-center flex gap-1'><span className='font-bold'>ORDER ID</span>{orderId}</p>
                            </div>
                            {order.items.map((item, index) => (
                                <div key={index} className="mb-2 ">

                                    <div className=' col-span-7'>
                                        <p className="font-bold text-[1em] text-gray-800">{item.productInfo.product_name}</p>
                                        <p className="text-gray-600  bg-gray-200 rounded-md w-fit px-2 text-[0.6em]">{item.productInfo.commodity_type}</p>
                                        <div className='text-[0.8em] flex justify-between'>
                                            <div className=' flex gap-2'>
                                                <p className="text-gray-800 ">Price: ₱{item.productInfo.price}</p>
                                                <p>X {item.productInfo.qty} </p>
                                                <p>{item.productInfo.unit_measurement}</p>

                                            </div>
                                            <div className='flex gap-2'>
                                                <p className=' '>Subtotal</p>
                                                <p className=' font-bold text-gray-700'>₱{item.productInfo.qty * item.productInfo.price}</p>

                                            </div>

                                        </div>
                                        <hr />
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className=' flex justify-between'>
                            <div>
                                <p className='text-gray-800  bg-green-200 rounded-md w-fit px-2 text-[0.9em] font-semibold items-center flex'>{order.shippingOption}</p>
                            </div>
                            <div>
                             <p className='text-gray-800 text-[0.9em]'>₱{order.shippingOption_price}</p>
                            </div>

                        </div>
                        <div className=' justify-between flex font-bold text-gray-800' >
                            <p>Total Payment</p>
                            <p>₱{order.totalPayment}</p>
                        </div>
                        {/* <div className=' h-20'>

                        </div> */}
                        <hr />
                        <div className='flex justify-between py-4'>
                            <div>
                                <p> Payment Method</p>
                            </div>
                            <div>
                                <p>{order.paymentOption}</p>
                            </div>

                        </div>
                        
                    
                      
                       

                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
};

export default OrdersData;
