import React, { useEffect, useState } from 'react';
import firebaseDB from '../Configuration/config';
import { ref, get, update } from 'firebase/database';
import { Add as AddIcon, Search as SearchIcon, Scanner as ScannerIcon } from '@mui/icons-material';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { useNavigate } from 'react-router-dom';

const InventoryProductList = () => {
    const navigate = useNavigate();
    const [selectedCommodity, setSelectedCommodity] = useState(sessionStorage.getItem('selectedCommodity'));
    const [inventoryData, setInventoryData] = useState([]);
    const [currentItemID, setCurrentItemID] = useState(null);
    const [quantityInput, setQuantityInput] = useState('');
  
  
    useEffect(() => {
      fetchData();
    }, [selectedCommodity]); // Run fetchData when selectedCommodity changes
  
    const fetchData = async () => {
      const db = firebaseDB();
      const inventoryRef = ref(db, 'product_inventory');
      const kdwconnect = sessionStorage.getItem('kdwconnect');
  
      try {
        const snapshot = await get(inventoryRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          let filteredData;
  
          if (selectedCommodity === 'All Commodity') {
            // Filter data based on the condition "item.id starts with contact"
            filteredData = Object.values(data).filter(item => item.id.includes(kdwconnect));
          } else {
            // Filter data based on the selected commodity and contact
            filteredData = Object.values(data).filter(item => item.commodity_type === selectedCommodity && item.id.includes(kdwconnect));
          }
  
          setInventoryData(filteredData);
        } else {
          console.log('No data available.');
          setInventoryData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  
    const showBarcodeScannerModal = () => {
      document.getElementById('barcodeScannerModal').classList.remove('hidden');
    };
  
    const closeBarcodeScannerModal = () => {
      document.getElementById('barcodeScannerModal').classList.add('hidden');
    };
  
    const redirectToDeviceScannerPage = () => {
      // Replace 'device-scanner.html' with the actual path of your device scanner page
      navigate('device-scanner.html');
    };
  
    const redirectToCameraScannerPage = () => {
      // Replace 'camera-scanner.html' with the actual path of your camera scanner page
      navigate('/partner/barcodescanner');
    };
  
    const openAddStockModal = (itemID) => {
        setCurrentItemID(itemID);
      };
    
      const closeAddStockModal = () => {
        setCurrentItemID(null);
        setQuantityInput('');
      };
    
      const addStock = async () => {
        if (!currentItemID) {
          console.error('No item selected for stock update.');
          return;
        }
    
        const quantity = parseInt(quantityInput);
    
        if (!isNaN(quantity) && quantity > 0) {
          const db = firebaseDB();
          const inventoryRef = ref(db, `product_inventory/${currentItemID}`);
    
          try {
            const snapshot = await get(inventoryRef);
            if (snapshot.exists()) {
              const item = snapshot.val();
              const updatedStock = item.stock + quantity;
    
              await update(inventoryRef, { stock: updatedStock });
    
              console.log('Stock updated successfully');
    
              // Update the displayed stock on the UI
              const updatedInventoryData = inventoryData.map((dataItem) => {
                if (dataItem.id === currentItemID) {
                  return {
                    ...dataItem,
                    stock: updatedStock,
                  };
                }
                return dataItem;
              });
    
              setInventoryData(updatedInventoryData);
              closeAddStockModal();
            } else {
              console.error('Item data not found.');
            }
          } catch (error) {
            console.error('Error updating stock:', error);
          }
        } else {
          alert('Please enter a valid quantity.');
        }
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

        <div id="listofcommodity">
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
                <AddIcon/>
              </button>
            </div>
          </div>
        ))}
      </div>

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

   {/* Modal for adding stock */}
   {currentItemID && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
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
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
            />
            <button
              onClick={addStock}
              className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Stock
            </button>
            <button
              onClick={closeAddStockModal}
              className="w-full text-sm text-gray-500 underline hover:text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InventoryProductList;
