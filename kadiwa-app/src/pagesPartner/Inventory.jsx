import React from 'react';

const Inventory = () => {
  const storeSelectedValue = (selectedValue) => {
    sessionStorage.setItem('selectedCommodity', selectedValue);
    window.location.href = './inventorylist'; // Redirect to the new HTML page
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
        <div className="commodity-btn flex flex-col">
          <button
            className="text-green-700 bg-white font-bold text-center m-4 rounded shadow p-5"
            onClick={() => storeSelectedValue('All Commodity')}
            data-keyword="All Commodity"
          >
            ALL COMMODITY
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {/* Buttons for each commodity */}
          <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Rice')}
            data-keyword="Imported Commercial Rice"
          >
            RICE
          </button>
          <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Corn')}
            data-keyword="Corn"
            >
            CORN
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Fish')}
            data-keyword="Fish"
            >
            FISH
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Live Stock and Poultry Products')}
            data-keyword="Livestock & Poultry Products"
            >
            LIVESTOCK & POULTRY PRODUCTS
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Vegetables')}
            data-keyword="Lowland Vegetables"
            >
            VEGETABLES
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Spices')}
            data-keyword="Spices"
            >
            SPICES
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Fruits')}
            data-keyword="Fruits"
            >
            FRUITS
            </button>
            <button
            className="commodity-btn flex flex-col items-center justify-center text-center bg-white p-4 rounded text-green-800 shadow-md font-bold"
            onClick={() => storeSelectedValue('Other Basic Commodities')}
            data-keyword="Other Basic Commodities"
            >
            OTHER BASIC COMMODITIES
            </button>

        </div>
      </div>
    </div>
  );
};

export default Inventory;
