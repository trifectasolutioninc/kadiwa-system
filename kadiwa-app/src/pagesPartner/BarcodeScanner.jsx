import React, { useEffect, useState } from 'react';
import Quagga from 'quagga'; // Import Quagga
import firebaseDB from '../Configuration/config';
import { ref, get, update } from 'firebase/database';

const BarcodeScanner = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const startBarcodeScanner = async () => {
      try {
        await import('quagga').then(() => {
          Quagga.init(
            {
              inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: document.querySelector('#barcode-reader'),
              },
              decoder: {
                readers: ['ean_reader', 'code_128_reader', 'code_39_reader', 'upc_reader', 'codabar_reader'],
              },
            },
            function (err) {
              if (err) {
                console.error(err);
                return;
              }

              // Set willReadFrequently to true on the canvas element
              const canvasElement = document.querySelector('#barcode-reader');
              if (canvasElement) {
                canvasElement.willReadFrequently = true;
              }

              Quagga.start();
            }
          );

          Quagga.onDetected(function (result) {
            const barcodeText = result.codeResult.code;

            // Check if the barcode is in the database
            const databaseRef = ref(firebaseDB, `products_info/${barcodeText}`);
            get(databaseRef)
              .then((snapshot) => {
                const productData = snapshot.val();

                if (productData) {
                  setProductInfo(productData);
                  setModalVisible(true);
                } else {
                  console.log('Product not found in the database.');
                }
              })
              .catch((error) => {
                console.error('Error fetching product information:', error);
              });
          });

          document.querySelector('#barcode-reader').style.display = 'block';
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startBarcodeScanner();
  }, []);

  // Function to close the modal
  const closeModal = () => {
      setModalVisible(false);
    };
  
    // Function to handle the "Add" button click
    const handleAddButtonClick = () => {
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
      update(inventoryRef, productInfoToAdd)
        .then(() => {
          closeModal();
          console.log('Successfully saved.');
        })
        .catch((error) => {
          console.error('Error saving data to database:', error);
          closeModal();
        });
  };

  // Placeholder function for fetching product information
  const fetchProductInformation = async (barcode) => {
    return {
      product_code: '123456',
      product_name: 'Sample Product',
    };
  };

  return (
    <div>

      <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">BARCODE SCANNER</span>
      </div>

      <div id="barcode-reader-container" className="h-screen">
        <video id="barcode-reader" className="w-full h-full" ></video>
      </div>

      {/* Modal for displaying product information */}
      {modalVisible && (
        <div id="product-modal" className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Product Information</h2>
            <div>
              {/* Display product information here using productInfo */}
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
