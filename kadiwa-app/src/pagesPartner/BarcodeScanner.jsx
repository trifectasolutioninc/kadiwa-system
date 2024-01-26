import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing';
import firebaseDB from '../Configuration/config-firebase2';
import { ref, get, set } from 'firebase/database';

const BarcodeScanner = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  const { ref: zxingRef } = useZxing({
    onDecodeResult: (result) => handleScan(result),
  });

  const handleScan = async (result) => {
    if (result && result.getText) {
      const barcodeValue = result.getText();
      console.log('Scanned barcode:', barcodeValue);
  
      // Now you can use the barcodeValue in your logic, such as fetching product information from the database.
      const databaseRef = ref(firebaseDB, `products_info/${barcodeValue}`);

      
      try {
        const snapshot = await get(databaseRef);
        const productData = snapshot.val();
  
        if (productData) {
          setProductInfo(productData);
          setModalVisible(true);
        } else {
          console.log('Product not found in the database.');
        }
      } catch (error) {
        console.error('Error fetching product information:', error);
      }
    }
  };
  

  const handleError = (error) => {
    console.error('Error accessing camera:', error);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddButtonClick = () => {
    if (productInfo) {
      // Construct the unique key for the product entry
      const kdwconnect = sessionStorage.getItem('kdwconnect');
      const productKey = kdwconnect + '-' + productInfo.product_code;

      const productInfoToAdd = {
        product_code: productInfo.product_code,
        product_name: productInfo.product_name,
        commodity_type: productInfo.commodity_type,
        price: productInfo.price,
        unit_measurement: productInfo.unit_measurement,
        keywords: productInfo.keywords,
        id: productKey,
        stock: 0,
      };

      // Save data to Realtime Database with the unique key
      const inventoryRef = ref(firebaseDB, `product_inventory/${productKey}`);
      
      // Use set() instead of update() to create a new entry if it doesn't exist
      set(inventoryRef, productInfoToAdd)
        .then(() => {
          closeModal();
          console.log('Successfully saved.');
        })
        .catch((error) => {
          console.error('Error saving data to database:', error);
          closeModal();
        });
    } else {
      console.warn('Product information is not available.');
      closeModal();
    }
  };

  return (
    <div>
      <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">BARCODE SCANNER</span>
      </div>

      <div id="barcode-reader-container" className="h-screen">
        {/* Use zxingRef in place of videoRef */}
        <video ref={zxingRef} style={{ width: '100%', height: '100%' }} />

      </div>
      {/* Modal for displaying product information */}
      {modalVisible && (
        <div id="product-modal" className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Product Information</h2>
            <div>
              {productInfo && (
                <div>
                  <p>Product Code: {productInfo.product_code}</p>
                  <p>Product Name: {productInfo.product_name}</p>
                  {/* Add other product information fields as needed */}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button id="add-button" className="bg-green-500 text-white px-4 py-2 mr-2" onClick={handleAddButtonClick}>
                Add
              </button>
              <button id="cancel-button" className="bg-red-500 text-white px-4 py-2" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
