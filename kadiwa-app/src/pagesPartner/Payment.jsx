import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { update, get, ref, set } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { useNavigate } from 'react-router-dom';


const Payment = () => {
    const { userId, receiptNo } = useParams(); // Get userId and receiptNo from URL parameters
    console.log(userId);
    console.log(receiptNo);
    const [paymentMethod, setPaymentMethod] = useState('');
    const kdwconnect = sessionStorage.getItem('kdwconnect');
    const navigate  = useNavigate();
  
    const handlePaymentMethodChange = (method) => {
      setPaymentMethod(method);
    };
  
    const handlePaidButtonClick = async () => {
        // Update payment_method and payment_status in the database
        const receiptRef = ref(firebaseDB, `receipt_collections/${userId}/receipts/${receiptNo}`);
        const receiptSnapshot = await get(receiptRef);
        const receiptData = receiptSnapshot.val();
      
        // Update payment_method and payment_status in the receipt
        await update(receiptRef, {
          payment_method: paymentMethod,
          payment_status: 'paid',
        });
      
        // Fetch the current product_inventory data
        const productInventoryRef = ref(firebaseDB, 'product_inventory');
        const productInventorySnapshot = await get(productInventoryRef);
        const productInventory = productInventorySnapshot.val();
      
        // Update product_inventory stocks based on the products in the receipt
        for (const productId of Object.keys(receiptData.products)) {
          const productData = receiptData.products[productId];
      
          if (productInventory && productInventory[productId]) {
            // Update the stock in product_inventory
            const updatedStock = productInventory[productId].stock - productData.qty;
      
            if (updatedStock >= 0) {
              await update(productInventoryRef, {
                [`${productId}/stock`]: updatedStock,
              });
            } else {
              console.error(`Not enough stock for product ${productId}`);
              // Handle insufficient stock scenario
            }
          } else {
            console.error(`Product ${productId} not found in product_inventory`);
            // Handle product not found scenario
          }
        }
      
        // Add logic for handling payment confirmation
        console.log(`Payment confirmed using ${paymentMethod}`);
        resetProductInventory();
      };
      
      
      const resetProductInventory = async () => {
        try {
          const db = firebaseDB;
          const inventoryRef = ref(db, 'product_inventory');
          
          // Fetch the current inventory data
          const snapshot = await get(inventoryRef);
          const inventoryData = snapshot.val();
      
          // Create an update object to set pos_app_qty to 0 for each product
          const updateObj = {};
          Object.keys(inventoryData).forEach((productId) => {
            if (productId.includes(kdwconnect)) {
              updateObj[`${productId}/pos_app_qty`] = 0;
            }
          });
      
          // Update the database with the new values
          await update(inventoryRef, updateObj);
      
          // Navigate to the desired location after successful update
          navigate('/pos/home');
        } catch (error) {
          console.error('Error resetting product inventory:', error);
        }
      };

      

    return (
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-semibold mb-4">POS Payment</h1>
  
        <div className="flex flex-col space-y-4">
          <label className="block">
            <span className="text-gray-700">Select Payment Method:</span>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Cash">Cash</option>
              <option value="Kadiwa Card">Kadiwa Card</option>
              <option value="Gcash">Gcash</option>
              <option value="Megapay">Megapay</option>
              <option value="Maya">Maya</option>
              <option value="Bank">Bank</option>
            </select>
          </label>
          <button
          onClick={resetProductInventory}
            className="bg-gray-300 text-gray-500 p-2 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
            onClick={handlePaidButtonClick}
            disabled={!paymentMethod}
          >
            Paid
          </button>
        </div>
      </div>
    );
  };
  
  export default Payment;