// import React, { useState, useEffect } from 'react';

// import { get, ref, update, push } from 'firebase/database';
// import { IoCloseOutline, IoStorefrontOutline, IoQrCode } from 'react-icons/io5';
// import { MdOutlineLocalOffer, MdOutlinePayment } from "react-icons/md";
// import { CiDeliveryTruck } from "react-icons/ci";
// import firebaseDB from '../Configuration/config-firebase2';

// const ReceiptComponent = () => {
//     const kdwconnect = sessionStorage.getItem('kdwconnect');
//     const [kadiwaUser, setKadiwaUser] = useState(null);
//     const [latestReceiptNo, setLatestReceiptNo] = useState(0);
//     const [products, setProducts] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [grandTotal, setGrandTotal] = useState(0);
//     const [servicefee, setServiceFee] = useState(0);
//     const [delivery, setDelivery] = useState(0);
//     const [discounts, setDiscounts] = useState(0);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (kdwconnect) {
//                 const contact = kdwconnect;
//                 const databaseRef = ref(firebaseDB, `receipt_collections/${contact}`);
//                 const databaseRef2 = ref(firebaseDB, `kadiwa_users_account/${contact}`);

//                 try {
//                     const snapshot = await get(databaseRef2);
//                     const storeData = snapshot.val();

//                     if (storeData && storeData.id) {
//                         setKadiwaUser(storeData);
//                         console.log(storeData);
//                     } else {
//                         console.error('User data not found.');
//                         return;
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user ID:', error);
//                 }

//                 try {
//                     const snapshot = await get(databaseRef);
//                     const data = snapshot.val();

//                     if (!data) {
//                         setLatestReceiptNo(0);
                        
//                     } else {
//                         setLatestReceiptNo(data.latest_receiptno);
                        
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             }
//         };

//         const fetchProducts = async () => {
//             const productInventoryRef = ref(firebaseDB, 'product_inventory');

//             try {
//                 const snapshot = await get(productInventoryRef);
//                 const productsData = snapshot.val();

//                 if (productsData) {
//                     const filteredProducts = Object.values(productsData).filter(
//                         (product) => product.pos_app_qty !== 0
//                     );

//                     setProducts(filteredProducts);
//                 }
//             } catch (error) {
//                 console.error('Error fetching products data:', error);
//             }
//         };

//         const fetchDataAndGenerateReceipt = async () => {
//             await fetchData(); // Wait for fetchData to complete
//             await fetchProducts(); // Fetch products before generating receipt

//             // Only call generateReceipt if kadiwaUser is available
//             if (kadiwaUser && kadiwaUser.id) {
//                 console.log(kadiwaUser);
//                 await generateReceipt();
//             }
//         };
//         fetchDataAndGenerateReceipt();

//     }, [kdwconnect]);

//     const generateReceipt = async () => {
//         try {
//             console.log('kadiwaUser:', kadiwaUser);
//             if (!kadiwaUser || !kadiwaUser.id) {
//                 throw new Error('User data is not available.');
//             }
//             const newReceiptNo = latestReceiptNo + 1;
//             const databaseRef = ref(firebaseDB, `receipt_collections/${kadiwaUser.id}`);

//             await update(databaseRef, {
//                 latest_receiptno: newReceiptNo,
//             });

//             const newReceiptRef = push(ref(databaseRef, 'receipts'));
//             const newReceiptKey = newReceiptRef.key;

//             const productSubtotal = products
//                 .filter((product) => product.pos_app_qty !== 0)
//                 .reduce((acc, product) => acc + product.pos_app_qty * product.price, 0);


//             const newReceiptData = {
//                 receiptno: newReceiptNo.toString().padStart(7, '0'),
//                 kadiwapts: kadiwaUser.points,
//                 discounts: discounts,
//                 servicefee: servicefee,
//                 delivery: delivery,
//                 total: productSubtotal,
//                 grandtotal: productSubtotal + servicefee + delivery - (kadiwaUser.points + discounts),
//                 type: 'pickup',
//                 payment_method: 'Gcash',
//                 payment_status: 'paid',
//                 kadiwa_card: '2024-0111-1112-1900',
//                 date: '01/31/2024 3:00 PM',
//                 products: products
//                     .filter((product) => product.pos_app_qty !== 0)
//                     .reduce((acc, product) => {
//                         acc[product.product_code] = {
//                             product: product.product_name,
//                             qty: product.pos_app_qty,
//                             price: product.price,
//                             subtotal: product.price * product.pos_app_qty,
//                         };
//                         return acc;
//                     }, {}),
//             };

//             await update(ref(databaseRef, `receipts/${newReceiptKey}`), newReceiptData);

//             setLatestReceiptNo(newReceiptNo);
//         } catch (error) {
//             console.error('Error in generateReceipt:', error);
//         }
//     };

//     const calculateTotal = () => {
//         return products.reduce((total, product) => total + product.pos_app_qty * product.price, 0).toFixed(2);
//     };
    

//     return (
//         <div>
//             <div className="flex justify-around bg-white shadow-md items-center py-8">
//                 <IoCloseOutline size="17px" />
//                 <div className="flex text-center justify-center">
//                     <IoStorefrontOutline size="17px" />
//                     <h2 className="text-xs font-bold">Store Name</h2>
//                 </div>
//                 <p className="text-xs text-gray-600">Receipt No.: 123456</p>
//             </div>
//             <div className="grid grid-cols-4 gap-4 bg-gray-100 mt-1 text-gray-800">
//                 <div className="text-center">
//                     <p className="text-xs font-bold">Product</p>
//                 </div>
//                 <div className="text-center items-center">
//                     <p className="text-xs font-bold">Quantity</p>
//                 </div>
//                 <div className="text-center items-center">
//                     <p className="text-xs font-bold">Price</p>
//                 </div>
//                 <div className="text-center items-center">
//                     <p className="text-xs font-bold">Subtotal</p>
//                 </div>

//                 {products.map((product) => (
//                     <React.Fragment key={product.id}>
//                         <div className="text-center items-center">
//                             <p className="text-xs">{product.product_name}</p>
//                         </div>
//                         <div className="text-center items-center">
//                             <p className="text-xs">{product.pos_app_qty}</p>
//                         </div>
//                         <div className="text-center items-center">
//                             <p className="text-xs">{product.price}</p>
//                         </div>
//                         <div className="text-center items-center">
//                             <p className="text-xs">{product.price * product.pos_app_qty}</p>
//                         </div>
//                     </React.Fragment>
//                 ))}

//             </div>
//             <div id="chosenProducts"></div>
//             <div className="bg-green-700 m-2 rounded-md p-1 space-y-1.5">
//                 <div>
//                     <p className="text-xs text-white">January 18, 2024 | 10:26</p>
//                 </div>
//                 <div className="h-0.5 bg-green-600"></div>
//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white">Total</p>
//                     </div>
//                     <div className="text-right">
//                     <p className="text-xs font-semibold text-white" id="total-amount">{calculateTotal()}</p>

//                     </div>
//                 </div>

//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white">Kadiwa Pts</p>
//                     </div>
//                     <div className="text-right">
//                         <p id="total-amount" className="text-xs font-semibold text-white">- 0.00</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white">Discounts</p>
//                     </div>
//                     <div className="text-right">
//                         <p id="total-amount" className="text-xs font-semibold text-white">0.00</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white">Service Fee</p>
//                     </div>
//                     <div className="text-right">
//                         <p id="total-amount" className="text-xs font-semibold text-white">0.00</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white">Delivery Fee</p>
//                     </div>
//                     <div className="text-right">
//                         <p id="total-amount" className="text-xs font-semibold text-white">0.00</p>
//                     </div>
//                 </div>

//                 <div className="h-0.5 bg-green-600"></div>
//                 <div className="grid grid-cols-4 gap-4 mr-2">
//                     <div className="col-span-2"></div>
//                     <div className="text-right">
//                         <p className="text-xs text-white font-bold">Grand Total</p>
//                     </div>
//                     <div className="text-right">
//                         <p id="total-amount" className="text-xs font-bold text-white">0.00</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="bg-white rounded-md p-5 m-2 shadow-md justify-around flex">
//                 <button className="icon-button text-gray-700">
//                     <IoQrCode />
//                     <p className="text-xs font-bold">Points</p>
//                 </button>
//                 <button className="icon-button text-gray-700">
//                     <MdOutlineLocalOffer />
//                     <p className="text-xs font-bold">Discount</p>
//                 </button>
//                 <button className="icon-button text-gray-700">
//                     <MdOutlinePayment />
//                     <p className="text-xs font-bold">Service Fee</p>
//                 </button>
//                 <button className="icon-button text-gray-700">
//                     <CiDeliveryTruck />
//                     <p className="text-xs font-bold">Delivery Fee</p>
//                 </button>
//             </div>
//             <div className="w-screen flex">
//                 <button className="w-full border border-green-600 m-2 rounded-md text-green-700 font-bold">
//                     CONFIRM
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ReceiptComponent;
