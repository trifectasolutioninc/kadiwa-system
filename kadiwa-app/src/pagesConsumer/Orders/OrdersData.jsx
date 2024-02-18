import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { paymentImg } from "../../Configuration/config-file";
import QRCode from "qrcode";
import { getDatabase, ref, get } from 'firebase/database'; // Make sure this is the correct import for Firebase
// Remove the unused Image import

const OrdersData = () => {
    const { tab, status, orderId } = useParams();
    const [order, setOrder] = useState(null);
    const qrCodeCanvasRef = useRef(null);



    
    useEffect(() => {
        console.log("orderId:", orderId); // Debugging: Log orderId
        const fetchOrderData = async () => {
            try {
                const db = getDatabase();
                const orderRef = ref(db, `orders_list/${orderId}`);
                const snapshot = await get(orderRef);
    
                if (snapshot.exists()) {
                    const orderData = snapshot.val();
                    setOrder(orderData);
    
                    // Generate QR code for order ID with transaction code
                    if (qrCodeCanvasRef.current) {
                        const transactionCode = orderData.transaction_code; // Assuming you have transaction_code in your order data
                        const qrText = `${orderId}-${transactionCode}`;
                        console.log("QR Text:", qrText); // Debugging: Log qrText
                        QRCode.toCanvas(qrCodeCanvasRef.current, qrText, function (error) {
                            if (error) {
                                console.error('Error generating QR code:', error);
                            } else {
                                console.log("QR code generated successfully"); // Debugging: Log success
                            }
                        });
                    }
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

                <NavLink to={`/main/orders/${tab}/${status}`} className='flex pt-4 mb-1 items-center px-4 space-x-1'>
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
                            <div className=' flex  justify-center items-center gap-3'>
                                {order.paymentOption === 'Cash' && (
                                    <img src={paymentImg.Cash} alt="Cash" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Gcash' && (
                                    <img src={paymentImg.Gcash} alt="Gcash" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Megapay' && (
                                    <img src={paymentImg.Megapay} alt="Megapay" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Maya' && (
                                    <img src={paymentImg.Maya} alt="Maya" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Kadiwa Card' && (
                                    <img src={paymentImg.KadiwaCard} alt="Kadiwa Card" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Kadiwa QR' && (
                                    <img src={paymentImg.KadiwaQR} alt="Kadiwa QR" className=' h-[1em]' />
                                )}
                                {order.paymentOption === 'Bank' && (
                                    <img src={paymentImg.Bank} alt="Bank" className=' h-[1em]' />
                                )}
                                <p>{order.paymentOption}</p>
                            </div>

                        </div>
                        <div>
                            {order.paymentOption === 'Kadiwa QR' && (
                            <canvas ref={qrCodeCanvasRef} className="mx-auto"></canvas>

                            )}

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
