import React, { useEffect, useState } from 'react';
import database from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import { Add as AddIcon, Search as SearchIcon, Scanner as ScannerIcon } from '@mui/icons-material';
import CropFreeIcon from '@mui/icons-material/CropFree';

const InventoryProductList = () => {
    const [selectedCommodity, setSelectedCommodity] = useState(sessionStorage.getItem('selectedCommodity'));
    const [inventoryData, setInventoryData] = useState([]);
    const [currentItemID, setCurrentItemID] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const inventoryRef = ref(database, 'product_inventory');
          const snapshot = await get(inventoryRef);
  
          if (snapshot.exists()) {
            const data = snapshot.val();
            const inventoryArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setInventoryData(inventoryArray);
          } else {
            console.log('No data available for the selected commodity.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const openAddStockModal = (itemID) => {
      setCurrentItemID(itemID);
      // Add logic to show the modal or handle the state accordingly
    };
  
    const showBarcodeScannerModal = () => {
      document.getElementById('barcodeScannerModal').classList.remove('hidden');
    };
  
    const closeBarcodeScannerModal = () => {
      document.getElementById('barcodeScannerModal').classList.add('hidden');
    };
  
    const redirectToDeviceScannerPage = () => {
      // Replace 'device-scanner.html' with the actual path of your device scanner page
      window.location.href = 'device-scanner.html';
    };
  
    const redirectToCameraScannerPage = () => {
      // Replace 'camera-scanner.html' with the actual path of your camera scanner page
      window.location.href = './inventoryscanner.html';
    };
  
    const addStock = () => {
      const quantityInput = document.getElementById('quantityInput');
      const quantity = parseInt(quantityInput.value);
  
      // Rest of the addStock logic
  
      closeAddStockModal();
    };
  
    const closeAddStockModal = () => {
      document.getElementById('addStockModal').classList.add('hidden');
    };
  

  return (
    <div>
      <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">INVENTORY</span>
      </div>

      {/* Inventory List and Replenishment Toggle */}
      <div className="px-4 flex items-center justify-center">
        <button className="bg-green-500 p-1 text-white rounded">Inventory List</button>
        <button className="p-1">Replenishment</button>
      </div>
      <div className="h-0.5 bg-green-500 mt-1"></div>

      <div className="overflow-auto mb-20">
        <div className="text-center">
          <h1 id="commodity-title" className="text-green-600 ">
            {selectedCommodity}
          </h1>
        </div>
        <div className="grid grid-cols-8 gap-4 bg-gray-200 p-4 rounded-md shadow-md">
          {/* Left side with search input */}
          <div className="flex items-center col-span-7 relative">
            <label htmlFor="searchInput" className="sr-only">
              Search:
            </label>
            <input
              type="text"
              id="searchInput"
              className="border p-2 rounded-md focus:outline-none w-full pl-10"
              placeholder="Search..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-500" />
            </div>
          </div>

          {/* Right side with barcode scanner icon */}
          <div className="flex items-center justify-end col-span-1">
            <button
              id="barcodeScanner"
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label="Barcode Scanner"
              onClick={() => showBarcodeScannerModal()}
            >
              <CropFreeIcon />
            </button>
          </div>
        </div>

        {inventoryData.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded mb-2 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-600 text-lg font-semibold">{item.product_name}</p>
                <p className="text-gray-800 text-sm font-bold" id={`stock-${item.id}`}>
                  Stock: {item.stock} {item.unit_measurement}
                </p>
                <p className="text-gray-500 text-xs font-semibold">Php {item.price}</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                aria-label="View Details"
                onClick={() => openAddStockModal(item.id)}
              >
                <AddIcon />
              </button>
            </div>
          </div>
        ))}

        {/* Popup Modal for Barcode Scanner */}
        <div id="barcodeScannerModal" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 hidden">
          <div className="bg-white p-4 rounded shadow-md max-w-md w-3/4 mx-auto sm:mt-8">
            <h1 className="text-lg font-semibold mb-4 text-center">Choose Scanner</h1>
            <button
              onClick={() => redirectToDeviceScannerPage()}
              className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Use Device Scanner
            </button>
            <button
              onClick={() => redirectToCameraScannerPage()}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Use Camera Scanner
            </button>
            <button
              onClick={() => closeBarcodeScannerModal()}
              className="w-full text-sm text-gray-500 underline hover:text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cancel
            </button>
          </div>
        </div>

        <div
          id="addStockModal"
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 hidden"
        >
          <div className="bg-white p-4 rounded shadow-md max-w-md w-3/4 mx-auto sm:mt-8">
            <h1 className="text-lg font-semibold mb-4 text-center">Add Stock</h1>
            <label htmlFor="quantityInput" className="text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantityInput"
              className="border p-2 rounded-md mb-4 w-full text-gray-600"
              min="1"
              required
            />
            <button
              onClick={() => addStock()}
              className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Stock
            </button>
            <button
              onClick={() => closeAddStockModal()}
              className="w-full text-sm text-gray-500 underline hover:text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryProductList;
