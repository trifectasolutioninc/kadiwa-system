import React, { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import { useNavigate } from 'react-router-dom';
import { getDatabase, get, ref, set } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { IoMdQrScanner } from "react-icons/io";


const QRCodeScanner = ({ onSave, onClose }) => {
    const [result, setResult] = useState("");

    const { ref, error } = useZxing({
        onDecodeResult(decodedResult) {
            setResult(decodedResult.getText());
        },
    });

    useEffect(() => {
        if (error) {
            console.error("Error accessing camera:", error);
        }
    }, [error]);

    const handleError = (error) => {
        console.error("Error accessing camera:", error);
    };

    const handleSave = () => {
        onSave(result);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 rounded-md shadow-md relative w-3/4">
                <p className="text-lg font-bold mb-4">Pickup Scanner</p>
                {error && <p className="text-red-500">Error accessing camera: {error.message}</p>}
                <video
                    width="100%"
                    height="auto"
                    autoPlay
                    playsInline
                    ref={ref}
                    onError={handleError}
                />
                {result && (
                    <div>
                        <p className="text-green-700">QR Code Scanned Successfully!</p>

                        <p>Result: {result}</p>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                        >
                            Save
                        </button>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
};



const Order = () => {
    const uid = sessionStorage.getItem('uid');
    const [userInfo, setuserInfo] = useState(null);
    const [storeID, setstoreID] = useState(null);
    const [pickupOrders, setPickupOrders] = useState([]);
    const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (uid) {
                const userDatabaseRef = ref(firebaseDB, `authentication/${uid}`);


                try {
                    const userSnapshot = await get(userDatabaseRef);
                    const userData = userSnapshot.val();
                    setuserInfo(userData);
                    console.log(userData.store_id);
                    if (userData && userData.store_id) {
                        setstoreID(userData.store_id);



                    } else {
                        console.error('User data not found.');
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            }
        };

        

        const fetchPickupOrders = async () => {

            const pickupOrdersRef = ref(firebaseDB, 'orders_list');

            try {
                const snapshot = await get(pickupOrdersRef);
                if (snapshot.exists()) {
                    const allPickupOrders = snapshot.val();
                    const filteredOrders = Object.values(allPickupOrders).filter(order => order.store_id === storeID);
                    setPickupOrders(filteredOrders);
                } else {
                    console.error('No pickup orders found.');
                }
            } catch (error) {
                console.error('Error fetching pickup orders:', error);
            }
        };

        fetchPickupOrders();



        fetchData();

    }, [uid, storeID]);


    const openScannerModal = () => {
        setShowScannerModal(true);
      };
    
      const closeScannerModal = () => {
        setShowScannerModal(false);
      };
    

      const handleSaveScanResult = async (result) => {
        const matchingOrder = pickupOrders.find(order => order.transaction_code === result);
        setScannedResult(result);
        if (matchingOrder) {
            const updatedOrders = pickupOrders.map(order => {
                if (order.transaction_code === result) {
                    return {
                        ...order,
                        status: 'Complete',
                    };
                } else {
                    return order;
                }
            });
    
            // Update the state with the modified orders
            setPickupOrders(updatedOrders);
    
            // Update the order status in Firebase Realtime Database
            const pickupOrdersRef = ref(firebaseDB, 'orders_list');
            try {
                await set(pickupOrdersRef, updatedOrders);
                console.log('Order status updated successfully in Firebase.');
            } catch (error) {
                console.error('Error updating order status in Firebase:', error);
                // Optionally handle the error (e.g., show an error message to the user)
            }
    
            // Close the scanner modal
            closeScannerModal();
        } else {
            console.error('No matching order found for scanned result:', result);
            // Optionally show an error message to the user
            // ...
    
            // Close the scanner modal
            closeScannerModal();
        }
    };



    return (
        <div className=' bg-gray-100'>
            {pickupOrders.length > 0 ? (
                <div className='px-4 '>
                    <h2 className='text-green-700 font-bold py-2'> ORDERS</h2>
                    <ul>
                        {pickupOrders.map(order => (
                            (storeID === order.store_id) && (
                                <li key={order.transaction_code} className='grid grid-cols-10 bg-white rounded-md shadow-md p-2 mb-2 items-center' >
                                    <div className='col-span-6 '>
                                        <p className=' font-semibold text-xs '>{order.store_id} </p>
                                        <p className=' text-gray-400 text-xs  '>{order.date} </p>
                                    </div>
                                    <p className=' text-red-500 text-xs col-span-2 '>{order.status.toUpperCase()} </p>

                                    <button
                                        onClick={openScannerModal}
                                        className='text-green-700 col-span-2 mx-auto'
                                    >
                                        <IoMdQrScanner />
                                    </button>


                                </li>
                            )
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No pickup orders with status {storeID} found.</p>
            )}

            {showScannerModal && (
                <QRCodeScanner
                    onSave={handleSaveScanResult}
                    onClose={closeScannerModal}
                />
            )}
        </div>
    )
}

export default Order
