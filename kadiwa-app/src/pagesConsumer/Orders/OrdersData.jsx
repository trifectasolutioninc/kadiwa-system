// OrdersData.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

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
        <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">Order Details</h1>
            {order ? (
                <div>
                    <p className="mb-2"><span className="font-semibold">Order ID:</span> {orderId}</p>
                    <p className="mb-2"><span className="font-semibold">Status:</span> {order.status}</p>
                    <p className="mb-2"><span className="font-semibold">Date:</span> {order.date}</p>
                    <p className="mb-2"><span className="font-semibold">Consumer:</span> {order.consumer}</p>
                    <p className="mb-2"><span className="font-semibold">Payment Option:</span> {order.paymentOption}</p>
                    <p className="mb-2"><span className="font-semibold">Shipping Option:</span> {order.shippingOption}</p>
                    <p className="mb-2"><span className="font-semibold">Total Payment:</span> ₱{order.totalPayment}</p>
                    {/* Display other order details */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h2 className="text-xl font-semibold mb-2">Items</h2>
                        {order.items.map((item, index) => (
                            <div key={index} className="mb-2">
                                <p className="font-semibold">{item.productInfo.product_name}</p>
                                <p className="text-gray-600">{item.productInfo.commodity_type}</p>
                                <p className="text-gray-600">Quantity: {item.productInfo.qty} {item.productInfo.unit_measurement}</p>
                                <p className="text-gray-600">Price: ₱{item.productInfo.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default OrdersData;
